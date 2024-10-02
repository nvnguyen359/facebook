import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GroupFbRoutingModule } from './group-fb-routing.module';
import { GroupFbComponent } from './group-fb.component';


@NgModule({
  declarations: [
    GroupFbComponent
  ],
  imports: [
    CommonModule,
    GroupFbRoutingModule
  ]
})
export class GroupFbModule { }
