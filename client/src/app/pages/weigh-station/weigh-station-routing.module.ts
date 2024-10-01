import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WeighStationComponent } from './weigh-station.component';

const routes: Routes = [{ path: '', component: WeighStationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WeighStationRoutingModule { }
