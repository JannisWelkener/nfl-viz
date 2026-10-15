import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TeamoverviewComponent } from './teamoverview.component';

@NgModule({
  declarations: [TeamoverviewComponent],
  imports: [CommonModule,IonicModule],
  exports: [TeamoverviewComponent],
})
export class TeamoverviewModule {}
