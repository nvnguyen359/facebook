import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { BaseApiUrl, delay } from "../general";
import { HttpClient } from "@angular/common/http";
import { DomSanitizer } from "@angular/platform-browser";
import { DocTienBangChu } from "../general";
import { Order } from "../Models/order";
@Injectable({
  providedIn: "root",
})
export class ThermalPrinterServiceService {
  printContent = ``; //"80mm" | "58mm"
  cssStyles = ``;
  paperWidth = "148mm";
  order: any;
  urlImg1: any;
  constructor(
    private service: ApiService
  ) {}
  set PaperWidth(width: any) {
    this.paperWidth = width;
  }
  set DataDonHang(order: any) {
    this.order = order;
  }
  get PaperWidth() {
    return this.paperWidth;
  }
  async getHtml() {
    const classMain = this.PaperWidth == "80mm" ? "a8" : "a5";
    const isPageA5 = classMain == "a5";
    const filter = ["Id", "Sản Phẩm", "Ngày", "Giá Nhập", "Đơn Hàng"];
    const columnsChitiets = Object.keys(this.order.details[0]).filter(
      (x) => !filter.includes(x)
    ); //['Id', 'Sản Phẩm', 'Tên Sản Phẩm', 'Đơn giá', 'Số Lượng', 'Đơn Vị Tính', 'Thành Tiền', 'Ngày', 'Giá Nhập', 'Đơn Hàng']

    let columns = isPageA5
      ? [
          "STT",
          "Tên Sản Phẩm",
          "Số Lượng",
          "Đơn Vị Tính",
          "Đơn giá",
          "Thành Tiền",
        ]
      : columnsChitiets.filter((x) => x != "ĐV");
    var html = "";
    const inforStore = await this.addInforStore();
    html += inforStore;
const donhang= this.order;
    var kh = await this.getKh(donhang["Khách Hàng"], donhang["Id"]);
    html += kh;
    const head = this.setHeadTable(columns);
    const body = this.setBodyTable(donhang, isPageA5, columns);
    const foot = this.setFootTable(donhang, isPageA5);
    html += this.setTable(head, body, foot, donhang);

    return `
    <!DOCTYPE html>
    <html>
    ${this.addHeader()}
   
    <body  class="${{ classMain }}">
      ${html}
    </body>
    
    </html>
    
    `;
  }
  //#region
  addRawHtml(htmlEl: any) {
    this.printContent += `\n${htmlEl}`;
  }
  addHeader() {
    return ` <head>
  <title>Print</title>
  <style>
  html {
      padding: 0;
      margin: 2px;
      width: ${this.paperWidth};
  }

  body {
      margin: 0;
  }

  body {
      display: flex;
      align-items: center;
      flex-direction: column;
  }

  .flex {
      display: flex;
  }

  .kh {
      display: block;
      width: 100%;
      margin-top:-55px
  }

  .infor-store {
      margin: 4px;
      margin-top: 8px;
      display: block;
      width: 100%;
  }

  .block {
      display: block;
  }

  .text-center {
      text-align: center;
  }

  .text-right {
      text-align: right;
  }

  .a8 .infor-store {
      text-align: center;
      font-size: 14px;
  }

  .bill-table {
      width: 100%;
      display: block;
      margin-top: 16px;
  }

  table,
  td,
  th {
      border: 1px solid;
  }

  table {
      width: 100%;
      border-collapse: collapse;
  }

  .a5 {
      font-size: 16px;
  }

  .left {
      display: block;
  }

  .qr {
      margin-top: -7px;
  }
</style>
  <script>
    window.onafterprint = event => {
      window.close();
    };
  </script>
</head>`;
  }
  async addInforStore() {
    const donhang= this.order;
    const addInfo = donhang.id + "-" + donhang.name + "-" + donhang.createdAt;
    let urlImg = `https://img.vietqr.io/image/VCB-0041000171668-compact2.jpg?amount=${donhang.pay}&amp;accountName=DO%20VAN%20HIEU&addInfo=${addInfo}`;

    return `<div class="infor-store">
<b class="block text-center">HÓA ĐƠN BÁN HÀNG</b>
<small class="block text-center">${donhang.createdAt}</small>
<p></p>
<div class="flex">
<div class="left">
<b class="block">LK PIN HIỆU NGÂN</b>
<div>
  <div>Chuyên: Máy pin - cung cấp linh kiện ngành pin</div>
 <div> Địa chỉ: TDP Hữu Lộc, P.Trúc Lâm, Nghi Sơn, Thanh Hóa</div>
</div>
<b class="block"> ĐT: 0988.114.714 - 0842.399.889</b>
<div>TK: Do Van Hieu (0041000171668-VietComBank)</div>
</div>
<div class="qr">
<img id="qrViet" width='150' height='150' src="${urlImg}"  alt="" style="opacity: 0;" >

</div>
</div>
</div>`;
  }
  async getKh(id: any, idDh: any) {
    let kh = ((await this.service.getId(BaseApiUrl.KhachHangs, id)) as any)
      .data as any;
    const khHtml =
      kh["Phone"] != undefined
        ? `<div class="block" ><b>Khách Hàng:</b>${kh["Tên Khách Hàng"]} (${kh["Phone"]})</div>
    <div class="block"><b>Địa Chỉ   :</b>${kh["Địa Chỉ"]}</div>`
        : "";
    return `<div class="kh">
<div class="block"><b>ID:</b>${idDh}</div>
${khHtml}
</div>`;
  }

  setBodyTable(donhang: any, isPageA5: any, columns: string[]) {
    const chitiets = Array.from(donhang.details).map((x: any, index) => {
      x["STT"] = index + 1;
      return x;
    });

    let tableBody = "";
    // if (columns.filter((x: any) => x == "STT").length > 1) {
    //   columns.pop();
    // }

    chitiets.forEach((x: any, index) => {
      if (!isPageA5) {
        delete x["STT"];
        delete x["Đơn Vị Tính"];
      }
      let tr = `<tr>`;
      columns.forEach((column) => {
        const item = !Number.isInteger(parseInt(x[column]))
          ? `<td >${x[column]}</td>`
          : `<td class="text-right">${parseInt(
              x[column]
            ).toLocaleString()}</td>`;
        tr += item;
      });
      tr += `</tr>`;
      tableBody += tr;
    });
    return tableBody;
  }
  setTable(head: any, body: any, foot: any, donhang: any) {
    const tableBill = `
<div class="bill-table">
<table>
  <thead>
${head}
  </thead>
  <tbody>
  ${body}
  </tbody>
  <tfoot>
  ${foot}
  </tfoot>
</table>
<div class="block"><i>(Thanh toán : ${DocTienBangChu(
      parseInt(`${donhang["Thanh Toán"]}`)
    )} đồng./)</i></div>
</div>`;
    return tableBill;
  }
  setHeadTable(columns: any) {
    columns = columns.map((a: any) => {
      if (a == "Đơn Vị Tính") a = "ĐV";
      if (a == "Số Lượng") a = "SL";
      return a;
    });
    if (columns.filter((x: any) => x == "STT").length > 1) {
      columns.pop();
    }
    let thsHtml = "";
    columns.forEach((x: any) => {
      thsHtml += `<th>${x}</th>`;
    });

    return thsHtml;
  }
  setFootTable(donhangs: Order, isPageA5: any) {
    const colspan = isPageA5 ? 2 : 1;
    const colspanTong = isPageA5 ? 3 : 2;
    const colspanGiamGia = isPageA5 ? 5 : 3;
    const tong = `<tr>
  <td colspan="${colspan}">Tổng</td>
  <td class="text-right">${donhangs.quantity}</td>
  <td class="text-right" colspan="${colspanTong}">${parseInt(
      `${donhangs.intoMney}`
    ).toLocaleString()}</td>
  </tr>`;
    const giamgia =
      donhangs.discount > 0
        ? `
  <tr>
  <td colspan="${colspanGiamGia}">Chiết Khấu</td>
  <td class="text-right" colspan="${colspanTong + 1}">${parseInt(
            donhangs.discount + ""
          ).toLocaleString()}</td>
  </tr>
  `
        : "";
    const tientong =
      donhangs.wage > 0
        ? `
  <tr>
  <td colspan="${colspanGiamGia}">Tiền Công</td>
  <td class="text-right" colspan="${colspanTong + 1}">${parseInt(
            donhangs.wage + ""
          ).toLocaleString()}</td>
  </tr>
  `
        : "";
    const phiship =
      parseInt(donhangs.shippingFee) > 0
        ? `
  <tr>
  <td colspan="${colspanGiamGia}">Phí Ship</td>
  <td class="text-right" colspan="${colspanTong + 1}">${parseInt(
            `${donhangs.shippingFee}`
          ).toLocaleString()}</td>
  </tr>
  `
        : "";
    const thanhtoan = `
  <tr>
  <td colspan="${colspanGiamGia}">Thanh Toán</td>
  <td class="text-right" colspan="${colspanTong + 1}"><b>${parseInt(
      donhangs.pay + ""
    ).toLocaleString("vi")}</b></td>
  </tr>
  `;
    const tfoot = `
  ${tong}
  ${giamgia}
  ${tientong}
  ${phiship}
  ${thanhtoan}
  `;
    return tfoot;
  }
  //#endregion
  async print() {
    const printerWindow = window.open(
      ` ${await this.getHtml()}`,
      `_blank`
    );
    printerWindow?.document.write();
    printerWindow?.document.close();
    printerWindow?.focus();
    printerWindow?.print();
    // mywindow.close();
  }
}
