import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GroupFbRoutingModule } from './group-fb-routing.module';
import { GroupFbComponent } from './group-fb.component';
import { AdTableComponent } from 'src/app/components/ad-table/ad-table.component';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ScheduleComponent } from 'src/app/components/schedule/schedule.component';

import { FormsModule } from '@angular/forms';
import { IGX_TIME_PICKER_DIRECTIVES } from 'igniteui-angular/public_api';


@NgModule({
  declarations: [
    GroupFbComponent
  ],
  imports: [
    CommonModule,
    GroupFbRoutingModule,AdTableComponent,MatIconModule,MatButtonModule,MatSelectModule,MatTooltipModule,ScheduleComponent,FormsModule
    
  ]
})
export class GroupFbModule { }
