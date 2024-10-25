import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportArticleRoutingModule } from './report-article-routing.module';
import { ReportArticleComponent } from './report-article.component';
import { AdTableComponent } from 'src/app/components/ad-table/ad-table.component';


@NgModule({
  declarations: [
    ReportArticleComponent
  ],
  imports: [
    CommonModule,
    ReportArticleRoutingModule,AdTableComponent
  ]
})
export class ReportArticleModule { }
