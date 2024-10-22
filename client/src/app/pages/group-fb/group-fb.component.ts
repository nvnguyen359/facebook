import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Route, Router } from '@angular/router';
import { WithConfig } from 'ng-zorro-antd/core/config';
import { AdUpsertComponent } from 'src/app/components/ad-upsert/ad-upsert.component';
import { DialogConfirmComponent } from 'src/app/Components/dialog-confirm/dialog-confirm.component';
import { BaseApiUrl, fields, Status } from 'src/app/general';
import { Fields } from 'src/app/Models/field';
import { ApiService } from 'src/app/services/api.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-group-fb',
  templateUrl: './group-fb.component.html',
  styleUrl: './group-fb.component.scss',
})
export class GroupFbComponent {
  task: any;
  columns = [
    'name',
    'socialId',
    'groupId',
    'member',
    'active',
    'updatedAt',
    'createdAt',
  ];
  url = BaseApiUrl.groupFb;
  option: any = {
    url: this.url,
    displayedColumns: ['name', 'groupId', 'member', 'active'],
    isShowBt: true,
    displayCheckbox: true,
  };
  fieldFilter: any;
  socials: any[] = [];
  defaultSocial!: any;
  searchColumns: any[] = ['name'];
  constructor(
    private dialog: MatDialog,
    private service: ApiService,
    private dataService: DataService,
    private router: Router
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

  options: any = {
    displayedColumns: ['no', ...this.columns],
  };
  async ngOnInit() {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.socials = (await this.service.get('social')).items;
    if (this.socials.length == 0) {
      const refDialog = this.dialog.open(DialogConfirmComponent, {
        data: {
          header:
            'Chưa có danh sách tài khoản fb bạn phải thêm hoặc cập nhật tài khoản',
        },
      });
      refDialog.afterClosed().subscribe((e: any) => {
        if (e) {
          this.router.navigate([`/${BaseApiUrl.Social}`]);
        }
      });
    }

    await this.getGroups(this.socials);
  }
  async getGroups(socials: any[] = []) {
    const t = await this.service.get(BaseApiUrl.groupFb, { limit: 1 });
    if (t.count == 0) {
      const refDialog = this.dialog.open(DialogConfirmComponent, {
        data: {
          header: 'Danh sách các group chưa có, bạn muốn tự động cập nhật!',
        },
      });
      refDialog.afterClosed().subscribe(async (e: any) => {
        if (e) {
          // console.log(socials)
          await this.getGroupsApi(socials);
        }
      });
    }
  }
  async getGroupsApi(socials: any[] = []) {
    this.service
      .update(`fb`, { values: socials, headless: false }, BaseApiUrl.groupFb)
      .then((result: any) => {
        console.log(result);
      });
  }
  obj = {
    id: [0],
    name: ['', Validators.required],
    uid: [''],
    member: [''],
    status: [''],
    active: [true],
    groupId: ['', Validators.required],
    socialId: [''],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  initObj(item: any = null) {
    this.obj = {
      id: [item.id | 0],
      name: [item?.name, Validators.required],
      uid: [item?.uid],
      member: [item?.member],
      status: [item?.status],
      groupId: [item?.groupId, Validators.required],
      active: [item.active],
      socialId: [item?.socialId],
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
    //console.log(this.defaultSocial?.id?'disabled':'')
    // console.log( this.obj)
    this.dialog.open(AdUpsertComponent, {
      data: {
        value: value,
        fields: this.fieldFilter,
        obj: this.obj,
        title: 'Thêm Group Mới',
        url: this.url,
        datalist: this.socials,
        datalistField: {
          view: 'userName',
          second: 'uid',
          disable: this.defaultSocial?.id ? 'disabled' : '',
        },
        searchColumns: ['name'],
      },
    });
  }
  onUpsert(event: any) {
   if(!event.isSekected)
   {
   // this.openDialog(event.values);
   }
  }
  async onChange(event: any) {
    this.defaultSocial = event.value;
   // await this.getGroupsApi([this.defaultSocial]);
    this.obj.socialId = this.defaultSocial?.id;
    this.obj.uid = this.defaultSocial?.uid;
    this.dataService.sendMessage({
      status: Status.Search,
      socialId: event.value.id,
    });
  }
  // async getSocials() {
  //  await this.service.get('social');
  // }
}
