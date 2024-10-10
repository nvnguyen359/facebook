import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportArticleComponent } from './report-article.component';

const routes: Routes = [{ path: '', component: ReportArticleComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportArticleRoutingModule { }
