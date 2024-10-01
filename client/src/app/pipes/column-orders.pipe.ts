import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "columnOrders",
})
export class ColumnOrdersPipe implements PipeTransform {
  transform(key: any): any {
    //console.log(key)
    const columnsToDisplay = [
      { key: "no", value: "#" },
      { key: "name", value: "Tên" },
      { key: "status", value: "Trạng Thái" },
      { key: "wage", value: "Tiền Công" },
      { key: "discount", value: "C.Khấu" },
      { key: "shippingFee", value: "Phí Vận Chyển" },
      { key: "quantity", value: "SL" },
      { key: "intoMney", value: "T.Tiền" },
      { key: "pay", value: "T.Toán" },
      { key: "createdAt", value: "Ngày" },
      { key: "price", value: "Gía Bán" },
      { key: "importPrice", value: "Gía Nhập" },
      { key: "unit", value: "Đơn Vị" },
      { key: "no", value: "#" },
    ];
    const name = columnsToDisplay.find((x: any) => x.key == key)?.value;
    return name;
  }
}
