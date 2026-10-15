import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as Papa from 'papaparse';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameAnalysisService {

  constructor(private http: HttpClient) { }

  allPlaysOfGame: any[] = [];
  drives: any[] = [];
  amountOfPlays = 0;
  home = "";
  away = "";

  totalHomePassingYards = 0;
  totalAwayPassingYards = 0;

  radarChartDataHome:any[] = [];
  radarChartDataAway:any[] = [];


  dataLoaded$ = new BehaviorSubject<boolean>(false);

  loadGame(file: string, gameID: string) {
    this.reset();

    this.loadAllPlays(file,gameID);
  }

  loadAllPlays(file: string, gameID: string){
    console.log("[GameAnalysisService] Loading: "+'assets/data/' + file + '.csv' + ", ID: "+gameID)
    this.http.get('assets/data/' + file + '.csv', { responseType: 'text' })
      .subscribe(csvData => {
        Papa.parse(csvData, {
          header: true,
          complete: (result) => {
            this.allPlaysOfGame = result.data.filter((row: any) => row.game_id === gameID);

            if(this.allPlaysOfGame.length > 0){
              console.log("[GameAnalysisService] Game loaded successfully");
            }else{
              console.warn("[GameAnalysisService] Game not loaded successfully");
            }

            this.analyseGame();

            //Analysis complete
            this.dataLoaded$.next(true);
          }
        })
      });
  }

  analyseGame(){
    this.amountOfPlays = this.allPlaysOfGame.length - 1;
    this.home = this.allPlaysOfGame[0].home_team;
    this.away = this.allPlaysOfGame[0].away_team;

    console.log("[GameAnalysisService] Analysing plays from game "+this.home +" vs "+this.away);
    this.loadDriveData();

    this.extractRadarChartData();

    //@Pascal add your own analysis here if neccessary

    console.log("[GameAnalysisService] Plays: "+this.amountOfPlays+ ", Drives: "+this.drives.length);
  }

    loadDriveData() {
    let counter = 1;
    let allDrives = [];
    let drive = [];
    for (let play of this.allPlaysOfGame) {
      if (play.drive == counter) {
        drive.push(play);
      } else {
        counter++;
        allDrives.push(drive);
        drive = [];
        drive.push(play);
      }
    }
    allDrives.push(drive);
    this.drives = allDrives;
  }

  reset() {
    this.dataLoaded$.next(false);
    this.allPlaysOfGame = [];
    this.drives = [];
  }

  extractRadarChartData(){
    let allPlaysHome = this.allPlaysOfGame.filter((play)=>{return play.posteam == this.home});
    let allPlaysAway = this.allPlaysOfGame.filter((play)=>{return play.posteam == this.away});

    let allPassPlaysHome = allPlaysHome.filter((play)=>{return play.play_type === "pass"});
    let allPassPlaysAway = allPlaysAway.filter((play)=>{return play.play_type === "pass"});

    let passingYardsHome = 0;
    let passingYardsAway = 0;

    for(let p of allPassPlaysHome){
        passingYardsHome += +p.yards_gained;
    }

    for(let p of allPassPlaysAway){
        passingYardsAway += +p.yards_gained;
    }


    let allRushPlaysHome = allPlaysHome.filter((play)=>{return play.play_type === "run" || play.play_type === "qb_kneel"});
    let allRushPlaysAway = allPlaysAway.filter((play)=>{return play.play_type === "run" || play.play_type === "qb_kneel"});

    let rushingYardsHome = 0;
    let rushingYardsAway = 0;

    for(let p of allRushPlaysHome){
      rushingYardsHome += +p.yards_gained;
    }

    for(let p of allRushPlaysAway){
      rushingYardsAway += +p.yards_gained;
    }


    let allCompletedPassesHome = allPassPlaysHome.filter((play)=>{return play.complete_pass == 1});
    let allCompletedPassesAway = allPassPlaysAway.filter((play)=>{return play.complete_pass == 1});

    let takeawaysHome = allPlaysAway.filter(play => {return play.fumble_lost == 1 || play.interception == 1}).length;
    let takeawaysAway = allPlaysHome.filter(play => {return play.fumble_lost == 1 || play.interception == 1}).length;

    let compPercHome = allCompletedPassesHome.length/allPassPlaysHome.length;
    let compPercAway = allCompletedPassesAway.length/allPassPlaysAway.length;

    //Normalized using Superbowl-Era Records (except Takeaways)
    this.radarChartDataHome = [passingYardsHome / 527,rushingYardsHome / 296,compPercHome,(passingYardsAway+rushingYardsAway)/500,takeawaysHome/5,compPercAway];
    this.radarChartDataAway = [passingYardsAway / 527,rushingYardsAway / 296,compPercAway,(passingYardsHome+rushingYardsHome)/500,takeawaysAway/5,compPercHome];
  }
}
