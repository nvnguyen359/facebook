import { Component, Inject } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import './lib.extensions';
import { NavigationStart, Router, RouterEvent } from '@angular/router';
import { BaseApiUrl, Status, links } from './general';
import { HttpClient } from '@angular/common/http';
import { DataService } from './services/data.service';
import { ApiService } from './services/api.service';
import { IpcService } from './services/ipc.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'client';
  showFiller = false;
  pageName?: string = 'Trang Chủ';
  url = '/';
  search = '';
  constructor(
    private _adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private _locale: string,
    private router: Router,
    private http: HttpClient,
    private dataService: DataService,
    private service: ApiService,
    private _ipc: IpcService
  ) {
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationStart) {
        const url = event.url;
        if (!url.includes(BaseApiUrl.BaoCao)) {
          localStorage.setItem('load', '0');
        }
        this.url = url;
        this.pageName = links().find((x: any) => x.link == url)?.text;
      }
    });
  }
  ngOnInit(): void {
    this._ipc.on('pong', (event: Electron.IpcMessageEvent) => {
      console.log('pong');
    });

    this._ipc.send('ping');
    // this.http
    //   .get("http://localhost:3177/api/database")
    //   .subscribe((data: any) => console.log(data));
    this.vi();
  }
  vi() {
    this._locale = 'vi';
    this._adapter.setLocale(this._locale);
  }
  onRefesh() {
    // Refresh the page
    location.reload();
  }
  onSearch() {
    if (this.search != '') {
      const item = document.getElementById('id-input-search');
      if (item) {
        item.style.width = '100%';
        item.style.opacity = '1';
        item.focus();
      }
    }
    this.dataService.sendMessage({ value: this.search, status: Status.Search });
  }
  onShowSearch() {
    return this.search != '' ? 'show' : '';
  }
  onClose() {
    this.search = '';
    this.dataService.sendMessage({ value: '', status: Status.Search });
  }
  onCloseWindow() {
    this.service.eventWindow('close').then((e: any) => console.log(e));
  }
  onMinimize() {
    this.service.eventWindow('min').then((e: any) => console.log(e));
  }
  onMaximize() {
    this.service.eventWindow('max').then((e: any) => console.log(e));
  }
}
