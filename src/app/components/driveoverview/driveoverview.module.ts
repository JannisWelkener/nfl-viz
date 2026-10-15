import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DriveoverviewComponent } from './driveoverview.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [DriveoverviewComponent],
  imports: [CommonModule,IonicModule],
  exports: [DriveoverviewComponent],
})
export class DriveoverviewModule {}
