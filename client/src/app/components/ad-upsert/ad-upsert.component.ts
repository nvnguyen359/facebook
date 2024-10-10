import { NgFor, NgIf, AsyncPipe, NgForOf, CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  Inject,
  NO_ERRORS_SCHEMA,
  ViewChild,
} from '@angular/core';
import {
  ReactiveFormsModule,
  FormsModule,
  FormBuilder,
  FormArray,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { DataService } from 'src/app/services/data.service';
import { DynamicUpsertComponent } from '../dynamic-upsert/dynamic-upsert.component';
import { delay, links, Status } from 'src/app/general';
import { Fields } from 'src/app/Models/field';
import { InputCustomComponent } from '../input-custom/input-custom.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UploadComponent } from '../upload/upload.component';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'ad-upsert',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    NgFor,
    FormsModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    NgIf,
    MatDatepickerModule,
    AsyncPipe,
    NgForOf,
    CommonModule,
    MatButtonToggleModule,
    InputCustomComponent,
    MatCheckboxModule,
    MatTooltipModule,
    UploadComponent,
    MatSelectModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  templateUrl: './ad-upsert.component.html',
  styleUrl: './ad-upsert.component.scss',
})
export class AdUpsertComponent {
  form: any;
  itemsDelete: any = [];
  removeAts: any[] = [];
  numberRow = 0;
  url = '';
  localUrl: any[] = [];
  @ViewChild('files') files!: ElementRef;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private router: Router,
    private service: ApiService,
    private dialogRef: MatDialogRef<AdUpsertComponent>,
    private dataService: DataService,
    private cdr: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    const t = location.href.split('/#/');
    this.numberRow = this.data.numberRow;
    this.url = this.data.url ? this.data.url : t[t.length - 1];
    this.initForm();
    const datalist = this.data.datalist;
    console.log(datalist);
  }

  initForm() {
    let formArray = this.fb.array([]) as FormArray;
    let array: any[] = this.data.value;
    this.form = this.fb.group({
      formArray: formArray,
      // createdAt: [new Date(), Validators.required],
    });
    if (Array.isArray(array)) {
      const creaties = array.filter((x: any) => x.id == 0 || x.id == '');
      if (creaties.length > 0) {
        this.data.obj = creaties[0];
        this.initDataUpsert(creaties);
      }
      const upsertes = array.filter((x: any) => x.id != 0 || x.id != '');

      if (upsertes.length > 0) {
        this.initDataUpsert(upsertes);
      }
    }

    if (!array) {
      if (!this.data.numberRow) this.data.numberRow = 1;
      this.numberRow = this.data.numberRow;
      for (let i = 0; i < this.data.numberRow; i++) {
        this.onAdd();
      }
    }
  }
  initDataUpsert(array: any[]) {
    let arr = this.form.controls['formArray'] as FormArray;
    array.forEach((item: any) => {
      arr.push(this.fb.group(item));
    });

    this.scrollTop();
  }
  onAdd(num: any = 0) {
    let arr = this.form.controls['formArray'] as FormArray;
    let obj = this.data.obj;

    arr.push(this.fb.group(obj));
    //console.log(arr)
    this.scrollTop();
    //this.data.numberRow++;
    this.numberRow += num;
  }
  onSubmit() {
    this.onSave();
  }
  onOutput(event: any) {
    // console.log(event);
    // console.log(this.form.value)
  }
  onChangeSelect(event: any, index: number) {
    const id = event.target.value;
    const temp = this.data.datalist.find((x: any) => x['id'] == id);
    //console.log(id,temp)
    if (temp) {
      this.form.controls['formArray'].controls[index].controls[
        this.data.datalistField.second
      ].setValue(
        temp[this.data.datalistField.second]
      );
    }
  }
  onSave() {
    const values = Array.from(this.form.value['formArray']).map((x: any) => {
      delete x['no'];
      return x;
    });
    const creates = Array.from(
      values.filter((x: any) => x.id == 0 || x.id == '')
    ) as any[];
    const updates = Array.from(
      values.filter((x: any) => x.id != 0 || x.id != '')
    ) as any[];

    if (creates.length > 0) {
      this.service.create(this.url, creates);
      this.dataService.sendMessage({ status: Status.Refesh });
    }
    if (updates.length > 0) {
      this.service.update(this.url, updates);
    }
  }
  ngAfterViewInit() {
    this.cdr.detectChanges();
    this.scrollTop();
  }

  scrollTop() {
    setTimeout(() => {
      var element = document.getElementById('scrollTop');
      if (element) {
        element.scrollTo({ top: element.scrollHeight, behavior: 'instant' });
      }
    }, 300);
  }
  trackByFn(index: any) {
    return index;
  }
  onEmpty(index: any, item: any) {
    this.form.controls['formArray'].controls[index].controls[item].setValue('');
  }
  openFolder() {
    const files = document.querySelector('#files') as HTMLElement;

    if (files) {
      files.click();
    }
    //this.files.nativeElement?.click();
    // await delay(200)
    // console.log(this.files.nativeElement.value)
  }
  onChangeFiles(event: any) {
    // console.log(event.target.files,event.target.value)
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.localUrl = event.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }
  onDelete(index: any) {
    const ctrl = this.form.controls['formArray'];
    const value = ctrl.value;
    const removeItem = ctrl.value.at(index);
    if (removeItem.id) this.itemsDelete.push(removeItem);

    if (removeItem['id'] != '') this.removeAts.push(removeItem);
    ctrl.setValue(
      value
        .slice(0, index)
        .concat(value.slice(index + 1))
        .concat(value[index])
    );
    ctrl.removeAt(value.length - 1);
    this.numberRow--;
    return;
  }
}
