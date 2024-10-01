interface String {
  add(...strings: string[]): string;
  removeAccents(): string;
  convertDateVNToISO(isVn?: boolean): Date;
  DateVNToISO(): Date;
  isValidDate(): boolean;
  DateFormatDDMMYYY(): string;
  convertDatefromVN(): Date;
  capitalizeFirstLetter(): string;
}
interface Array<T> {
  convertDateVNView(): any[];
}

interface Date {
  addHours(h: any): Date;
  addDays(d: any): Date;
  firstLastDate(): any;
  firstlastMonth(y: number, m: number): any;
  firstLastYear(): any;
}
Date.prototype.addHours = function (h: any) {
  this.setTime(this.getTime() + h * 60 * 60 * 1000);
  return this;
};
Date.prototype.addDays = function (d = 0) {
  this.setTime(this.getTime() + 24 * 60 * 60 * 1000 * d);
  return this;
};

Date.prototype.firstLastDate = () => {
  const date = new Date();
  const d = new Date(date);
  return {
    firstDate: new Date(d.setHours(0, 0, 0, 0)),
    lastDate: new Date(d.setHours(23, 59, 59, 999)),
    now: new Date(),
  };
};
Date.prototype.firstLastYear = () => {
  const date = new Date();
  const d = new Date(date);
  return {
    firstDate: new Date(date.getFullYear(), 0, 1, 0, 0, 0, 0),
    lastDate: new Date(date.getFullYear(), 11, 31, 23, 59, 59, 999),
  };
};

Date.prototype.firstlastMonth = (y: number, m: number) => {
  //var date = new Date(), y = date.getFullYear(), m = date.getMonth();
  var firstDay = new Date(y, m, 1, 0, 0, 0, 0);
  var lastDay = new Date(y, m + 1, 0, 23, 59, 59, 999);
  return { firstDay, lastDay };
};
String.prototype.DateFormatDDMMYYY = function () {
  if (new Date(this.toString()).toString() !== "Invalid Date") {
    var timestamp = new Date(this.toString());
    const day =
      timestamp.getDate() < 10
        ? `0${timestamp.getDate()}`
        : timestamp.getDate();
    const m =
      timestamp.getMonth() + 1 < 10
        ? `0${timestamp.getMonth() + 1}`
        : timestamp.getMonth() + 1;
    return day + "/" + m + "/" + timestamp.getFullYear();
  } else {
    return this.toString();
  }
};
String.prototype.add = function (...strings) {
  return this + strings.join("");
};

String.prototype.removeAccents = function () {
  const result: string = this.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
  return result.toString();
};
String.prototype.isValidDate = function () {
  return new Date(this.toString()).toString() !== "Invalid Date";
};
String.prototype.convertDateVNToISO = function (isVn) {
  var timestamp = Date.parse(this.toString());
  // console.log(this,isNaN(timestamp) == false)
  if (isNaN(timestamp) == false) {
    const t = this.split("/");
    console.log(t);
    const date = new Date(parseInt(t[2]), parseInt(t[1]) - 1, parseInt(t[0]));
    console.log(date);
    return !isVn ? new Date(timestamp) : date;
  } else {
    const t = this.split("/");

    const date = new Date(parseInt(t[2]), parseInt(t[1]) - 1, parseInt(t[0]));
    return t.length == 3 ? date : new Date(this.toString());
  }
};
String.prototype.DateVNToISO = function () {
  const t = this.split("/");
  const date = new Date(parseInt(t[2]), parseInt(t[1]) - 1, parseInt(t[0]));
  return date;
};
String.prototype.convertDatefromVN = function () {
  var timestamp = Date.parse(this.toString());
  if (isNaN(timestamp) == false) {
    return new Date(timestamp);
  } else {
    const t = this.split("/");
    const date = new Date(parseInt(t[2]), parseInt(t[1]), parseInt(t[0]));
    return t.length == 3 ? date : new Date(this.toString());
  }
};
String.prototype.capitalizeFirstLetter = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

Array.prototype.convertDateVNView = function () {
  let array = this as any[];
  array = array.map((x: any) => {
    let ngays = ["Ngày", "Ngày Bán"];
    ngays.forEach((ngay: any) => {
      if (x[ngay]) x[ngay] = `${x[ngay]}`.DateFormatDDMMYYY();
    });
    return x;
  });
  return array;
};
