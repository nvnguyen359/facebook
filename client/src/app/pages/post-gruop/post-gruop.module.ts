import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PostGruopRoutingModule } from './post-gruop-routing.module';
import { PostGruopComponent } from './post-gruop.component';


@NgModule({
  declarations: [
    PostGruopComponent
  ],
  imports: [
    CommonModule,
    PostGruopRoutingModule
  ]
})
export class PostGruopModule { }
