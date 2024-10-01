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
  convertDateVNView(): any;
}
interface Number {
  convertMoneyIntoWords(): string;
}

//1. Hàm đọc số có ba chữ số;
function DocSo3ChuSo(baso: any) {
  let ChuSo = new Array(
    " không",
    " một",
    " hai",
    " ba",
    " bốn",
    " năm",
    " sáu",
    " bảy",
    " tám",
    " chín"
  );
  var tram;
  var chuc;
  var donvi;
  var KetQua = "";
  tram = parseInt(`${baso / 100}`);
  chuc = parseInt(`${(baso % 100) / 10}`);
  donvi = baso % 10;
  if (tram == 0 && chuc == 0 && donvi == 0) return "";
  if (tram != 0) {
    KetQua += ChuSo[tram] + " trăm";
    if (chuc == 0 && donvi != 0) KetQua += " linh ";
  }
  if (chuc != 0 && chuc != 1) {
    KetQua += ChuSo[chuc] + " mươi";
    if (chuc == 0 && donvi != 0) KetQua = KetQua + " linh ";
  }
  if (chuc == 1) KetQua += " mười";
  switch (donvi) {
    case 1:
      if (chuc != 0 && chuc != 1) {
        KetQua += " mốt";
      } else {
        KetQua += ChuSo[donvi];
      }
      break;
    case 5:
      if (chuc == 0) {
        KetQua += ChuSo[donvi];
      } else {
        KetQua += " lăm";
      }
      break;
    default:
      if (donvi != 0) {
        KetQua += ChuSo[donvi];
      }
      break;
  }
  return KetQua;
}
Number.prototype.convertMoneyIntoWords = function () {
  const SoTien = this as number;
  const Tien = new Array(
    "",
    " nghìn",
    " triệu",
    " tỷ",
    " nghìn tỷ",
    " triệu tỷ"
  );
  var lan = 0;
  var i = 0;
  var so = 0;
  var KetQua = "";
  var tmp = "";
  var ViTri = new Array();
  if (SoTien < 0) return "Số tiền âm !";
  if (SoTien == 0) return "Không đồng !";
  if (SoTien > 0) {
    so = SoTien;
  } else {
    so = -SoTien;
  }
  if (SoTien > 8999999999999999) {
    //SoTien = 0;
    return "Số quá lớn!";
  }
  ViTri[5] = Math.floor(so / 1000000000000000);
  if (isNaN(ViTri[5])) ViTri[5] = "0";
  so = so - parseFloat(ViTri[5].toString()) * 1000000000000000;
  ViTri[4] = Math.floor(so / 1000000000000);
  if (isNaN(ViTri[4])) ViTri[4] = "0";
  so = so - parseFloat(ViTri[4].toString()) * 1000000000000;
  ViTri[3] = Math.floor(so / 1000000000);
  if (isNaN(ViTri[3])) ViTri[3] = "0";
  so = so - parseFloat(ViTri[3].toString()) * 1000000000;
  ViTri[2] = parseInt(`${so / 1000000}`);
  if (isNaN(ViTri[2])) ViTri[2] = "0";
  ViTri[1] = parseInt(`${(so % 1000000) / 1000}`);
  if (isNaN(ViTri[1])) ViTri[1] = "0";
  ViTri[0] = parseInt(`${so % 1000}`);
  if (isNaN(ViTri[0])) ViTri[0] = "0";
  if (ViTri[5] > 0) {
    lan = 5;
  } else if (ViTri[4] > 0) {
    lan = 4;
  } else if (ViTri[3] > 0) {
    lan = 3;
  } else if (ViTri[2] > 0) {
    lan = 2;
  } else if (ViTri[1] > 0) {
    lan = 1;
  } else {
    lan = 0;
  }
  for (i = lan; i >= 0; i--) {
    tmp = DocSo3ChuSo(ViTri[i]);
    KetQua += tmp;
    if (ViTri[i] > 0) KetQua += Tien[i];
    if (i > 0 && tmp.length > 0) KetQua += ","; //&& (!string.IsNullOrEmpty(tmp))
  }
  if (KetQua.substring(KetQua.length - 1) == ",") {
    KetQua = KetQua.substring(0, KetQua.length - 1);
  }
  KetQua = KetQua.substring(1, 2).toUpperCase() + KetQua.substring(2);
  return KetQua;
};
interface Date {
  addHours(h: any): Date;
  addDays(d: any): Date;
  firstLastDate(): any;
  firstlastMonth(y: number, m: number): any;
  firstLastYear(): any;
  startDay(): Date;
  endDay(): Date;
}
interface Object {
  mapOrder(): any;
  mapOrderDetails(): any[];
}
Date.prototype.addHours = function (h: any) {
  this.setTime(this.getTime() + h * 60 * 60 * 1000);
  return this;
};
Date.prototype.addDays = function (d = 0) {
  this.setTime(this.getTime() + 24 * 60 * 60 * 1000 * d);
  return this;
};
Date.prototype.startDay = function () {
  return new Date(this.setHours(0, 0, 0, 0));
};
Date.prototype.endDay = function () {
  return new Date(this.setHours(23, 59, 59, 999));
};
Date.prototype.firstLastDate = () => {
  const d = new Date();
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
  return result.toString().toLowerCase();
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
  try {
    //console.log(this)
    let array = this as any[];
    array = array.map((x: any) => {
      let ngays = ["createdAt", "updatedAt"];
      ngays.forEach((ngay: any) => {
        if (x[ngay]) x[ngay] = `${x[ngay]}`.DateFormatDDMMYYY();
      });
      return x;
    });
    return array;
  } catch (error) {
    return this;
  }
};
Object.prototype.mapOrder = function () {
  const t = this as any;
  return {
    id: t.id,
    customerId: t.customerId,
    name: t.name,
    status: t.status,
    wage: t.wage,
    discount: t.discount,
    shippingFee: t.shippingFee,
    quantity: t.quantity,
    intoMney: t.intoMney,
    pay: t.pay,
    createdAt: t.createdAt,
    updatedAt: t.updatedAt,
  };
};
Object.prototype.mapOrderDetails = function () {
  let array = this as any;
  if (!Array.isArray(array)) {
    array = [array];
  }
  array = array.map((t: any) => {
    return {
      id: t.id,
      productId:t.productId,
      name: t.name,
      quantity: t.quantity,
      unit: t.unit,
      price: t.price,
      intoMoney: t.intoMoney,
      importPrice: t.importPrice,
      orderId: t.orderId,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
    };
  });
  return array.length == 1 ? array[0] : array;
};
