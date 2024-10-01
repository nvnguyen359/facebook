/**
 * data: arr
 * groupColumns
 */
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
  get customData():any[] {
    const arr = Array.from(this._data);

    const dates = [
      ...new Set(
        arr.map((x: any) => new Date(x.createdAt).toLocaleDateString('vi'))
      ),
    ];
    let array: any[] = [];
    dates.forEach((date: any, index: number) => {
      const arrayfilter = arr.filter(
        (a: any) => new Date(a.createdAt).toLocaleDateString('vi') == date
      );
      let obj: any = {};
      

      obj['createdAt'] = date;
      obj['details'] = arrayfilter.map((a:any,index:number)=>{ a.no = index+1;return a});
      //  console.log(arrayfilter.length)
      this._groupColumns.forEach((x: string) => {
        if (x.includes('At')) return;
        const sum = arrayfilter.filter(y=>y[x]!=null)
          .map((a) => a[x])
          .reduce((x1, y1) => parseFloat(x1) + parseFloat(y1), 0);
        obj[x] = Number.isNaN(sum) ? 0 : sum;
      });
      obj['no'] = index + 1;
      array.push(obj);
    });

    return array;
  }
}
