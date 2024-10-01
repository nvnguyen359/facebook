import { Injectable } from "@angular/core";
import { Chart } from "chart.js/auto";
import { Options } from "src/app/Models/chartjs";
import { typeChart } from "src/app/general";

@Injectable({
  providedIn: "root",
})
export class CreateChart {
  _options!: Options;
  private _idElement: any;
  chartJs!: Chart;
  private _datasets: any;
  private _type: any;
  private _labels: string[] = [];
  private Axes: string[] = [];
  backgroundColor = [
    "rgba(255, 99, 132, 0.95)",
    "rgba(255, 159, 64, 0.95)",
    "rgba(255, 205, 86, 0.95)",
    "rgba(75, 192, 192, 0.95)",
    "rgba(54, 162, 235, 0.95)",
    "rgba(153, 102, 255, 0.95)",
    "rgba(201, 203, 207, 0.95)",
  ];
  constructor() {}
  set Options(op: any) {
    this._options = op;
  }
  set IdElement(op: any) {
    this._idElement = op;
  }
  get Options() {
    return this._options;
  }
  set Type(o: any) {
    this._type = o;
  }
  /**
   *type: typeChart,// kiểu đồ thị
   *label?: string,// hiển thị nhãn
   *axesX: data trục x
   * @memberof CreateChart
   */
  set Datasets(op: DatasetChartjs[]) {
    this._datasets = op;
  }
  /**
   *@param datasets  {
          type: "bar",
          label: "Bar Dataset",
          data: [10, 20, 30, 40],
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: this.backgroundColor,
        }
   *
   * @memberof CreateChart
   */
  set Labels(op: string[]) {
    this._labels = op;
  }
  initData() {
    return [
      { x: 2010, y: 10 },
      { x: 2011, y: 20 },
      { x: 2012, y: 15 },
      { x: 2013, y: 25 },
      { x: 2014, y: 22 },
      { x: 2015, y: 30 },
      { x: 2016, y: 28 },
    ];
  }
  /** 
   * @param labels   ["January", "February", "March", "April"],
   * @param datasets  {
          type: "bar",
          label: "Bar Dataset",
          data: [10, 20, 30, 40],
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: this.backgroundColor,
        }
   * @returns 
   */
  private changeData() {
    return {
      labels: this._labels,
      datasets: this._datasets,
    };
  }
  drawChart(labels: any, datasets: any,type='line') {
    this._labels = labels;
    this._datasets = datasets;
    const config = {
      type:type,
      data: this.changeData(),
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    };
    if (this.chartJs) {
      this.chartJs.destroy();
    }
    this.chartJs = new Chart(this._idElement, config);
  }
  mixChart() {
    const data = {
      labels: ["January", "February", "March", "April"],
      datasets: [
        {
          type: "bar",
          label: "Bar Dataset",
          data: [10, 20, 30, 40],
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: this.backgroundColor,
        },
        {
          type: "line",
          label: "Line Dataset",
          data: [10, 50, 80, 50],
          fill: true,
          borderColor: "rgb(54, 162, 235)",
        },
        {
          type: this._type || "doughnut",
          label: "Line Dataset 2",
          data: [12, 510, 180, 150],
          fill: false,
          backgroundColor: this.backgroundColor,
        },
      ],
    };
    const config: any = {
      type: this._type,
      data: data,
      options: {
        scales: {
          y: {
            beginAtZero: false,
            stacked: true,
          },
          x: {
            stacked: true,
          },
        },
      },
    };
    if (this.chartJs) {
      this.chartJs.destroy();
    }
    this.chartJs = new Chart(this._idElement, config);
  }
  config(_options: any, data: any) {
    const config: any = {
      type: this._options.type,
      data: data,
      options: {
        plugins: {
          datalabels: {
            // color: "white",
            formatter: function (value: any, context: any) {
              if (_options.type == typeChart.Doughnut) {
                return Math.round((value * 100) / 1452) + "%";
              } else {
                return Math.round(value);
              }
            },
            font: {
              weight: "700",
              size: 20,
            },
          },
          legend: {
            display: false,
            position: "right",
            usePointStyle: true,
            onHover: (evt: any, item: any, legend: any) => {
              const chart = legend.chart;
              const tooltip = chart.tooltip;
              const chartArea = chart.chartArea;
              tooltip.setActiveElements(
                [
                  {
                    datasetIndex: 0,
                    index: item.index,
                  },
                ],
                {
                  x: (chartArea.left + chartArea.right) / 2,
                  y: (chartArea.top + chartArea.bottom) / 2,
                }
              );
              chart.update();
            },
          },
        },
      },
    };
    return config;
  }
}
export interface DatasetChartjs {
  type: string;
  label?: string;
  axesX: string;
  axesY: any;
  data: any;
}
export enum TYPEJS {
  Pie = "pie",
  Bar = "bar",
  Line = "line",
  Area = "area",
  Scatter = "scatter",
  Radar = "radar",
  Stacked = "stacked",
  Doughnut = "doughnut",
}
