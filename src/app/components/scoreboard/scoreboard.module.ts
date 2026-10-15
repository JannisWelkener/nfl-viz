import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ScoreboardComponent } from './scoreboard.component';

@NgModule({
  declarations: [ScoreboardComponent],
  imports: [CommonModule,IonicModule],
  exports: [ScoreboardComponent],
})
export class ScoreboardModule {}
