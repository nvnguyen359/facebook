import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { ImportsModule } from 'src/app/imports';
import { UpsertBalanceComponent } from 'src/app/components/upsert-balance/upsert-balance.component';

@NgModule({
  declarations: [HomeComponent],
  imports: [CommonModule, HomeRoutingModule, ImportsModule,UpsertBalanceComponent,],
})
export class HomeModule {}
