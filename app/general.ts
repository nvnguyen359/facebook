export enum Status {
  Refesh,
  Add,
  LoadOrder,
  isDonhang,
}
export enum BaseApiUrl {
  NhapHangs = "nhaphang",
  ChiTietDonHangs = "chitietdonhang",
  SanpPhams = "sanpham",
  DonHangs = "donhang",
  ChiPhis = "chiphi",
  KhachHangs = "khachhang",
  All = "all",
  CongNos = "congnos",
  BaoCaos = "baocao",
  Orders = "orders",
  listOrders="listOrders"
}
/**default @param [ms=1000]  */
export function delay(ms: number = 1000) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
export function trackByFn(index: number) {
  return index;
}
export function scrollTop(el?: any) {
  setTimeout(() => {
    if (!el) el = ".scroll";
    var element = document.querySelector(el);
    if (element) {
      // window.scrollTo(0, 0);
      element.scrollTo({ top: element.scrollHeight, behavior: "instant" });
    }
  }, 200);
}
export function firstLastDate(date: any = new Date()) {
  if (!date) date = new Date();
  const d = new Date(date);
  return {
    firstDate: new Date(d.setHours(0, 0, 0, 0)),
    lastDate: new Date(d.setHours(23, 59, 59, 999)),
    now: new Date(),
  };
}
export function lessthanDate(date: any, equa = false, today = new Date()) {
  if (equa) {
    return (
      new Date(date).setHours(0, 0, 0, 0) <=
      new Date(today).setHours(0, 0, 0, 0)
    );
  } else {
    return (
      new Date(date).setHours(0, 0, 0, 0) < new Date(today).setHours(0, 0, 0, 0)
    );
  }
}
export function firstlastMonth(y: number, m: number) {
  //var date = new Date(), y = date.getFullYear(), m = date.getMonth();
  var firstDay = new Date(y, m, 1, 0, 0, 0, 0);
  var lastDay = new Date(y, m + 1, 0, 23, 59, 59, 999);
  return { firstDay, lastDay };
}

export function getQuarter(date = new Date()) {
  return Math.floor(date.getMonth() / 3 + 1);
}
export function getStartEndMonthInQuarter(date = new Date()) {
  const getQuarter = Math.floor(date.getMonth() / 3 + 1);
  const endMonth = getQuarter * 3;
  const startMonth = endMonth - 2;
  const y = date.getFullYear();
  const fl = firstlastMonth(y, startMonth - 1);
  const fl1 = firstlastMonth(y, endMonth - 1);
  return { startMonth, endMonth, firsDate: fl.firstDay, lastDate: fl1.lastDay };
}
export function getStarEndDateInQuarter(quarter = 1, y: number) {
  const endMonth = quarter * 3;
  const startMonth = endMonth - 2;
  const fl = firstlastMonth(y, startMonth - 1);
  const fl1 = firstlastMonth(y, endMonth - 1);
  return { firstDate: fl.firstDay, lastDate: fl1.lastDay };
}
var ChuSo = new Array(
  " không ",
  " một ",
  " hai ",
  " ba ",
  " bốn ",
  " năm ",
  " sáu ",
  " bảy ",
  " tám ",
  " chín "
);
var Tien = new Array("", " nghìn", " triệu", " tỷ", " nghìn tỷ", " triệu tỷ");

//1. Hàm đọc số có ba chữ số;
function DocSo3ChuSo(baso: any) {
  var tram;
  var chuc;
  var donvi;
  var KetQua = "";
  tram = parseInt(`${baso / 100}`);
  chuc = parseInt(`${(baso % 100) / 10}`);
  donvi = baso % 10;
  if (tram == 0 && chuc == 0 && donvi == 0) return "";
  if (tram != 0) {
    KetQua += ChuSo[tram] + " trăm ";
    if (chuc == 0 && donvi != 0) KetQua += " linh ";
  }
  if (chuc != 0 && chuc != 1) {
    KetQua += ChuSo[chuc] + " mươi";
    if (chuc == 0 && donvi != 0) KetQua = KetQua + " linh ";
  }
  if (chuc == 1) KetQua += " mười ";
  switch (donvi) {
    case 1:
      if (chuc != 0 && chuc != 1) {
        KetQua += " mốt ";
      } else {
        KetQua += ChuSo[donvi];
      }
      break;
    case 5:
      if (chuc == 0) {
        KetQua += ChuSo[donvi];
      } else {
        KetQua += " lăm ";
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

//2. Hàm đọc số thành chữ (Sử dụng hàm đọc số có ba chữ số)

export function DocTienBangChu(SoTien: any) {
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
  return KetQua; //.substring(0, 1);//.toUpperCase();// + KetQua.substring(1);
}
