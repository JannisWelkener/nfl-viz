import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GameVisualizationPage } from './game-visualization.page';

const routes: Routes = [
  {
    path: '',
    component: GameVisualizationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GameVisualizationPageRoutingModule {}
