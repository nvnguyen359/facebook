import { fieldData, groupItem } from "src/app/general";

export class GroupItems {
  _data: any;
  constructor(data: any) {
    this._data = data;
  }
  set Data(data: any) {
    this._data = data;
  }
  get Data() {
    return this._data;
  }
  get groupItems(): any {
    let array: any = [];
    const items = Array.from(this._data);
    if (items.length < 1) return;
    const dates = [
      ...new Set(
        items.map((x: any) => new Date(x.createdAt).toLocaleDateString("vi"))
      ),
    ];
    const keys = Object.keys(items[0] as any);
    //console.log(keys,keys.includes("importPrice"))
    let columns: any[] = [];
    columns.push("no");
    columns.push("createdAt");
    if (keys.includes("importPrice")) {
      columns.push(groupItem.ISumQuantity);
      columns.push(groupItem.IsumImport);
      columns.push(groupItem.ISumSales);
    }
    if (keys.includes("money")) {
      columns.push(groupItem.ISumExpense);
    }

    dates.forEach((date: any) => {
      const itemsX = items.filter(
        (a: any) => new Date(a.createdAt).toLocaleDateString("vi") == date
      );
      let obj: any = {};
      obj.createdAt = date;
      if (keys.includes("importPrice")) {
        obj[groupItem.IsumImport] = itemsX
          .map((x: any) => parseInt(x.importPrice) * parseInt(x.quantity))
          .reduce((a: number, b: number) => a + b, 0)
          .toLocaleString("vi");

        obj[groupItem.ISumSales] = itemsX
          .map((x: any) => parseInt(x.price) * parseInt(x.quantity))
          .reduce((a: number, b: number) => a + b, 0)
          .toLocaleString("vi");
        // obj[fieldData.intoMoney] = itemsX
        // .map((x: any) => parseInt(x.importPrice) * parseInt(x.quantity))
        // .reduce((a: number, b: number) => a + b, 0)
        // .toLocaleString("vi");
        obj[groupItem.ISumQuantity] = itemsX
          .map((x: any) => parseInt(x.quantity))
          .reduce((a: number, b: number) => a + b, 0)
          .toString();
        obj.details = itemsX.map((x: any, index: number) => {
          x.no = index + 1;
          if (x[fieldData.importPrice])
            x[groupItem.sumImport] =
              parseInt(x[fieldData.importPrice]) * parseInt(x.quantity);
          x[groupItem.sumSale] =
            parseInt(x[fieldData.price]) * parseInt(x.quantity);
          return x;
        });
      }
      if (keys.includes("money")) {
        obj[groupItem.ISumExpense] = itemsX
          .map((x: any) => parseInt(x.money))
          .reduce((a: number, b: number) => a + b, 0)
          .toLocaleString("vi");
        obj.details = itemsX.map((x: any, index: number) => {
          x.no = index + 1;
          return x;
        });
      }

      array.push(obj);
    });

    return { items: array, columns: [...new Set(columns)] };
  }
}
