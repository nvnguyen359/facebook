import { Injectable } from "@angular/core";
import { OrderDetails } from "../Models/orderDetails";
import { InfoStore } from "../Models/inforStore";

@Injectable({
  providedIn: "root",
})
export class PrintHtmlService {
  order?: Bill;
  private info: any;
  private pagesize?: any = "80mm"; //80mm
  constructor() {}
  set setOrder(order: Bill) {
    this.order = order as Bill;
  }
  set infoStore(info: any) {
    this.info = info;
  }
  set pageSize(size: any) {
    this.pagesize = size;
  }
  get pageSize() {
    return this.pagesize;
  }
  get infoStore() {
    const infoStore = this.info as InfoStore;
    const name = this.info ? infoStore.store.name : `MÁY PIN HIỆU NGÂN`;

    const address = this.info
      ? infoStore.store.address
      : ` TDP Hữu Lộc, P.Trúc Lâm, Nghi Sơn, Thanh Hóa`;
    const phone = this.info
      ? infoStore.store.phone
      : `<b>0988.114.714</b> - <b>0842.399.889</b>`;
    return `<div><b>${name}</b></div>
    <div>
        Chuyên: máy pin - cung cấp linh kiện ngành pin <br>
        Địa chỉ:${address} <br>
        ĐT: ${phone}
    </div>`;
  }
  private getStyleTbody(item: Details) {
    const pageSize = parseInt(`${this.pageSize}`.replace("mm", ""));
    let html = `<tr>
                  <td class="text-center">${item.no}</td>
                  <td class="text-left">${item.name}</td>
                  <td class="text-center">${item.quantity.toLocaleString(
                    "vi"
                  )}</td>
                  <td>${item.unit}</td>
                  <td style="text-align: right">${item.price.toLocaleString(
                    "vi"
                  )}</td>
                  <td style="text-align: right">${item.intoMoney.toLocaleString(
                    "vi"
                  )}</td>
                </tr>`;
    if (pageSize < 81) {
      html = `<tr>
                <td>${item.no}</td>
                <td colspan="6"><b>${item.name}</b></td>
                  <tr>
                    <td colspan="2"></td>
                    <td style="text-align: right">${item.quantity.toLocaleString(
                      "vi"
                    )}</td>
                    <td>${item.unit}</td>
                    <td style="text-align: right">${item.price.toLocaleString(
                      "vi"
                    )}</td>
                    <td style="text-align: right">${item.intoMoney.toLocaleString(
                      "vi"
                    )}</td>    
                  </tr>
            </tr>`;
    }
    return html;
  }
  createTable() {
    let tbody = "";
    const order = this.order;
    const array = this.order?.details as Details[];
    for (let index = 0; index < array.length; index++) {
      let element = array[index];
      element.no = index + 1;
      tbody += this.getStyleTbody(element);
    }
    const giamgia =
      order?.shippingFee > 0
        ? `<tr>
            <th colspan="5">Giảm Giá </span></th>
            <th colspan="1" style="text-align: right;" >${order?.shippingFee.toLocaleString(
              "vi"
            )}</th>
        </tr>`
        : "";
    const tiencong =
      order?.wage > 0
        ? `<tr>
            <th colspan="5" style="text-align: left;">Tiền Công</th>
            <th colspan="1" style="text-align: right;" >${order?.wage.toLocaleString(
              "vi"
            )}</th>
        </tr>`
        : "";
    const chietkhau =
      order?.discount > 0
        ? `<tr id="tr-phiship" class="d-none">
            <th colspan="5" style="text-align: left;">Phí Ship</th>
            <th colspan="1" style="text-align: right;">${order?.discount.toLocaleString(
              "vi"
            )}</th>
        </tr>`
        : "";
    const table = `<table class="details">
    <thead class="thead-light">
        <tr>
            <th scope="col">#</th>
            <th scope="col">Tên Hàng</th>
            <th scope="col">SL</th>
            <th scope="col">ĐV</th>
            <th scope="col">Giá</th>
            <th scope="col">Thành Tiền</th>
        </tr>
    </thead>
    <tbody>
        ${tbody}
    </tbody>
    <tfoot>
        <tr>
            <th colspan="2" style="text-align: left;">Tổng Tiền</th>
            <th colspan="1" class="text-center" id="sumQuantity">(${order?.quantity.toLocaleString(
              "vi"
            )})</th>
            <th colspan="2"></th>
            <th colspan="1" style="text-align: right;" id="sumMoney">${order?.intoMney.toLocaleString(
              "vi"
            )}</th>
        </tr>
       ${giamgia}
       ${tiencong}
        ${chietkhau}
        <tr>
            <th colspan="5" style="text-align: left;"><b>Thanh Toán</b></th>
            <th colspan="1" style="text-align: right;">
                <b id="thanhtoan">${order?.pay.toLocaleString("vi")}</b>
            </th>
        </tr>
    </tfoot>
</table>`;
    return table;
  }
  private getStyle() {
    return `
                .details,.page{
                  width: 100%;
              }
              .pages{
                width: 100%;
              }
              .details,
              .details th,
              .details td {
                  border: 1px groove rgba(51, 51, 51, 0.25);
                  border-collapse: collapse;
              }

              .details tbody tr td {
                  padding: 2px;
              }
              .details tfoot tr td{
                  font-weight: bold;
              }
              body{
                  width: ${this.pageSize};
              }
              .pages{
                  display: flex;
              }
              .text-center{
                  text-align: center;
              }
              .text-align {
                  text-align: right;
              }
              
              .text-left {
                  text-align: left;
              };
           `;
  }
  rawHtml() {
    const date = `${this.order?.createdAt}`.DateFormatDDMMYYY();
    return `<!DOCTYPE html>
   <html lang="vi">
   
   <head>
       <meta charset="UTF-8">
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <title>Document</title>
       <style>
           ${this.getStyle()}
       </style>
       <script>
       window.onafterprint = event => {
         window.close();
       };
     </script>
   </head>
   
   <body>
       <div class="pages">
           <div class="page">
               <div class="text-center"><b>HÓA ĐƠN BÁN HÀNG</b></div>
               <div class="text-center" style="margin-top: -5px;"><i><small>Ngày tạo: ${date}</small></i></div>
               <div class="flex info" style="margin-top: 4px;display:flex">
                   <div class="grow-1" style="flex-grow:1">
                      ${this.infoStore}
                   </div>
               </div>
               <hr>
              ${this.infoCustomer()}
               <div>Mã Đơn Hàng: DH${this.order?.id}</div>
               ${this.createTable()}
               <div style="margin-top: 0px;margin-left:8px;text-align: left;" ><i>Bằng chữ :${
                 this.order?.text
               } đồng chẵn./</i></div>
           </div>
       </div>
   </body>
   
   </html>`;
  }
  infoCustomer() {
    const customer = this.order?.customer;
    return customer?.name != "Khách Lẻ"
      ? ` <div class="flex" style="flex-direction: column; align-items: baseline; display: block;" id="div-khach">
            <div><b>Khách hàng:</b> <span id="customerName">${customer?.name}(${customer?.phone})</span></div>
            <div><b>Địa chỉ:</b> <span id="customerAddress">${customer?.address}</span></div>
          </div>`
      : "";
  }
  printBill() {
    const printerWindow = window.open(` `, `_blank`);
    printerWindow?.document.write(this.rawHtml());
    printerWindow?.document.close();
    printerWindow?.focus();
    printerWindow?.print();
  }
}

export interface Bill {
  id: any;
  customer: {
    name: string;
    address: any;
    phone: any;
  };
  name: any;
  wage: any;
  discount: any;
  shippingFee: any;
  intoMney: any;
  pay: any;
  quantity: any;
  createdAt: any;
  details: Details[];
  text: string;
  store: InfoStore;
}
export interface Details extends OrderDetails {
  no: any;
}
