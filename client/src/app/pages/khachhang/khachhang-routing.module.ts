import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KhachhangComponent } from './khachhang.component';

const routes: Routes = [{ path: '', component: KhachhangComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KhachhangRoutingModule { }
