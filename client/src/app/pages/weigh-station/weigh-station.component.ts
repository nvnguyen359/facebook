import { Dialog } from '@angular/cdk/dialog';
import { Component, SimpleChanges } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  NG_VALUE_ACCESSOR,
  Validators,
} from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Socket } from 'ngx-socket-io';
import { DialogConfirmComponent } from 'src/app/Components/dialog-confirm/dialog-confirm.component';
import { DisplayHtmlComponent } from 'src/app/components/display-html/display-html.component';
import { DynamicUpsertComponent } from 'src/app/Components/dynamic-upsert/dynamic-upsert.component';
import { delay, getItem, setItem, Status } from 'src/app/general';
import { BILL } from 'src/app/Models/bill';
import { ResponseTramCan } from 'src/app/Models/ResponseTramCan';
import { WeighingSlip, WeighStation } from 'src/app/Models/weighStation';
import { ApiService } from 'src/app/services/api.service';
import { DataService } from 'src/app/services/data.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { SocketService } from 'src/app/services/socket.service';
import { SettingComponent } from '../setting/setting.component';

@Component({
  selector: 'app-weigh-station',
  templateUrl: './weigh-station.component.html',
  styleUrl: './weigh-station.component.scss',
  standalone: false,
})
export class WeighStationComponent {
  optionCustomer = {
    name: 'customerName',
    showtext: 'customerName',
    label: 'Tên Khách hàng',
    placeholder: 'Tìm Khách Hàng',
    banks: '',
    url: 'weighStation',
    showButton: false,
    default: '',
  };
  optionCarNumber = {
    name: 'carNumber',
    showtext: 'carNumber',
    label: 'Biển Số Xe',
    placeholder: 'Tìm kiếm số xe',
    banks: '',
    url: 'weighStation',
    showButton: false,
    default: '',
  };
  optionWeighProductName = {
    name: 'productName',
    showtext: 'productName',
    label: 'Tên Hàng',
    placeholder: 'Tìm kiếm tên hàng...',
    banks: '',
    url: 'weighStation',
    showButton: false,
    default: '',
  };
  optionWeighType = {
    name: 'numberOfContainers',
    showtext: 'numberOfContainers',
    label: 'Số container',
    placeholder: 'Tìm kiếm số container...',
    banks: '',
    url: 'weighStation',
    showButton: false,
    default: '',
  };
  objReset = {};
  objx: WeighStation = {
    id: 0,
    carNumber: '',
    customerName: '',
    weight1: 0,
    weight2: 0,
    cargoVolume: 0,
    tare: '',
    customerId: '',
    numberOfContainers: '',
    note: null,
    userId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true,
    ieGoods: '',
    tareKg: 0,
    price: 0,
    productName: '',
    unit: '',
    exchangeRate: 0,
  };
  optionsTable: any = {
    url: 'weighStation',
    displayedColumns: [
      'id',
      'customerName',
      'productName',
      'carNumber',
      'weight1',
      'weight2',
      'cargoVolume',
      'tage',
      'price',
      'numberOfContainers',
      'ieGoods',
      'updatedAt',
    ],
    pageSize: 100,
    isShowBt: false,
    data: null,
  };
  impurities: any = [];
  keyUnitCurrent = 'unit';
  keyUnitCurrentTi = 'unitTi';
  keyTage = 'tage';
  keyTageKg = 'tageKg';
  keyPrice = 'price';

  radioGroup = ['Xuất Hàng', 'Nhập Hàng', 'Dich Vụ'];
  selectedRadio = '';
  defaultObj: any;
  obj = {
    type: 'text',
    value: '0',
    lable: 'TL Cân lần 1:',
    require: true,
    id: 1,
  };
  obj1 = {
    type: 'text',
    value: '0',
    lable: 'TL Cân lần 2:',
    require: false,
    id: 2,
  };
  notiError = false;
  form: any = null;
  panelOpenState = false;
  weight: any = '';
  ports = [];
  weighStations: any[] = [];
  connect = true;
  cargoVolume = 0;
  keyWeight = 0;
  // @ViewChild('div1') div1: ElementRef | undefined;
  defaultY = {
    tage: '0%',
    tageKg: 0,
    price: 0,
    unit: 'VND',
    unitTi: 'USD',
  };
  rawHtml = '';
  isSetting = false;
  constructor(
    private socketService: SocketService,
    private socket: Socket,
    private services: ApiService,
    private dataService: DataService,
    private fb: FormBuilder,
    private snackbar: SnackbarService,
    private dialog: MatDialog
  ) {}
  async ngOnInit(): Promise<void> {
    const inputs = document.querySelectorAll('input');
    if (inputs.length > 0) {
      inputs.forEach((item: HTMLElement) => {
        item.addEventListener('focus', () => {
          this.isSetting = this.checkSetting();
          if (this.isSetting) {
            return;
          }
        });
      });
    }
    this.checkSetting();
    if (getItem(this.keyPrice)) this.defaultY.price = getItem(this.keyPrice);
    if (getItem(this.keyTage)) this.defaultY.tage = getItem(this.keyTage);
    if (getItem(this.keyTageKg)) this.defaultY.tageKg = getItem(this.keyTageKg);
    if (getItem(this.keyUnitCurrent))
      this.defaultY.unit = getItem(this.keyUnitCurrent);
    if (getItem(this.keyUnitCurrentTi))
      this.defaultY.unitTi = getItem(this.keyUnitCurrentTi);
    this.objReset = this.objx;
    this.initForm();
    await this.getWeighStation();
    if (this.socket.disconnect()) this.socket.connect();
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.createImpurities();
    await this.receiveMessage();
  }
  checkSetting() {
    const item = getItem('print');
    const item1 = getItem('company');
    const item2 = getItem('serial');
    if (!(item && item1 && item2)) {
      const dialogRef = this.dialog.open(DialogConfirmComponent, {
        data: { header: 'Bạn cần thiết lập thông tin cần thiết!' },
      });
      dialogRef.afterClosed().subscribe((e: boolean) => {
        if (e) {
          this.dialog.open(SettingComponent);
        }
      });
      return true;
    } else {
      return false;
    }
  }
  async ngAfterViewInit() {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
  }
  initForm() {
    this.form = this.fb.group({
      weight1: [this.objx.weight1, Validators.required],
      weight2: [this.objx.weight2],
      cargoVolume: this.objx.cargoVolume,
      carNumber: [this.objx.carNumber, [Validators.required]],
      price: this.objx.price,
      tareKg: this.objx.tareKg,
      tare: this.objx.tare || '0%',
      unit: this.objx.unit,
      ieGoods: [this.objx.ieGoods, [Validators.required]],
      customerName: [this.objx.customerName, [Validators.required]],
      productName: [this.objx.productName, [Validators.required]],
      type: this.objx.numberOfContainers,
      isActive: this.objx.isActive,
      id: this.objx.id || 0,
      customerId: this.objx.customerId || '',
      userId: this.objx.userId || '',
      exchangeRate: this.objx.exchangeRate,
      updatedAt: this.objx.updatedAt || new Date(),
      createdAt: this.objx.createdAt || new Date(),
    }) as FormGroup;
    //this.form.controls['tage'].setValue(getItem(this.keyTage))
  }
  outputValue(event: any) {
    switch (event.key) {
      case 1:
        {
          this.form.controls['weight1'].setValue(event.value);
        }
        break;

      default:
        this.form.controls['weight2'].setValue(event.value);
        break;
    }
    //  console.log(this.form.value);
  }
  createImpurities() {
    for (let i = 0; i < 51; i++) {
      this.impurities.push(i + '%');
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
  }
  resetForm() {
    this.form.patchValue(this.objReset);
  }
  async ngSubmit() {
    const value = this.form.value;
    if (value.weight1 == '') value.weight1 = 0;
    if (value.weight2 == '' || value.weight2 == null) value.weight2 = 0;
    value.updatedAt = new Date();
    if (Number.isNaN(value.cargoVolume)) value.cargoVolume = 0;
    if (value.id == 0) {
      this.services.create1(value).then((e: any) => console.log(e));
    } else {
      this.services.update1(value);
    }
    await delay(500);
    this.form.patchValue(this.objReset);
  }
  selectionChangeTapChat(event: any) {
    setItem(this.keyTage, event.value);
  }
  keypressDonGia(event: any) {
    setItem(this.keyPrice, event.target.value);
  }
  keyUptageKg(event: any) {
    setItem(this.keyTageKg, event.target.value);
  }
  selectionChangeUnit(event: any) {
    setItem(this.keyUnitCurrent, event.value);
  }
  selectionChangeUnitTi(event: any) {
    setItem(this.keyUnitCurrentTi, event.value);
  }
  onChangeRadio(event: any) {}
  async savePrint() {
    // await this.ngSubmit();
  }
  minMax() {
    const t = this.form.value as WeighStation;
    const check = parseInt(t.weight1) > parseInt(t.weight2);
    return {
      max: check ? t.weight1 : t.weight2,
      min: !check ? t.weight1 : t.weight2,
      isMax: check,
    };
  }
  includesDataInBill(html: string, data: any = null): string {
    if (!data) data = this.form.value;

    //console.log('data', this.form.value);
    const item = getItem('print');
    const item1 = getItem('company');

    const minmax = this.minMax();
    const printer = item.printer;
    const company = JSON.parse(item1);
    const t = data as WeighingSlip;
    t.TENCONGTY = company.name;
    t.DIACHI = company.address;
    t.PHONE = company.phone;
    t.BANGCHU = 'bang chu';
    t.id = data.id;
    t.carNumber = data.carNumber;
    t.weight1 = minmax.max.toLocaleString('vi-VN');
    t.weight2 = minmax.min.toLocaleString('vi-VN');
    t.productName = data.productName;
    t.PAGESIZE = item.page.value == '210mm' ? 'a4' : 'a5';
    t.cargoVolume = t.cargoVolume.toLocaleString('vi-VN');
    //console.log(t.updatedAt,new Date(t.updatedAt).toLocaleTimeString())
    t.createdAt1 = minmax.isMax
      ? new Date(t.createdAt).toLocaleString('vi-VN')
      : new Date(t.updatedAt).toLocaleString('vi-VN');
    t.updatedAt1 = !minmax.isMax
      ? new Date(t.createdAt).toLocaleString('vi-VN')
      : new Date(t.updatedAt).toLocaleString('vi-VN');
    t.NGAY = new Date().toLocaleDateString();
    t.hide = !t.price ? 'hide' : '';
    if (t.tareKg == null) {
      t.tareKg = 0;
    }
    t.payVolume = (t.cargoVolume - t.tareKg).toLocaleString('vi-VN');
    const keys = Object.keys(t);
    const t1 = t as any;
    for (let index = 0; index < keys.length; index++) {
      const element = keys[index];
      // console.log(element);
      html = html.replaceAll(`{{${element}}}`, t1[element]);
    }
    return html;
  }
  reviewBill() {
    this.services.get('bill').then((e: any) => {
      if (e.data.includes('TimedOutError')) {
        this.snackbar.openSnackBar(e.data);
      } else {
        this.rawHtml = e.data;
        this.rawHtml = this.includesDataInBill(this.rawHtml, this.form.value);
        this.dialog.open(DisplayHtmlComponent, { data: this.rawHtml });
      }
    });
  }
  onClickRadio(item: any) {
    const value = this.form.value;
    if (`${item}`.includes('Nhập Hàng'))
      this.notiError =
        value.weight1 < value.weight2 && `${item}`.includes('Nhập Hàng');
    if (`${item}`.includes('Xuất Hàng'))
      this.notiError =
        value.weight1 > value.weight2 && `${item}`.includes('Xuất Hàng');
  }
  async onDelete() {
    this.services.destroy1(this.objx.id);
  }
  btCanXeClick() {
    this.connect = this.connect == true ? false : true;
  }
  cal() {
    switch (this.keyWeight) {
      case 0:
        {
          this.obj.value = this.weight;
          this.form.controls['weight1'].setValue(this.weight);
        }
        break;
      case 1:
        {
          this.obj1.value = this.weight;
          this.form.controls['weight2'].setValue(this.weight);
        }
        break;
      case 2:
        {
        }
        break;
      default:
        {
          this.obj.value = this.weight;
          this.form.controls['weight1'].setValue(this.weight);
        }
        break;
    }
    this.cargoVolume = Math.abs(
      parseInt(this.form.controls['weight1'].value) -
        parseInt(this.form.controls['weight2'].value)
    );
    this.form.controls['cargoVolume'].setValue(this.cargoVolume);
  }
  keyUpAutoComplate(event: any) {
    // console.log(event);
    this.form.controls[event.key].setValue(event.value);
  }
  onSelectedAuto(event: any) {}

  eventUpsertTable(event: WeighStation) {
    // console.log(event);
    this.objx = event;
    this.optionCarNumber.default = event.carNumber;
    this.optionCustomer.default = event.customerName;
    this.optionWeighProductName.default = event.productName;
    this.optionWeighType.default = event.numberOfContainers;
    this.obj.value = event.weight1.toString();
    this.obj1.value = event.weight2.toString();
    this.form.patchValue(event);
    this.connect = true;
    if (this.objx.weight1 != 0 && this.objx.weight2 == 0) {
      this.keyWeight = 1;
    }
    if (this.objx.weight1 != 0 && this.objx.weight2 != 0) {
      this.keyWeight = 2;
    }
  }
  //------------------

  async receiveMessage(): Promise<string> {
    return new Promise((res, rej) => {
      this.socket.on('message', async (response: any) => {
        let matches = response.data.match(/(\d+)/);
        if (this.connect) this.weight = matches[0];
        this.cal();
        res(matches);
      });
    });
  }

  async getComs() {
    this.ports = await this.services.get('ports');
  }
  private async getWeighStation() {
    const data = (await this.services.get('weighStation')) as ResponseTramCan;
    this.weighStations = data.items;
    // console.log(this.weighStations)
  }
}
