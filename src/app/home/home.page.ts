import { Component, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as Papa from 'papaparse';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  constructor(private http: HttpClient,private router: Router) {}

  landscape = true;

  games:any[] = [];

  ngOnInit() {
    this.landscape = window.innerHeight < window.innerWidth;
    this.loadCSV();
  }

  @HostListener('window:orientationchange')
  @HostListener('window:resize')
  checkOrientation() {
    this.landscape = window.innerHeight < window.innerWidth;
  }

  selectedOption = 'post';
  selectedSeason: string = '2019';

  currentOption = 'post';
  currentSeason: string = '2019';

  seasons = [
    '2009',
    '2010',
    '2011',
    '2012',
    '2013',
    '2014',
    '2015',
    '2016',
    '2017',
    '2018',
    '2019'
  ]

  load_season_data(){
    this.currentOption = this.selectedOption;
    this.currentSeason = this.selectedSeason;
    this.loadCSV();
  }

  loadCSV() {
    this.games = [];
    this.http.get('assets/data/'+this.selectedOption+'_pbp_'+this.selectedSeason+'.csv', { responseType: 'text' })
      .subscribe(csvData => {
        Papa.parse(csvData, {
          header: true,
          complete: (result) => {

            const data: any[] = result.data as any[];

            const validData = data.filter(row => {
              return row.game_id && row.home_team && row.away_team &&
                     row.total_home_score !== undefined && row.total_away_score !== undefined;
            });

            const gameMap = new Map<string, { home_team: any; away_team: any; final_home_score: any; final_away_score: any; game_date: any; }>();

            validData.forEach(row => {
              const { game_id, home_team, away_team, total_home_score, total_away_score, game_date } = row;

              if (!gameMap.has(game_id)) {
                gameMap.set(game_id, { home_team, away_team, final_home_score: 0, final_away_score: 0, game_date });
              }

              const currentGame = gameMap.get(game_id);
              if (currentGame) {
                currentGame.final_home_score = total_home_score;
                currentGame.final_away_score = total_away_score;
              }
            });

            const gameArray = Array.from(gameMap, ([game_id, info]) => ({
              game_id,
              info
            }
            ));
            this.games = gameArray;
          }
        });
      });
  }

  select_game(game_id:any){
    this.router.navigate(['/game-visualization', game_id,this.currentOption+"_pbp_"+this.currentSeason]);
  }

  get_team_name_and_color(abbreviation: string): { name: string; color: string } {
    const teamMap: { [key: string]: { name: string; color: string } } = {
      CIN: { name: 'Cincinnati Bengals', color: '#FB4F14' },
      ATL: { name: 'Atlanta Falcons', color: '#A71930' },
      NE:  { name: 'New England Patriots', color: '#002244' },
      KC:  { name: 'Kansas City Chiefs', color: '#E31837' },
      DAL: { name: 'Dallas Cowboys', color: '#003594' },
      GB:  { name: 'Green Bay Packers', color: '#203731' },
      BUF: { name: 'Buffalo Bills', color: '#00338D' },
      TEN: { name: 'Tennessee Titans', color: '#4B92DB' },
      SEA: { name: 'Seattle Seahawks', color: '#002244' },
      PIT: { name: 'Pittsburgh Steelers', color: '#FFB612' },
      LA:  { name: 'Los Angeles Rams', color: '#003594' },
      STL: { name: 'St. Louis Rams', color: '#003594' },
      LAC: { name: 'Los Angeles Chargers', color: '#0080C6' },
      MIA: { name: 'Miami Dolphins', color: '#008E97' },
      CHI: { name: 'Chicago Bears', color: '#0B162A' },
      IND: { name: 'Indianapolis Colts', color: '#002C5F' },
      MIN: { name: 'Minnesota Vikings', color: '#4F2683' },
      HOU: { name: 'Houston Texans', color: '#03202F' },
      BAL: { name: 'Baltimore Ravens', color: '#241773' },
      WAS: { name: 'Washington Commanders', color: '#5A1414' },
      CAR: { name: 'Carolina Panthers', color: '#0085CA' },
      NYG: { name: 'New York Giants', color: '#0B2265' },
      NYJ: { name: 'New York Jets', color: '#125740' },
      LV:  { name: 'Las Vegas Raiders', color: '#000000' },
      OAK: { name: 'Oakland Raiders', color: '#000000' },
      ARI: { name: 'Arizona Cardinals', color: '#97233F' },
      DET: { name: 'Detroit Lions', color: '#0076B6' },
      JAX: { name: 'Jacksonville Jaguars', color: '#006778' },
      JAC: { name: 'Jacksonville Jaguars', color: '#006778' },
      NO:  { name: 'New Orleans Saints', color: '#D3BC8D' },
      SF:  { name: 'San Francisco 49ers', color: '#AA0000' },
      PHI: { name: 'Philadelphia Eagles', color: '#004C54' },
      TB:  { name: 'Tampa Bay Buccaneers', color: '#D50A0A' },
      CLE: { name: 'Cleveland Browns', color: '#311D00' },
      DEN: { name: 'Denver Broncos', color: '#000080' },
      SD:  { name: 'San Diego Chargers', color: '#0080C6' },
      APR: { name: 'AFC ProBowl Roster', color: '#D00000' },
      NPR: { name: 'NFC ProBowl Roster', color: '#0073CF' },
      AFC: { name: 'AFC ProBowl Roster', color: '#D00000' },
      NFC: { name: 'NFC ProBowl Roster', color: '#0073CF' },
      RIC: { name: 'Team Jerry Rice', color: '#0073CF' },
      SAN: { name: 'Team Deion Sanders', color: '#D00000' },
      CRT: { name: 'Team Cris Carter', color: '#0073CF'},
      IRV: { name: 'Team Michael Irvin', color: '#D00000' },
    };

    return teamMap[abbreviation] || { name: 'Team Not Found', color: '#CCCCCC' };
  }



}
