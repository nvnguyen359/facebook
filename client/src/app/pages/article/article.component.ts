import { ChangeDetectorRef, Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AdUpsertComponent } from 'src/app/components/ad-upsert/ad-upsert.component';
import { BaseApiUrl, fields, Status } from 'src/app/general';
import { Fields } from 'src/app/Models/field';
import { ApiService } from 'src/app/services/api.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrl: './article.component.scss',
})
export class ArticleComponent {
  url = 'article';
  filterGroups: any;
  disabled = true;
  plans: any = {};
  headless = false;
  option: any = {
    url: this.url,
    displayedColumns: [
      'title',
      'content',
      // 'linkProducts',
      // 'comments',
      // 'media',
      'active',
    ],
    isShowBt: true,
    displayCheckbox: true,
    isList: false,
  };
  fieldFilter: any;
  socials: any[] = [];
  fieldFilterSocial: any;
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
  columns = [
    'title',
    'content',
    'linkProducts',
    'comments',
    'media',
    'type',
    'randomMedia',
    'active',
    'updatedAt',
    'createdAt',
  ];
  columnsSocial = ['avatar', 'name'];
  columnsGroups = ['avatar', 'name', 'member'];
  options: any = {
    displayedColumns: ['no', ...this.columns],
  };
  optionsSocial: any = {
    displayedColumns: [...this.columnsSocial],
    isShowBt: false,
    url: BaseApiUrl.Social,
    displayCheckbox: true,
    isList: true,
    isClickRow: false,
  };
  optionsGroups: any = {
    displayedColumns: [...this.columnsGroups],
    // displayedColumnsChild: [...this.columnsGroups],
    isShowBt: false,
    url: BaseApiUrl.groupFb,
    displayCheckbox: true,
    isList: true,
    isClickRow: false,
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
        title: value ? 'Cập Nhật Bài Viết' : 'Thêm Bài Viết Mới',
        url: this.url,
      },
    });
  }
  onUpsert(event: any) {
    //console.log(event);
    if (event?.isSekected) {
      const values = event.values;
      this.plans.articies = values;
      this.isDisaled();
    } else {
      this.openDialog(event.values);
    }
  }
  onUpsertSocial(event: any) {
    this.plans.socials = event;
    this.isDisaled();
  }
  isDisaled() {
    const result =
      this.plans.articies?.length > 0 &&
      (this.plans.socials?.length > 0 || this.plans.groups?.length > 0);
    this.disabled = !result;
  }
  onUpsertGroups(event: any) {
    //console.log(event);
    this.plans.groups = event;
    this.isDisaled();
  }
  onSelectedTabChange(event: any) {
    //  if(event.index==1){
    //  this.optionsGroups.isClickRow= false;
    //  }
  }
  ngOnInit(): void {
    this.service.get(BaseApiUrl.Social).then((e: any) => {
      this.socials = e.items;
    });
    //  this.plans.headless= this.headless;
  }
  onClickChoise(social: any) {
    this.filterGroups = { uid: social.uid, url: BaseApiUrl.groupFb };
  }
  playPause = { icon: 'play_arrow', text: 'Play', color: 'primary' };
  onPlayPause(event: any) {
    this.playPause =
      this.playPause.text == 'Play'
        ? { icon: 'pause', text: 'Pause', color: 'warn' }
        : { icon: 'play_arrow', text: 'Play', color: 'primary' };

    this.service.update(
      BaseApiUrl.RunningPlan,
      { headless: this.headless, values: this.plans },
      BaseApiUrl.Article
    );
    //event.stopPropagation();
  }
}
