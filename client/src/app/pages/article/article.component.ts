import { ChangeDetectorRef, Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AdUpsertComponent } from 'src/app/components/ad-upsert/ad-upsert.component';
import { fields } from 'src/app/general';
import { Fields } from 'src/app/Models/field';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrl: './article.component.scss',
})
export class ArticleComponent {
  url='article';
  option: any = {
    url: this.url,
    displayedColumns: [
      'title',
      'content',
      'linkProducts',
      'comments',
      'media',
      'type',
      'randomMedia',
      'active',
    ],
    isShowBt: true,
    displayCheckbox: true,
  };
  fieldFilter: any;
  constructor(private dialog: MatDialog) {
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
  obj = {
    id: [0],
    title: ['', Validators.required],
    content: ['', Validators.required],
    linkProducts: [''],
    comments: [''],
    type: [''],
    media: [''],
    randomMedia: [0],
    active: [true],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  initObj(item: any = null) {
    this.obj = {
      id: [item.id | 0],
      title: [item?.title, Validators.required],
      content: [item?.content, Validators.required],
      linkProducts: [item?.linkProducts],
      comments: [item?.comments],
      type: [item.type],
      media: [item.media],
      randomMedia: [item.randomMedia],
      active: [item.active],
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
    this.dialog.open(AdUpsertComponent, {
      data: {
        value: value,
        fields: this.fieldFilter,
        obj: this.obj,
        title: 'Thêm tài khoản facebook',
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
