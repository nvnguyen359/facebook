import { read } from 'original-fs';
import { fieldData, groupItem } from 'src/app/general';

export class GroupITable {
  _data: any[] = [];
  _groupColumns: any[] = [];
  constructor(data: any, groupColumns: any) {
    this._data = data;
    this._groupColumns = groupColumns;
  }
  set Data(data: any) {
    this._data = data;
  }
  get Data() {
    return this._data;
  }
  get customData() {
    const arr = Array.from(this._data);
    if (arr.length < 1) return;
    const dates = [
      ...new Set(
        arr.map((x: any) => new Date(x.createdAt).toLocaleDateString('vi'))
      ),
    ];
    let array: any[] = [];
    dates.forEach((date: any) => {
      const arrayfilter = arr.filter(
        (a: any) => new Date(a.createdAt).toLocaleDateString('vi') == date
      );
      let obj: any = {};
      obj['createdAt'] = date;
      obj['details'] = arrayfilter;
    //  console.log(arrayfilter.length)
      this._groupColumns.forEach((x: string) => {
        if (x.includes('At')) return;
        const sum = arrayfilter
          .map((a) => a[x])
          .reduce((x1, y1) => parseFloat(x1)  + parseFloat(y1) , 0);
        obj[x] = Number.isNaN(sum)?0:sum;
      });
     
      array.push(obj);
    });

    return array;
  }
}
