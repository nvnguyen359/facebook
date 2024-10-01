import { Component, ViewChild } from "@angular/core";

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexFill,
  ApexYAxis,
  ApexTooltip,
  ApexTitleSubtitle,
  ApexXAxis,
  NgApexchartsModule,
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis | ApexYAxis[];
  title: ApexTitleSubtitle;
  labels: string[];
  stroke: any; // ApexStroke;
  dataLabels: any; // ApexDataLabels;
  fill: ApexFill;
  tooltip: ApexTooltip;
};
import { Order } from "src/app/Models/order";
import { delay } from "src/app/general";
import { DataService } from "src/app/services/data.service";

@Component({
  selector: "app-chart-order",
  templateUrl: "./chart-order.component.html",
  styleUrls: ["./chart-order.component.scss"],
  standalone: true,
  imports: [NgApexchartsModule],
})
export class ChartOrderComponent {
  columnsOrders: any[] = [23, 42, 35, 27, 43, 22, 17, 31, 22, 22, 12, 16];
  columnsDoanhThu: any[] = [
    440, 505, 414, 671, 227, 413, 201, 352, 752, 320, 257, 160,
  ];
  columnsLoiNhuan: any[] = [];
  series = [
    {
      name: "Doanh Thu",
      type: "column",
      data: [440, 505, 414, 671, 227, 413, 201, 352, 752, 320, 257, 160],
    },
    {
      name: "Đơn Hàng",
      type: "line",
      data: [23, 42, 35, 27, 43, 22, 17, 31, 22, 22, 12, 16],
    },
  ];
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions!: Partial<ChartOptions>;
  constructor(private dataService: DataService) {
    this.innit();
  }

  innit() {
    this.chartOptions = {
      series: [
        {
          name: "Doanh Thu",
          type: "column",
          data: [440, 505, 414, 671, 227, 413, 201, 352, 752, 320, 257, 160],
        },
        {
          name: "Đơn Hàng",
          type: "line",
          data: [23, 42, 35, 27, 43, 22, 17, 31, 22, 22, 12, 16],
        },
      ],
      chart: {
        height: 240,
        type: "line",
      },
      stroke: {
        width: [0, 4],
      },
      title: {
        text: "Báo Cáo Bán Hàng",
      },
      dataLabels: {
        enabled: true,
        enabledOnSeries: [1],
      },
      labels: [
        "01 Jan 2001",
        "02 Jan 2001",
        "03 Jan 2001",
        "04 Jan 2001",
        "05 Jan 2001",
        "06 Jan 2001",
        "07 Jan 2001",
        "08 Jan 2001",
        "09 Jan 2001",
        "10 Jan 2001",
        "11 Jan 2001",
        "12 Jan 2001",
      ],
      xaxis: {
        //  type: "datetime",
      },
      yaxis: [
        {
          title: {
            text: "Doanh Thu",
          },
        },
        {
          opposite: true,
          title: {
            text: "Số Lượng",
          },
        },
      ],
    };
    setTimeout(() => {
      this.chartOptions.series = this.series;
    }, 100);
  }
  async ngOnInit() {
    await this.onData();
  }
  async onData() {
    this.dataService.currentMessage.subscribe(async (result: any) => {
      let columnsOrders: any[] = [];
      let columnsDoanhThu: any[] = [];
      if (result?.donhangs && result?.donhangs.length > 0) {
        const donhangs = Array.from(result?.donhangs).reverse().map((x: any) => {
          x.createdAt = `${new Date(x.createdAt).toLocaleDateString("vi")}`;
          return x;
        });

        const dates = [
          ...new Set(donhangs.map((x: any) => x.createdAt)),
        ] as any[];
        dates.forEach((date: any) => {
          const dhsFilter = donhangs.filter((x: any) => x.createdAt == date);
          columnsOrders.push(dhsFilter.length);
          columnsDoanhThu.push(
            Array.from(dhsFilter).reduce(
              (a: any, b: any) => a.pay || 0 + b.pay || 0,
              0
            )
          );
        });
        this.chartOptions.labels = dates;
        this.series[0].data = columnsDoanhThu;
        this.series[1].data = columnsOrders;
        setTimeout(() => {
         
        }, 123);
        await delay(100)
        this.chartOptions.series = //this.series;
        [
          {
            name: "Doanh Thu",
            type: "bar",
            data: columnsDoanhThu,
          },
          {
            name: "Đơn Hàng",
            type: "line",
            data: columnsOrders,
          },
        ]
     //   this.chart.updateOptions(this.chartOptions,true,true)
      }
    });
  }
}
