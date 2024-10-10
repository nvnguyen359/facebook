import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportArticleRoutingModule } from './report-article-routing.module';
import { ReportArticleComponent } from './report-article.component';


@NgModule({
  declarations: [
    ReportArticleComponent
  ],
  imports: [
    CommonModule,
    ReportArticleRoutingModule
  ]
})
export class ReportArticleModule { }
