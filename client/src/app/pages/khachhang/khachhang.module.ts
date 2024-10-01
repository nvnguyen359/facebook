import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KhachhangRoutingModule } from './khachhang-routing.module';
import { KhachhangComponent } from './khachhang.component';


@NgModule({
  declarations: [
    KhachhangComponent
  ],
  imports: [
    CommonModule,
    KhachhangRoutingModule
  ]
})
export class KhachhangModule { }
