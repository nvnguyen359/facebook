import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SocialRoutingModule } from './social-routing.module';
import { SocialComponent } from './social.component';
import { AdTableComponent } from 'src/app/components/ad-table/ad-table.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AdUpsertComponent } from "../../components/ad-upsert/ad-upsert.component";


@NgModule({
  declarations: [
    SocialComponent
  ],
  imports: [
    CommonModule,
    SocialRoutingModule, AdTableComponent, MatButtonModule, MatIconModule,
    AdUpsertComponent
],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class SocialModule { }
