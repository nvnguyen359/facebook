import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AdUpsertComponent } from 'src/app/components/ad-upsert/ad-upsert.component';
import { fields, Status } from 'src/app/general';
import { Fields } from 'src/app/Models/field';
import { ApiService } from 'src/app/services/api.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-group-fb',
  templateUrl: './group-fb.component.html',
  styleUrl: './group-fb.component.scss',
})
export class GroupFbComponent {
  url = 'groupFb';
  option: any = {
    url: this.url,
    displayedColumns: ['name', 'socialId', 'groupId', 'member', 'active'],
    isShowBt: true,
    displayCheckbox: false,
  };
  fieldFilter: any;
  socials: any[] = [];
  defaultSocial!: any;
  searchColumns:any[]=['name']
  constructor(
    private dialog: MatDialog,
    private service: ApiService,
    private dataService: DataService
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
  columns = [...this.option.displayedColumns, 'updatedAt', 'createdAt'];
  options: any = {
    displayedColumns: ['no', ...this.columns],
  };
  async ngOnInit() {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.socials = (await this.service.get('social')).items;
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
      socialId: [''],
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
        searchColumns:['name']
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
  onChange(event: any) {
    this.defaultSocial = event.value;
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
