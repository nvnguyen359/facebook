import { ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AdUpsertComponent } from 'src/app/components/ad-upsert/ad-upsert.component';
import { DynamicUpsertComponent } from 'src/app/Components/dynamic-upsert/dynamic-upsert.component';
import { fields } from 'src/app/general';
import { Fields } from 'src/app/Models/field';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-social',
  templateUrl: './social.component.html',
  styleUrl: './social.component.scss',
})
export class SocialComponent {
  url = 'social';
  optionsTable: any = {
    url: this.url,
    displayedColumns: [
      'userName',
      
      'uid',
      'cookies',
      'proxy',
      'active',
    ],
    isShowBt: true,
    displayCheckbox: true,
  };
  fieldFilter: any;
  constructor(
    private service: ApiService,
    private changeDetectorRefs: ChangeDetectorRef,
    private dialog: MatDialog
  ) {
    this.fieldFilter = (fields() as Fields[])
      .filter((x: any) => this.columns.includes(x.field))
      .map((x: Fields) => {
        if (x.field == 'updatedAt' || x.field == 'createdAt') {
          x.show = false;
        } else {
          x.show = true;
        }
        return x;
      });
  }
  columns = [
    'userName',
    'password',
    'uid',
    'cookies',
    'proxy',
    'updatedAt',
    'createdAt',
  ];

  obj = {
    id: [0],
    userName: [, Validators.required],
    password: [, Validators.required],
    cookies: [''],
    proxy: [''],
    uid: [''],

    createdAt: new Date(),
    updatedAt: new Date(),
  };
  initObj(item: any = null) {
    this.obj = {
      id: [item.id | 0],
      userName: [item?.userName, Validators.required],
      password: [item?.password, Validators.required],
      cookies: [item?.cookies],
      proxy: [item?.proxy],
      uid: [item.uid],

      createdAt: item.createdAt,
      updatedAt: new Date(),
    };
    return this.obj;
    // this.obj.uid.setValue(item.uid)
  }
  onCreate() {
    this.openDialog();
  }
  openDialog(value: any = null) {
    const title =Array.isArray(value)&& value[0].id
      ? 'Cập nhật tài khoản facebook'
      : 'Thêm tài khoản facebook';
    this.dialog.open(AdUpsertComponent, {
      data: {
        value: value,
        fields: this.fieldFilter,
        obj: this.obj,
        title,
        url: this.url,
      },
    });
  }
  onUpsert(event: any) {
    let values: any[] = [];
    Array.from(event).forEach((item: any) => {
      values.push(item);
    });
    this.openDialog(values);
  }
}
