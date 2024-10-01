import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { firstLastDate, typeChart, BaseApiUrl, firstlastMonth, getQuarter, getStartEndMonthInQuarter, getStarEndDateInQuarter } from 'src/app/general';
import { ImportsModule } from 'src/app/imports';
import { ApiService } from 'src/app/services/api.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'ad-filter',
  standalone: true,
  imports: [ImportsModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss'
})
export class FilterComponent {
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
  overviews: any[] = [
    { title: "Đơn hàng", sum: 0 },
    { title: "Doanh Thu", sum: 0 },
    { title: "Chiết Khấu", sum: 0 },
    { title: "Lợi Nhuận", sum: 0 },
  ];
  chitiets: any[] = [];
  filterChiTiets: any[] = [];
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  title = `Ngày ${new Date().toLocaleDateString("vi")}`;
  optionsChart: any | undefined;
  constructor(private service: ApiService, private dataService: DataService) {
    const date = firstLastDate();
    this.firstDay = date.firstDate;
    this.lastDay = date.lastDate;
    this.title = `Ngày ${new Date().toLocaleDateString("vi")}`;
  }
  async ngOnInit() {
    this.optionsChart = {
      isPie: true,
      type: typeChart.Doughnut,
    };
    this.getMonths();
    this.getQuanter();
    this.getYears();
    //this.getAll();
    this.getDonhangs();
  }
  //#region all
  getMonths() {
    for (let i = 1; i < 13; i++) {
      this.thangs.push("Tháng " + i);
    }
  }
  getQuanter() {
    for (let i = 1; i < 5; i++) {
      this.quis.push("Quí " + i);
    }
  }
  getYears() {
    for (let i = new Date().getFullYear(); i > 2022; i--) {
      this.nams.push("Năm " + i);
    }
  }
  //#endregion
  getDonhangs(obj: any = null) {
    let today;
    if (localStorage.getItem("filter")) {
      const today1 = JSON.parse(localStorage.getItem("filter") + "");
      this.firstDay = new Date(today1.firstDay);
      this.lastDay = new Date(today1.lastDay);
      if (localStorage.getItem("reportTitle")) {
        this.title = localStorage.getItem("reportTitle") + "";
      }
    } else {
      this.firstDay = new Date();
      this.lastDay = new Date();
      this.title = `Ngày ${this.firstDay.toLocaleDateString("vi")}`;
    }
    if (!obj)
      obj = {
        pageSize: 100000,
        page: 0,
        startDay: this.firstDay,
        endDay: this.lastDay,
      };
  }
  //#region onClosedMenu
  onClosedMenu(event: any = null) {
    const now = new Date();
    const y = now.getFullYear();
    let today = now.firstLastDate();

    if (!event) {
      if (localStorage.getItem("filter")) {
        today = JSON.parse(localStorage.getItem("filter") + "");
      }

      this.firstDay = new Date(today.firstDay);
      this.lastDay = new Date(today.lastDay);
      this.title = `Ngày ${this.firstDay.toLocaleDateString("vi")}`;
    }
    if (`${event}`.includes("homnay")) {
      this.firstDay = new Date();
      this.lastDay = new Date();
      this.title = `Ngày ${this.firstDay.toLocaleDateString("vi")}`;
    }
    if (`${event}`.includes("Tháng")) {
      const m = parseInt(`${event}`.replace("Tháng", "").trim());
      const mount = firstlastMonth(y, m - 1);
      this.firstDay = mount.firstDay;
      this.lastDay = mount.lastDay;
      this.title = `Tháng ${
        this.firstDay.getMonth() + 1
      }/${this.firstDay.getFullYear()}`;
      localStorage.setItem("reportTitle", this.title);
    }
    if (`${event}`.includes("thangnay")) {
      const m = new Date().getMonth();
      const mount = firstlastMonth(y, m);
      this.firstDay = mount.firstDay;
      this.lastDay = mount.lastDay;
      this.title = `Tháng ${
        this.firstDay.getMonth() + 1
      }/${this.firstDay.getFullYear()}`;
    }
    if (`${event}`.includes("quinay")) {
      const m = getQuarter(new Date());
      const quarter = getStartEndMonthInQuarter();
      this.firstDay = quarter.firsDate;
      this.lastDay = quarter.lastDate;
      this.title = `Quí ${m}/${this.firstDay.getFullYear()}`;
    }
    if (`${event}`.includes("Quí")) {
      const m = parseInt(`${event}`.replace("Quí", "").trim());
      const quarter = getStarEndDateInQuarter(m, y);
      this.firstDay = quarter.firstDate;
      this.lastDay = quarter.lastDate;
      this.title = `Quí ${m}/${this.firstDay.getFullYear()}`;
    }
    if (`${event}`.includes("năm")) {
      this.firstDay = new Date(y, 0, 1);
      this.lastDay = new Date(y, 11, 31, 23, 59, 59, 999);
      this.title = `Năm ${this.lastDay.getFullYear()}`;
    }
    localStorage.setItem("reportTitle", this.title);
    const obj = {
      pageSize: 10000,
      page: 0,
      startDay: this.firstDay,
      endDay: this.lastDay,
    };
    localStorage.setItem(
      "filter",
      JSON.stringify({ firstDay: this.firstDay, lastDay: this.lastDay })
    );
    this.getDonhangs(obj);
    this.filterOrders();
  }
  //#endregion onClosedMenu

  //#region filterOrders
  filterOrders() {
  //  console.log(this.donhangs)
    if (!this.donhangs) return;
    this.overviews = [];
    this.filterOrder = Array.from(this.donhangs as any).filter((x: any) => {
      return x.status != "Đã Hủy";
    });

    this.dataService.sendMessage({ filterOrder: this.filterOrder });
    const tongDon = Array.from(this.filterOrder).length;
    const tongDoanhThu = Array.from(this.filterOrder)
      .map((x: any) => parseInt(x["pay"]))
      .reduce((a: number, b: number) => a + b, 0);
    const tiencong = Array.from(this.filterOrder)
      .map((x: any) => parseInt(x["wage"]))
      .reduce((a: number, b: number) => a + b, 0);
    const tongChietKhau = Array.from(this.filterOrder)
      .map((x: any) => (x["discount"] ? parseInt(x["discount"]) : 0))
      .reduce((a: number, b: number) => a + b, 0);
    this.overviews.push({ title: "Đơn Hàng", sum: tongDon });
    this.overviews.push({ title: "Doanh Thu", sum: tongDoanhThu });
    this.overviews.push({ title: "Chiết Khấu", sum: tongChietKhau });
    this.chitiets = this.filterOrder.map((x: any) => x["details"]).flat();
    this.filterChiTiets = Array.from(this.chitiets);
    const xxs = [...this.filterChiTiets];
    let donutData: any[] = [];
    this.filterChiTiets.forEach((a: any) => {
      const y = xxs
        .filter((f: any) => f.name == a.name)
        .map((f: any) => parseInt(f.quantity))
        .reduce((a: number, b: number) => a + b, 0);
      const item = {
        x: a.name,
        y,
      };
      donutData.push(item);
    });

    this.optionsChart = {
      type: typeChart.Doughnut,
      data: donutData,
    };
    this.dataService.sendMessage({ chart: this.optionsChart });
    this.dataService.sendMessage({
      donut: this.filterChiTiets,
      title: this.title,
      donhangs: this.filterOrder,
      chitiets: this.chitiets,
    });

    const ttChiTiet = Array.from(this.filterChiTiets)
      .map((x: any) => {
        if (!x.quantity) x.quantity = "0";
        if (!x.importPrice) x.importPrice = "0";
        return parseInt(x.quantity) * parseInt(x.importPrice);
      })
      .reduce((a: number, b: number) => a + b, 0);
    // console.log(tongDoanhThu ,tongChietKhau , ttChiTiet , tiencong,tongDoanhThu - tongChietKhau - ttChiTiet + tiencong)
    this.overviews.push({
      title: "Lợi Nhuận",
      sum: tongDoanhThu - tongChietKhau - ttChiTiet + tiencong,
    });
    this.convertDataProduct();
    this.createChartOrder();
  }
  convertDataProduct() {
    const ttChiTiet = Array.from(this.filterChiTiets).map((x: any) => {
      if (!x.quantity) x.quantity = 0;
      if (!x.importPrice) x.importPrice = 0;
      return x;
    });
    // console.log(ttChiTiet)
    const names = [...new Set(ttChiTiet.map((x: any) => x.name))];
    //console.log(names)
    let data = [];
    for (let index = 0; index < names.length; index++) {
      const name = names[index];
      const filters = ttChiTiet.filter((x: any) => x.name == name);
      const count = filters
        .map((x: any) => x.quantity)
        .reduce((a: any, b: any) => a + b, 0);
      const sumImportPrices = filters
        .map((x: any) => parseInt(x.importPrice) * parseInt(x.quantity))
        .reduce((a: any, b: any) => a + b, 0);
      const sumProfit = filters
        .map(
          (x: any) =>
            (parseInt(x.price) - parseInt(x.importPrice)) * parseInt(x.quantity)
        )
        .reduce((a: any, b: any) => a + b, 0);
      const item = {
        name,
        count,
        sumImportPrices,
        sumProfit,
      };
      data.push(item);
    }
    //console.log(data);
  }
  createChartOrder() {
    const ttChiTiet = Array.from(this.filterChiTiets).map((x: any) => {
      if (!x.quantity) x.quantity = 0;
      if (!x.importPrice) x.importPrice = 0;
      return x;
    });
    const orders = this.filterOrder.map((x: any) => {
      x.createdAt = new Date(x.createdAt).toLocaleDateString("vi");
      return x;
    });
    const dates = [...new Set(orders.map((x: any) => x.createdAt))];
    // console.log(dates);
    let data = [];
    for (let index = 0; index < dates.length; index++) {
      const date = dates[index];
      const filter = Array.from(orders).filter((x: any) => x.createdAt == date);
      const count = filter.length;
      const discounts = filter
        .map((x: any) => x.discount)
        .reduce((a: any, b: any) => a + b, 0);
    }
  }
  //#endregion
  onRangeDate(start: any, event: any) {
    if (start == "start") {
      this.firstDay = new Date(event.target.value);
    }
    if (start != "start") {
      this.lastDay = new Date(event.target.value);
    }
    this.title = `Từ ${this.firstDay.toLocaleDateString(
      "vi"
    )} Đến ${this.lastDay.toLocaleDateString("vi")}`;
    const obj = {
      pageSize: 10000,
      page: 0,
      startDay: this.firstDay,
      endDay: this.lastDay,
    };

    this.getDonhangs(obj);
    this.filterOrders();
  }
}
