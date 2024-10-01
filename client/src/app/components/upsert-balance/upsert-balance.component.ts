import { Component, CUSTOM_ELEMENTS_SCHEMA, HostListener } from '@angular/core';
import { ImportsModule } from 'src/app/imports';
import { DisplayNumberComponent } from '../display-number/display-number.component';
import { AdAutocompleteComponent } from '../ad-autocomplete/ad-autocomplete.component';
import { FormBuilder, Validators } from '@angular/forms';
import { BaseApiUrl, getItem, setItem } from 'src/app/general';
import { ApiService } from 'src/app/services/api.service';
import { Socket } from 'ngx-socket-io';
import { AD_Form } from 'src/app/Ad_form';
import { WeighingSlip, WeighStation } from 'src/app/Models/weighStation';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { DisplayHtmlComponent } from '../display-html/display-html.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogConfirmComponent } from '../dialog-confirm/dialog-confirm.component';
import { environment } from 'src/app/environment';
import { ReportTodayComponent } from '../report-today/report-today.component';
import {radioGroup}  from '../../general'
import { AdTableComponent } from '../ad-table/ad-table.component';
declare var createElements: any;
@Component({
  selector: 'app-upsert-balance',
  standalone: true,
  imports: [ImportsModule, DisplayNumberComponent, AdAutocompleteComponent,ReportTodayComponent,AdTableComponent],
  templateUrl: './upsert-balance.component.html',
  styleUrl: './upsert-balance.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class UpsertBalanceComponent {
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
      'carNumber',
      'customerName',
      'productName',
      'weight1',
      'weight2',
      'cargoVolume',
      'tare',
      'price',
      'numberOfContainers',
   
    ],
    isShowBt: false,
 
   
  };
  keyTare = 'tare';
  weight = 0;
  cargoVolume = 0;
  tapchats: any[] = [];
  objTare = {
    label: 'Bàn Cân',
    value: 0,
    tare: getItem('tare') || '0%',
  };
  inputBanCan = {
    label: 'Bàn Cân',
    value: 0,
    tare: '',
  };
  inputWeight1 = {
    label: 'Cân Lần 1',
    value: 0,
    tare: '',
    time: '',
  };
  inputWeight2 = {
    label: 'Cân Lần 2',
    value: 0,
    tare: '',
    time: '',
  };
  inputWeight3 = {
    label: 'TL Hàng',
    value: 0,
    tare: getItem('tare') || '0%',
  };
  inputWeight4 = {
    label: 'TL Hàng thực tế',
    value: 0,
    tare: '',
  };
  radioGroups = radioGroup;
  
  selectedRadio = '';
  form: any;
  pathApi = BaseApiUrl.TramCan;
  data: any[] = [];
  carNumbers: any[] = [];
  carProductNames: any[] = [];
  customerNames: any[] = [];
  containerNumbers: any[] = [];
  isUpdate = false;
  rawHtml = '';
  indexDisplay = 0;
  valuesClickRow: any;
  condistionTable: any;
  // options: any = {
  //   url: '',
  //   displayedColumns: [],
  //   pageSize: 15,
  //   isShowBt: false,
  //   displayedColumnGroup:['createdAt','weight1','weight2','cargoVolume','actualVolume','pay','payment']
  // };
  @HostListener('window:keydown.control.p', ['$event'])
  bigFont(event: KeyboardEvent) {
    event.preventDefault();
    const el = document.getElementById('printer') as HTMLElement;
    if (el) {
      el.click();
    }
  }
  @HostListener('window:keydown.control.s', ['$event'])
  save(event: KeyboardEvent) {
    event.preventDefault();
    const el = document.getElementById('btnsave') as HTMLElement;
    if (el) {
      el.click();
    }
  }
  constructor(
    private fb: FormBuilder,
    private service: ApiService,
    private socket: Socket,
    private _adForm: AD_Form,
    private snackbar: SnackbarService,
    private dialog: MatDialog
  ) {}
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getWeighStations();
    this.getTapchats();
    this.receiveMessage();
    this.init();
    this.condistionTable = {
      startDay: new Date(),
      endDay: new Date(),
      
    };
  }
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    createElements();
  }
  click(e: any) {
    console.log(e.target.value);
  }
  onClickIt(index: any, item: any) {
    const t = document.querySelector(
      `.start:nth-child(${index + 1}) > input`
    ) as HTMLElement;
    if (t) {
      (t as HTMLElement).click();
    }
  }
  init() {
    this.form = this.fb.group({
      id: [],
      productName: [],
      carNumber: [, Validators.required],
      weight1: [, Validators.required],
      weight2: [],
      cargoVolume: [],
      price: [],
      containerNumber: [''],
      customerName: [, Validators.required],
      tare: [getItem(this.keyTare) || '0%'],
      tareKg: [],
      note: [''],
      unit: [getItem('unit') || 'USD'],
      warehouse: [],
      placeOfIssue: [''],
      recipient: [''],
      ieGoods: [''],
      exchangeRate: [], //tỉ giá
      driver: [],
      createdAt: [],
      updatedAt: [],
      userId: [],
      driverId: [],
      customerId: [],
      actualVolume: [],
      pay: [],
      payment: [],
    });
    this._adForm.setForm = this.form;
  }
  ngSubmit() {
    const id = this.form.value.id;
    this.calc();
    if (!id) {
      this.service.create(this.pathApi, this.form.value);
    } else {
      this.service.update(this.pathApi, this.form.value);
    }
  }

  calc() {
    const id = this.form.value.id;
    if (!id || id == 0) {
      this._adForm.setValue('weight1', this.weight);
    }
    this._adForm.setValue('weight1', this.inputWeight1.value);
    this._adForm.setValue('weight2', this.inputWeight2.value);
    let cargoVolume =
      this._adForm.getValue('weight1') - this._adForm.getValue('weight2') || 0;
    cargoVolume = Math.abs(cargoVolume);
    this._adForm.setValue('cargoVolume', Math.abs(cargoVolume));
    const ieGoods = this._adForm.getValue('ieGoods');
    if (!ieGoods) {
      console.log('xuat thong bao');
    }
    const price = this._adForm.getValue('price');
    const tare =
      `${this._adForm.getValue('tare')}`.replace('%', '').trim() || '0';
    const tareKg = (Math.abs(cargoVolume) * parseFloat(tare)) / 100;
    this._adForm.setValue('tareKg', tareKg);
    const actualVolume = Math.abs(cargoVolume) - tareKg;
    this.inputWeight3.value = cargoVolume;
    this.inputWeight4.value = actualVolume;
    this._adForm.setValue('actualVolume', actualVolume);
    if (price) {
      const pay = actualVolume * price;
      this._adForm.setValue('pay', pay);
      const exchangeRate = this._adForm.getValue('exchangeRate');
      this._adForm.setValue('payment', exchangeRate ? pay / exchangeRate : pay);
    }
    this._adForm.setValue('userId', getItem('userId'));
  }
  onSelectionx(event: any) {}
  onChangeRadio(item: any) {
    this.form.controls['ieGoods'].setValue(item);
  }
  eventUpsertTable(event: any) {
    const values = structuredClone(event);
    if (values.no) delete values.no;
    this._adForm.setValues(values);
    this.inputWeight1.value = values.weight1;
    this.inputWeight1.time = new Date(values.createdAt).toLocaleString();
    this.inputWeight2.value = values.weight2;
    this.inputWeight2.time = new Date(values.updatedAt).toLocaleString();
    this.isUpdate = true;
    this.valuesClickRow = values;
  }
  onMouseEnterDisplay(index: any) {
    if (Number.isInteger(index)) {
      this.indexDisplay = index;
    } else {
      switch (index) {
        case '1':
          this._adForm.setValue('weight1', this.weight);
          this._adForm.setValue('createdAt', new Date());
          break;
        case '2':
          this._adForm.setValue('weight2', this.weight);
          this._adForm.setValue('updatedAt', new Date());
          break;
        default:
          break;
      }
      this.ngSubmit();
    }
  }
  onMouseOutDisplay(index: number) {
    this.indexDisplay = 0;
    if (this.valuesClickRow) {
      this.inputWeight1.value = this.valuesClickRow.weight1;
      this.inputWeight2.value = this.valuesClickRow.weight2;
    }
  }
  async onPrinter() {
    const rawHtml = await this.renderHtml();
    const print = getItem('print');
    if (print) {
      const printerName = print.printer.name;
      const pageSize = print.page.value;
      //console.log(printerName, rawHtml, pageSize )
      this.service
        .update('print-html', { printerName, rawHtml, pageSize })
        .then((e: any) => {
          console.log(e);
        });
    }
  }
  onChangeDisplayNumber(event: any, case1: any = 1) {
    console.log(case1);
    switch (case1) {
      case 1:
        {
        }
        break;
      case 2:
        {
        }
        break;
      case 3:
        {
          const value = event.target ? event.target.value : event;
          this.inputWeight3.tare = value;
          setItem(this.keyTare, this.inputWeight3.tare);
          this._adForm.setValue(this.keyTare, this.inputWeight3.tare);
        }
        break;
    }
  }
  onChangeUnit(event: any) {
    setItem('unit', event.target.value);
  }
  onDelete() {
    const id = this._adForm.getValue('id');
    this.service.destroy(this.pathApi, id);
  }
  reset() {
    this.form.reset();
  }
  //==============================
  getTapchats() {
    for (let i = 0; i < 51; i++) {
      this.tapchats.push(`${i}%`);
    }
  }
  getWeighStations() {
    const params = { startDay: new Date(), endDay: new Date(), column: ['id'] };
    this.service.get(this.pathApi, params).then((e: any) => {
      this.data = e.items;
      this.carNumbers = [
        ...new Set(Array.from(this.data).map((x) => x['carNumber'])),
      ];
      this.carProductNames = [
        ...new Set(Array.from(this.data).map((x) => x['productName'])),
      ];
      this.customerNames = Array.from(this.data)
        .map((x) => {
          return {
            customerName: x['customerName'],
            customerId: x['customerId'],
          };
        })
        .filter(onlyUnique);
    });
    this.containerNumbers = [
      ...new Set(this.data.map((x) => x['containerNumber'])),
    ];
  }
  receiveMessage() {
    // if(!this.socket.disconnect().connected) this.socket.connect();
    this.socket.on('message', async (response: any) => {
      let matches = response.data.match(/(\d+)/);
      this.weight = matches[0];
      this.inputBanCan.value = this.weight;
      const w1 = this.form.controls['weight1'].value;

      if (!this._adForm.getValue('id')) {
        this.inputWeight1.value = this.weight;
        this.inputWeight1.time = new Date().toLocaleString('vi-VN');
        //this.form.controls['weight1'].setValue(this.weight);
        this._adForm.setValue('weight1', this.weight);
        this._adForm.setValue('weight2', 0);
      } else {
        const w2 = this._adForm.getValue('weight2');
        if (w2 == 0) {
          this.inputWeight2.value = this.weight;
          this.inputWeight2.time = new Date().toLocaleString('vi-VN');
          // this._adForm.setValue('weight2', this.weight);
        }
      }

      switch (this.indexDisplay) {
        case 1:
          this.inputWeight1.value = this.weight;
          this.inputWeight1.time = new Date().toLocaleString('vi-VN');
          break;
        case 2:
          this.inputWeight2.value = this.weight;
          this.inputWeight2.time = new Date().toLocaleString('vi-VN');
          break;
        default:
          break;
      }
      this.calcDisplay();
    });
  }
  calcDisplay() {
    const cargoVolume = Math.abs(
      this.inputWeight1.value - this.inputWeight2.value
    );
    const tare =
      `${this._adForm.getValue('tare')}`.replace('%', '').trim() || '0';
    const tareKg = (Math.abs(cargoVolume) * parseFloat(tare)) / 100;
    const actualVolume = cargoVolume - tareKg;
    this.inputWeight3.value = cargoVolume;
    this.inputWeight4.value = actualVolume;
  }
  //#region html bill
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
    if (!data.id) {
      //this.dialog.open(DialogConfirmComponent);
    }
    const item = getItem('print');
    const item1 = getItem('company');

    const minmax = this.minMax();
    const printer = item.printer;
    const company = JSON.parse(item1);
    const t = data as WeighingSlip;
    t.TENCONGTY = company.name;
    t.DIACHI = company.address;
    t.PHONE = company.phone;
   
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
    t.payVolume = t.actualVolume.toLocaleString('vi-VN');
    if(data.price){
      t.BANGCHU = '1000.convertMoneyIntoWords()';
     
    }
 
    const keys = Object.keys(t);
    const t1 = t as any;
    for (let index = 0; index < keys.length; index++) {
      const element = keys[index];
      html = html.replaceAll(`{{${element}}}`, t1[element]);
    }
    return html;
  }
  reviewBill() {
    if (!this.form.value.id) {
      this.snackbar.openSnackBar('Bạn chưa chọn mẫu để xem trước khi in', 5000);
      return;
    }
    this.service.get('bill').then((e: any) => {
      if (e.data.includes('TimedOutError')) {
        this.snackbar.openSnackBar(e.data);
      } else {
        this.rawHtml = e.data;
        this.rawHtml = this.includesDataInBill(this.rawHtml, this.form.value);
        this.dialog.open(DisplayHtmlComponent, { data: this.rawHtml });
      }
    });
  }
  async renderHtml() {
    return new Promise((res, rej) => {
      this.service.get('bill').then((e: any) => {
        if (e.data.includes('TimedOutError')) {
          this.snackbar.openSnackBar(e.data);
        } else {
          this.rawHtml = e.data;
          this.rawHtml = this.includesDataInBill(this.rawHtml, this.form.value);
          res(this.rawHtml);
        }
      });
    });
  }
  exportCsv() {
    const pathUrl = `${environment.baseUrl}/downloadExcel`;
    var a = document.createElement('a');
    a.href = pathUrl;
    a.download = 'ok.csv';
    // start download
    a.click();
  }
  pathDownload = `${environment.baseUrl}/downloadExcel`;
  //#endregion
}

function onlyUnique(value: any, index: number, array: any[]): value is any {
  return array.indexOf(value) === index;
}

