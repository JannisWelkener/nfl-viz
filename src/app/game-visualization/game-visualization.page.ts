import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import * as Papa from 'papaparse';
import { HttpClient } from '@angular/common/http';
import { GameAnalysisService } from '../services/game-analysis.service';

@Component({
  selector: 'app-game-visualization',
  templateUrl: './game-visualization.page.html',
  styleUrls: ['./game-visualization.page.scss'],
  standalone: false,
})
export class GameVisualizationPage implements OnInit {

  isLoaded:boolean = false;
  landscape=true;

  @HostListener('window:orientationchange')
  @HostListener('window:resize')
  checkOrientation() {
    this.landscape = window.innerHeight < window.innerWidth;
  }

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    public gameAnalysis: GameAnalysisService
  ) {}

  ngOnInit() {
    this.landscape = window.innerHeight < window.innerWidth;

    let gameId = this.route.snapshot.paramMap.get('game_id') || '';
    let file = this.route.snapshot.paramMap.get('file') || '';

    this.gameAnalysis.dataLoaded$.subscribe(loaded => {
      this.isLoaded = loaded;
    });

    this.gameAnalysis.loadGame(file,gameId);
  }

  goBack() {
    this.navCtrl.back();
  }

}
