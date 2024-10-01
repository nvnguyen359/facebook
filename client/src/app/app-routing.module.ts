import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BaseApiUrl } from './general';

const routes: Routes = [
  { path: '', redirectTo: `/${BaseApiUrl.TrangChu}`, pathMatch: 'full' },

  {
    path: BaseApiUrl.KhachHang,
    loadChildren: () =>
      import('./pages/khachhang/khachhang.module').then(
        (m) => m.KhachhangModule
      ),
  },
  {
    path: BaseApiUrl.BaoCao,
    loadChildren: () =>
      import('./pages/reports/reports.module').then(
        (m) => m.ReportsModule
      ),
  },
  {
    path: BaseApiUrl.CaiDat,
    loadChildren: () =>
      import('./pages/setting/setting.module').then((m) => m.SettingModule),
  },
  { path: BaseApiUrl.TrangChu, loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
