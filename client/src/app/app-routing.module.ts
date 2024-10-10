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
      import('./pages/reports/reports.module').then((m) => m.ReportsModule),
  },
  {
    path: BaseApiUrl.CaiDat,
    loadChildren: () =>
      import('./pages/setting/setting.module').then((m) => m.SettingModule),
  },
  {
    path: BaseApiUrl.TrangChu,
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: BaseApiUrl.Social,
    loadChildren: () =>
      import('./pages/social/social.module').then((m) => m.SocialModule),
  },
  {
    path: BaseApiUrl.PostGroup,
    loadChildren: () =>
      import('./pages/post-gruop/post-gruop.module').then(
        (m) => m.PostGruopModule
      ),
  },
  {
    path: BaseApiUrl.postDaily,
    loadChildren: () =>
      import('./pages/post-daily/post-daily.module').then(
        (m) => m.PostDailyModule
      ),
  },
  {
    path: BaseApiUrl.groupFb,
    loadChildren: () =>
      import('./pages/group-fb/group-fb.module').then((m) => m.GroupFbModule),
  },
  { path: BaseApiUrl.Article, loadChildren: () => import('./pages/article/article.module').then(m => m.ArticleModule) },
  { path: BaseApiUrl.ReportArticle, loadChildren: () => import('./pages/report-article/report-article.module').then(m => m.ReportArticleModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
