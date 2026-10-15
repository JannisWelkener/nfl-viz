import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GameAnalysisService } from './game-analysis.service';

@Injectable({
  providedIn: 'root'
})
export class SelectionService {

  constructor(private analysis:GameAnalysisService) { }

  private homeTeamSelected = new BehaviorSubject<boolean>(true);
  homeTeamSelected$ = this.homeTeamSelected.asObservable();

  public playSelected = new BehaviorSubject<any>(null);
  playSelected$ = this.playSelected.asObservable();

  toggleSelectedTeam() {
    this.homeTeamSelected.next(!this.homeTeamSelected.getValue());
  }

  selectedTeam(home:boolean) {
    this.homeTeamSelected.next(home);
  }
}
