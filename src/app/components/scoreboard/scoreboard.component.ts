import { Component, OnInit } from '@angular/core';
import { GameAnalysisService } from 'src/app/services/game-analysis.service';
import { SelectionService } from 'src/app/services/selection.service';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-scoreboard',
  templateUrl: './scoreboard.component.html',
  styleUrls: ['./scoreboard.component.scss'],
  standalone: false
})
export class ScoreboardComponent  implements OnInit {

  constructor(public selection:SelectionService,public analysis:GameAnalysisService,public team:TeamService) { }

  selectedTeam:boolean=true;

  scoreAway = 0;
  scoreHome = 0;

  calcMarginHome(){
    let totalScore = this.scoreHome + this.scoreAway;
    let size = this.scoreHome / totalScore * 100;

    if(this.scoreHome == this.scoreAway){size = 50;}
    let color = this.team.teamColor(this.analysis.home);
    return{
      //marginRight: 50 - size + "%",
      width: size + "%",
      background: "linear-gradient(90deg,"+color+" 0%, rgba(20, 20, 20, 1) 100%)"
    }
  }

  calcMarginAway(){
    let totalScore = this.scoreHome + this.scoreAway;
    let size = this.scoreAway / totalScore * 100;
    if(this.scoreHome == this.scoreAway){size = 50;}
    let color = this.team.teamColor(this.analysis.away);
    return{
      //marginLeft: 50 - size + "%",
      width: size + "%",
      background: "linear-gradient(90deg,rgba(20, 20, 20, 1) 0%, "+color+" 100%)"
    }
  }

  ngOnInit() {
    this.selection.homeTeamSelected$.subscribe(value => {
      this.selectedTeam = value;
    });

    this.selection.playSelected$.subscribe(value => {
      this.scoreHome = +value.total_home_score;
      this.scoreAway = +value.total_away_score;
    });
  }

  toggleTeam(){
    this.selection.toggleSelectedTeam();
  }

  selectedTeamColor(){
    let teamAbbrev = this.selectedTeam ? this.analysis.home : this.analysis.away;
    let color = this.team.teamColor(teamAbbrev);
    return color;
  }

  selectTeam(home:boolean){
    this.selection.selectedTeam(home);
  }



}
