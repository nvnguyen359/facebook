import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GroupFbRoutingModule } from './group-fb-routing.module';
import { GroupFbComponent } from './group-fb.component';
import { AdTableComponent } from 'src/app/components/ad-table/ad-table.component';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';


@NgModule({
  declarations: [
    GroupFbComponent
  ],
  imports: [
    CommonModule,
    GroupFbRoutingModule,AdTableComponent,MatIconModule,MatButtonModule,MatSelectModule
  ]
})
export class GroupFbModule { }
