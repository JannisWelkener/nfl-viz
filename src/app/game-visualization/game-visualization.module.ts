import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GameVisualizationPageRoutingModule } from './game-visualization-routing.module';

import { GameVisualizationPage } from './game-visualization.page';
import { DriveoverviewModule } from '../components/driveoverview/driveoverview.module';
import { TeamoverviewModule } from '../components/teamoverview/teamoverview.module';
import { ScoreboardModule } from '../components/scoreboard/scoreboard.module';
import { TreemapModule } from '../components/treemap/treemap.module';
import { HeatmapModule } from '../components/heatmap/heatmap.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GameVisualizationPageRoutingModule,
    DriveoverviewModule,
    TeamoverviewModule,
    ScoreboardModule,
    TreemapModule,
    HeatmapModule
  ],
  declarations: [GameVisualizationPage]
})
export class GameVisualizationPageModule {}
