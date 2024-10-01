import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Options } from 'src/app/Models/chartjs';
import { Order } from 'src/app/Models/order';
import { OrderDetails } from 'src/app/Models/orderDetails';
import {
  firstLastDate,
  BaseApiUrl,
  firstlastMonth,
  getQuarter,
  getStartEndMonthInQuarter,
  getStarEndDateInQuarter,
  typeChart,
  radioGroup,
  Status,
  getItem,
  setItem,
} from 'src/app/general';
import { ApiService } from 'src/app/services/api.service';
import { DataService } from 'src/app/services/data.service';
import { Details } from 'src/app/services/print-html.service';

@Component({
  selector: 'ad-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent {
  firstDay: Date = new Date();
  lastDay: Date = new Date();
  thangs: any[] = [];
  quis: any[] = [];
  nams: any[] = [];

  donhangs: any;
  tongDon: number = 0;
  tongDoanhThu: number = 0;
  tongChietKhau: number = 0;
  filterOrder: any;
  chitiets: any[] = [];
  filterChiTiets: any[] = [];
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  title = `Ngày ${new Date().toLocaleDateString('vi')}`;
  optionsTable: any = {
    url: 'weighStation',
    displayedColumnsChild: [
      'no',
      'customerName',
      'productName',
      'weight1',
      'weight2',
      'cargoVolume',
      'tare',
      'price',
      'numberOfContainers',
    ],
    isShowBt: false,
    displayedColumns: [
      'createdAt',
      'weight1',
      'weight2',
      'cargoVolume',
      'actualVolume',
      'pay',
      'payment',
    ],
    condition: { search: { ieGoods: 'Xuất Hàng' } },
  };
  groupIEGoods = radioGroup;
  condition: any = { search: { ieGoods: 'Xuất Hàng' } };
  activeLink = '';
  click=0;
  constructor(private service: ApiService, private dataService: DataService) {
    const date = firstLastDate();
    this.firstDay = date.firstDate;
    this.lastDay = date.lastDate;
    this.title = `Ngày ${new Date().toLocaleDateString('vi')}`;
    this.click = getItem('load') ? parseInt(getItem('load')) : 0;
    this.click++;
    setItem('load', this.click);
    if (this.click == 1) {
      location.reload();
    }
  }
  async ngOnInit() {
    //console.log(radioGroup);
  }

  onClickTab(ieGoods: any) {

    //this.condition = {search:{ ieGoods }};
    //console.log(ieGoods,this.condition)
    const obj = { status: Status.Add, ieGoods };
    this.dataService.sendMessage(obj);

  }
  eventUpsertTable(event: any) {}
  //#region all
  getMonths() {
    for (let i = 1; i < 13; i++) {
      this.thangs.push('Tháng ' + i);
    }
  }
  getQuanter() {
    for (let i = 1; i < 5; i++) {
      this.quis.push('Quí ' + i);
    }
  }
  getYears() {
    for (let i = new Date().getFullYear(); i > 2022; i--) {
      this.nams.push('Năm ' + i);
    }
  }
  //#endregion

  //#region onClosedMenu
  onClosedMenu(event: any = null) {
    const now = new Date();
    const y = now.getFullYear();
    let today = now.firstLastDate();

    if (!event) {
      if (localStorage.getItem('filter')) {
        today = JSON.parse(localStorage.getItem('filter') + '');
      }

      this.firstDay = new Date(today.firstDay);
      this.lastDay = new Date(today.lastDay);
      this.title = `Ngày ${this.firstDay.toLocaleDateString('vi')}`;
    }
    if (`${event}`.includes('homnay')) {
      this.firstDay = new Date();
      this.lastDay = new Date();
      this.title = `Ngày ${this.firstDay.toLocaleDateString('vi')}`;
    }
    if (`${event}`.includes('Tháng')) {
      const m = parseInt(`${event}`.replace('Tháng', '').trim());
      const mount = firstlastMonth(y, m - 1);
      this.firstDay = mount.firstDay;
      this.lastDay = mount.lastDay;
      this.title = `Tháng ${
        this.firstDay.getMonth() + 1
      }/${this.firstDay.getFullYear()}`;
      localStorage.setItem('reportTitle', this.title);
    }
    if (`${event}`.includes('thangnay')) {
      const m = new Date().getMonth();
      const mount = firstlastMonth(y, m);
      this.firstDay = mount.firstDay;
      this.lastDay = mount.lastDay;
      this.title = `Tháng ${
        this.firstDay.getMonth() + 1
      }/${this.firstDay.getFullYear()}`;
    }
    if (`${event}`.includes('quinay')) {
      const m = getQuarter(new Date());
      const quarter = getStartEndMonthInQuarter();
      this.firstDay = quarter.firsDate;
      this.lastDay = quarter.lastDate;
      this.title = `Quí ${m}/${this.firstDay.getFullYear()}`;
    }
    if (`${event}`.includes('Quí')) {
      const m = parseInt(`${event}`.replace('Quí', '').trim());
      const quarter = getStarEndDateInQuarter(m, y);
      this.firstDay = quarter.firstDate;
      this.lastDay = quarter.lastDate;
      this.title = `Quí ${m}/${this.firstDay.getFullYear()}`;
    }
    if (`${event}`.includes('năm')) {
      this.firstDay = new Date(y, 0, 1);
      this.lastDay = new Date(y, 11, 31, 23, 59, 59, 999);
      this.title = `Năm ${this.lastDay.getFullYear()}`;
    }
    localStorage.setItem('reportTitle', this.title);
    const obj = {
      pageSize: 10000,
      page: 0,
      startDay: this.firstDay,
      endDay: this.lastDay,
    };
    localStorage.setItem(
      'filter',
      JSON.stringify({ firstDay: this.firstDay, lastDay: this.lastDay })
    );
  }
  //#endregion onClosedMenu

  //#region filterOrders

  //#endregion
  onRangeDate(start: any, event: any) {
    if (start == 'start') {
      this.firstDay = new Date(event.target.value);
    }
    if (start != 'start') {
      this.lastDay = new Date(event.target.value);
    }
    this.title = `Từ ${this.firstDay.toLocaleDateString(
      'vi'
    )} Đến ${this.lastDay.toLocaleDateString('vi')}`;
    const obj = {
      pageSize: 10000,
      page: 0,
      startDay: this.firstDay,
      endDay: this.lastDay,
    };
  }
}
