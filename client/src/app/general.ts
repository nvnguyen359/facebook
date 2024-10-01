export enum Status {
  Search,
  Refesh,
  Add,
  LoadOrder,
  isDonhang,
  Upsert,
  resultDelete = 'resultDelete',
}
export enum IdsContant {
  idSetting = '14',
}
export enum groupItem {
  IsumImport = 'sumImport',
  ISumSales = 'sumSales',
  ISumQuantity = 'sumQuantity',
  ISumExpense = 'sumExpense',
  sumImport = 'sumImport',
  sumSale = 'sumSale',
}
export enum typeChart {
  Pie = 'pie',
  Bar = 'bar',
  Line = 'line',
  Area = 'area',
  Scatter = 'scatter',
  Radar = 'radar',
  Stacked = 'stacked',
  Doughnut = 'doughnut',
}
export enum BaseApiUrl {
  TrangChu = 'home',
  CaiDat = 'settings',
  TramCan = 'weighStation',
  KhachHang = 'khachhang',
  CongTy = 'congty',
  User = 'user',
  BaoCao = 'baocao',
  Printers = 'printers',
}
export enum fieldData {
  importPrice = 'importPrice',
  price = 'price',
  intoMoney = 'intoMoney',
}
export function links() {
  return [
    {
      text: 'Trang Chủ',
      link: `/${BaseApiUrl.TrangChu}`,
      icon: 'home',
    },
    {
      text: 'Báo Cáo',
      link: `/${BaseApiUrl.BaoCao}`,
      icon: 'shopping_basket',
    },
    {
      text: 'Khách Hàng',
      link: `/${BaseApiUrl.KhachHang}`,
      icon: 'spa',
    },
    {
      text: 'Cài Đặt',
      link: `/${BaseApiUrl.CaiDat}`,
      icon: 'credit_card',
    },
    {
      text: 'Nhân Viên',
      link: `/${BaseApiUrl.User}`,
      icon: 'account_box',
    },
  ];
}
const pageSizeOptions: any[] = [5, 9, 10, 25, 100, 1000, 5000];
const radioGroup = ['Xuất Hàng', 'Nhập Hàng', 'Dich Vụ'];
const adcolumnsToDisplay = [
  { key: 'no', value: '#' },
  { key: 'name', value: 'Tên' },
  { key: 'status', value: 'Trạng Thái' },
  { key: 'wage', value: 'Tiền Công' },
  { key: 'discount', value: 'Chiết Khấu' },
  { key: 'shippingFee', value: 'Phí Vận Chyển' },
  { key: 'quantity', value: 'SL' },
  { key: 'intoMney', value: 'Thành Tiền' },
  { key: 'pay', value: 'Thanh Tiền' },
  {key:'payment',value:'Thanh Toán'},
  {'key':'numberOfContainers',value:'Số Hiệu Cont.'},
  { key: 'createdAt', value: 'Ngày' },
  { key: 'updatedAt', value: 'Ngày' },
  { key: 'customerName', value: 'Khách Hàng' },
  { key: 'price', value: 'Gía Bán' },
  { key: 'tare', value: 'TCTB', tooltip: 'Tạp Chất hoặc trừ Bì' },
  { key: 'importPrice', value: 'Gía Nhập' },
  { key: 'unit', value: 'Đơn Vị' },
  { key: 'no', value: '#' },
  { key: 'address', value: 'Địa Chỉ' },
  { key: 'phone', value: 'Phone' },
  { key: 'email', value: 'Email' },
  { key: 'note', value: 'Ghi Chú' },
  { key: 'money', value: 'Tiền' },
  { key: groupItem.ISumQuantity, value: 'Số Lượng' },
  { key: groupItem.ISumSales, value: 'Tổng Doanh Thu' },
  { key: groupItem.IsumImport, value: 'Tổng Nhập' },
  { key: groupItem.ISumExpense, value: 'Tổng Chi' },
  { key: groupItem.sumSale, value: 'Doanh Thu' },
  { key: groupItem.sumImport, value: 'Tiền Nhập' },
  { key: 'kh_ncc', value: 'Khách Hàng-NCC' },
  { key: 'loanDate', value: 'Ngày Tạo' },
  { key: 'payDate', value: 'Ngày T.Toán' },
  { key: 'sumOuput', value: 'Tổng Xuất' },
  { key: 'inventory', value: 'Tồn Kho' },
  { key: 'valueImport', value: 'Tiền Nhập' },
  { key: 'valueOut', value: 'Doanh Thu' },
  { key: 'profit', value: 'Lợi Nhuận' },
  { key: 'weight1', value: 'Cân Lần 1' },
  { key: 'weight2', value: 'Cân Lần 2' },
  { key: 'cargoVolume', value: 'KL Hàng' },
  { key: 'impurities', value: 'Tạp Chất(%)' },
  { key: 'carNumber', value: 'Số Xe' },
  { key: 'type', value: 'Loại Hàng' },
  { key: 'ieGoods', value: 'Xuất/Nhập' },
  { key: 'productName', value: 'Tên Hàng' },
  { key: 'customertName', value: 'Khách Hàng' },
  { key: 'id', value: 'ID' },
  { key: 'actualVolume', value: 'KL Thực', tooltip: 'Khối lượng hàng thực tế' },
];
export function fields() {
  const data = [
    {
      field: 'name',
      type: 'text',
      text: 'Tên',
      require: true,
    },
    {
      field: 'quantity',
      type: 'number',
      text: 'Số Lượng',
      step: 1,
      require: true,
    },
    {
      field: 'phone',
      type: 'phone',
      text: 'Điện Thoại',
      require: true,
    },
    {
      field: 'address',
      type: 'text',
      text: 'Địa Chỉ',
      require: false,
    },
    {
      field: 'email',
      type: 'email',
      text: 'Email',
      require: false,
    },
    {
      field: 'createdAt',
      type: 'date',
      text: 'Ngày Tạo',
    },
    {
      field: 'updatedAt',
      type: 'date',
      text: 'Ngày',
    },
    {
      field: 'price',
      type: 'number',
      text: 'Đơn Giá',
      step: 500,
      require: true,
    },
    {
      field: 'importPrice',
      type: 'number',
      text: 'Giá Nhập',
      step: 500,
      require: true,
    },
    {
      field: 'pay',
      type: 'number',
      text: 'Thanh Toán',
    },
    {
      field: 'unit',
      type: 'text',
      text: 'Đơn Vị',
    },
    {
      field: 'money',
      type: 'number',
      text: 'Số Tiền',
      require: true,
    },
    {
      field: 'note',
      type: 'text',
      text: 'Ghi Chú',
      step: 500,
      require: true,
    },
    {
      field: 'kh_ncc',
      type: 'text',
      text: 'Khách Hàng-NCC',
    },
    {
      field: 'status',
      type: 'text',
      text: 'Trạng Thái',
    },
    {
      field: 'loanDate',
      type: 'date',
      text: 'Ngày Tạo',
    },
    {
      field: 'payDate',
      type: 'date',
      text: 'Ngày T.Toán',
    },
    {
      field: 'weight1',
      type: 'number',
      text: 'KL Lần 1',
    },
    {
      field: groupItem.IsumImport,
      text: 'Tổng Nhập',
    },
    {
      field: groupItem.ISumSales,
      text: 'Tổng Doanh Thu',
    },
    {
      field: groupItem.ISumQuantity,
      text: 'Tổng Số Lượng',
    },
    {
      field: groupItem.ISumExpense,
      text: 'Tổng Chi',
    },
    {
      field: groupItem.sumSale,
      text: 'Tổng Bán',
    },
    {
      field: groupItem.sumImport,
      text: 'Tiền Nhập',
    },
    {
      field: 'kh_ncc',
      text: 'K.Hàng-NCC',
    },
  ];
  return data;
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
    if (!el) el = '.scroll';
    var element = document.querySelector(el);
    if (element) {
      // window.scrollTo(0, 0);
      element.scrollTo({ top: element.scrollHeight, behavior: 'instant' });
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
export function getLocalStorage(key: any = 'print') {
  const local = JSON.parse(`${localStorage.getItem(key)}`);
  return local;
}
export function setLocalStorage(key: any = 'print', value: any) {
  localStorage.setItem(key, JSON.stringify(value));
}
export function setItem(key: any = 'print', value: any) {
  localStorage.setItem(key, JSON.stringify(value));
}
export function getItem(key: any = 'print') {
  const local = JSON.parse(`${localStorage.getItem(key)}`);
  return local;
}
var ChuSo = new Array(
  ' không ',
  ' một ',
  ' hai ',
  ' ba ',
  ' bốn ',
  ' năm ',
  ' sáu ',
  ' bảy ',
  ' tám ',
  ' chín '
);
var Tien = new Array('', ' nghìn', ' triệu', ' tỷ', ' nghìn tỷ', ' triệu tỷ');

//1. Hàm đọc số có ba chữ số;
function DocSo3ChuSo(baso: any) {
  var tram;
  var chuc;
  var donvi;
  var KetQua = '';
  tram = parseInt(`${baso / 100}`);
  chuc = parseInt(`${(baso % 100) / 10}`);
  donvi = baso % 10;
  if (tram == 0 && chuc == 0 && donvi == 0) return '';
  if (tram != 0) {
    KetQua += ChuSo[tram] + ' trăm ';
    if (chuc == 0 && donvi != 0) KetQua += ' linh ';
  }
  if (chuc != 0 && chuc != 1) {
    KetQua += ChuSo[chuc] + ' mươi';
    if (chuc == 0 && donvi != 0) KetQua = KetQua + ' linh ';
  }
  if (chuc == 1) KetQua += ' mười ';
  switch (donvi) {
    case 1:
      if (chuc != 0 && chuc != 1) {
        KetQua += ' mốt ';
      } else {
        KetQua += ChuSo[donvi];
      }
      break;
    case 5:
      if (chuc == 0) {
        KetQua += ChuSo[donvi];
      } else {
        KetQua += ' lăm ';
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
  var KetQua = '';
  var tmp = '';
  var ViTri = new Array();
  if (SoTien < 0) return 'Số tiền âm !';
  if (SoTien == 0) return 'Không đồng !';
  if (SoTien > 0) {
    so = SoTien;
  } else {
    so = -SoTien;
  }
  if (SoTien > 8999999999999999) {
    //SoTien = 0;
    return 'Số quá lớn!';
  }
  ViTri[5] = Math.floor(so / 1000000000000000);
  if (isNaN(ViTri[5])) ViTri[5] = '0';
  so = so - parseFloat(ViTri[5].toString()) * 1000000000000000;
  ViTri[4] = Math.floor(so / 1000000000000);
  if (isNaN(ViTri[4])) ViTri[4] = '0';
  so = so - parseFloat(ViTri[4].toString()) * 1000000000000;
  ViTri[3] = Math.floor(so / 1000000000);
  if (isNaN(ViTri[3])) ViTri[3] = '0';
  so = so - parseFloat(ViTri[3].toString()) * 1000000000;
  ViTri[2] = parseInt(`${so / 1000000}`);
  if (isNaN(ViTri[2])) ViTri[2] = '0';
  ViTri[1] = parseInt(`${(so % 1000000) / 1000}`);
  if (isNaN(ViTri[1])) ViTri[1] = '0';
  ViTri[0] = parseInt(`${so % 1000}`);
  if (isNaN(ViTri[0])) ViTri[0] = '0';
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
    if (i > 0 && tmp.length > 0) KetQua += ','; //&& (!string.IsNullOrEmpty(tmp))
  }
  if (KetQua.substring(KetQua.length - 1) == ',') {
    KetQua = KetQua.substring(0, KetQua.length - 1);
  }
  KetQua = KetQua.substring(1, 2).toUpperCase() + KetQua.substring(2);
  return KetQua; //.substring(0, 1);//.toUpperCase();// + KetQua.substring(1);
}
export { pageSizeOptions, radioGroup, adcolumnsToDisplay };
