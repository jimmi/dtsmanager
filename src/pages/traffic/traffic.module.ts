import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TrafficPage } from './traffic';

@NgModule({
  declarations: [
    TrafficPage,
  ],
  imports: [
    IonicPageModule.forChild(TrafficPage),
  ],
})
export class TrafficPageModule {}
