import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostDailyComponent } from './post-daily.component';

const routes: Routes = [{ path: '', component: PostDailyComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PostDailyRoutingModule { }
