import { Injectable } from "@angular/core";
import { Chart, registerables } from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { typeChart } from "../general";
Chart.register(...registerables);
Chart.register(ChartDataLabels);
@Injectable({
  providedIn: "root",
})
export class ChartjsService {
  private _type: any | undefined;
  private _data: any;
  private _options: any;
  private _0Xs: any;
  private _0Ys: any;
  private _idElement: any;
  private chartjs!: Chart;
  constructor() {}

  set IdElementHtml(id: any) {
    this._idElement = id;
  }
  set Data(data: any) {
    this._data = data;
  }
  set Oxs(oxs: any) {
    this._0Xs = oxs;
  }
  get Oxs() {
    return this._0Xs;
  }
  set Oys(oxs: any) {
    this._0Ys = oxs;
  }
  get Oys() {
    return this._0Ys;
  }
  set Options(options: any) {
    this._idElement = options;
  }
  drawChart(datas: any = null, id = "") {
    if (datas && datas.labels) this.Oxs = datas.labels;

    if (id) this.IdElementHtml = id;
    let dd = [];
    for (let index = 0; index < 5; index++) {
      const element = Math.floor(Math.random() * 101);
      dd.push(element);
    }
    if (datas && Array.isArray(datas.data)) {
      this.Oys = datas.data;
    } else {
    }
    const data = {
      labels: !this.Oxs
        ? ["Red", "Orange", "Yellow", "Green", "Blue"]
        : this.Oxs,
      datasets: [
        {
          // label: "Dataset 1",
          data: !this.Oys ? dd : this.Oys,
          // backgroundColor: Object.values(Utils.CHART_COLORS),
        },
      ],
    };

    if (!this._type) this._type = "doughnut";
    if (!this._data) this._data = data;
    const type = this._type;
    let _0ys = !this.Oys ? dd : this.Oys;

    if (this.chartjs) {
      this.chartjs.data.labels = this.Oxs;
      this.chartjs.data.datasets[0].data = _0ys;
      this.chartjs.update();
    }
    const obj = {
      type: this._type,
      data: this._data,
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: false,
            stacked: true,
          },
          x: {
            stacked: true,
          },
        },
        plugins: {
          datalabels: {
            color: "white",
            anchor: "center",
            align: "center",
            formatter: function (value: any, context: any) {
              if (type == typeChart.Doughnut) {
                // console.log(context.dataset.data)
                const sum = Array.from(context.dataset.data).reduce(
                  (a: any, b: any) => a + b,
                  0
                ) as any;
                let it = Number((value * 100) / sum);

                return it < 4 && context.dataset.data.length > 15
                  ? ""
                  : it.toFixed(1) + "%";
              } else {
                return Math.round(value);
              }
            },
            font: {
              weight: "500",
              size: 14,
            },
          },
          legend: {
            position: "top",
            display: false,
          },
          title: {
            display: false,
            text: "Chart.js Doughnut Chart",
          },
        },
      },
    };
    if(this.chartjs!=undefined)
    {
      this.chartjs.destroy();
    }
    this.chartjs = new Chart(this._idElement, obj);
  
  }
}
var barChartData = {
  labels: ["5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
  datasets: [
    {
      label: "So Luong",
      yAxisID: "line",
      backgroundColor: "pink",
      borderColor: "red",
      type: "line",
      fill: false,
      data: [80, 130, 100, 140, 138, 125, 110, 145],
    },
    {
      label: "Paypal",
      yAxisID: "bar-stack",
      backgroundColor: "lightgreen",
      borderColor: "green",
      borderWidth: 1,
      stack: "now",
      data: [100, 70, 40, 60, 90, 70],
    },
    {
      label: "Visa",
      yAxisID: "bar-stack",
      backgroundColor: "yellow",
      borderColor: "orange",
      borderWidth: 1,
      stack: "now",
      data: [60, 90, 70, 30, 100, 70],
    },
  ],
};

var chartOptions = {
  responsive: true,
  scales: {
    yAxes: [
      {
        id: "bar-stack",
        position: "left",
        stacked: true,
        ticks: {
          beginAtZero: true,
        },
      },

      {
        id: "line",
        position: "right",
        stacked: false,
        ticks: {
          beginAtZero: true,
        },
        gridLines: {
          drawOnChartArea: false,
        },
      },
    ],
  },
};

// window.onload = function() {
//   var ctx = document.getElementById("canvas").getContext("2d");
//   window.myBar = new Chart(ctx, {
//     type: "bar",
//     data: barChartData,
//     options: chartOptions
//   });
// };
