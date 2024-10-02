import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostGruopComponent } from './post-gruop.component';

const routes: Routes = [{ path: '', component: PostGruopComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PostGruopRoutingModule { }
