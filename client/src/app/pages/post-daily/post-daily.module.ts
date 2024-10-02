import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PostDailyRoutingModule } from './post-daily-routing.module';
import { PostDailyComponent } from './post-daily.component';


@NgModule({
  declarations: [
    PostDailyComponent
  ],
  imports: [
    CommonModule,
    PostDailyRoutingModule
  ]
})
export class PostDailyModule { }
