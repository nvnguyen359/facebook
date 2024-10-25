import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CommonModule, NgOptimizedImage, SlicePipe } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import {
  MatTable,
  MatTableDataSource,
  MatTableModule,
} from '@angular/material/table';
import {
  delay,
  getItem,
  pageSizeOptions,
  setItem,
  Status,
} from 'src/app/general';
import { ApiService } from 'src/app/services/api.service';
import { GroupITable } from './groupTable';
import { FormatValuePipe } from 'src/app/pipes/format-value.pipe';
import { TextAlignNumberPipe } from 'src/app/pipes/text-align-number.pipe';
import { DisplayColumnPipe } from 'src/app/pipes/display-column.pipe';
import { SumColumnsPipe } from 'src/app/pipes/sum-columns.pipe';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DataService } from 'src/app/services/data.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SlidePipe } from 'src/app/pipes/slide.pipe';
declare var removeAccents: any;
/**
 *
 *
 * @export
 * @class AdTableComponent
 */
@Component({
  selector: 'ad-table',
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
  standalone: true,
  imports: [
    FormatValuePipe,
    TextAlignNumberPipe,
    DisplayColumnPipe,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    CommonModule,
    MatSort,
    MatSortModule,
    SumColumnsPipe,
    MatBadgeModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    SlidePipe,
    NgOptimizedImage,
  ],

  templateUrl: './ad-table.component.html',
  styleUrl: './ad-table.component.scss',
})
/**data */
export class AdTableComponent {
  @Input() data: any[] = [];
  @Input() option: any;
  @Input() condition: any;
  @Input() searchColumns: any = [];
  @Input() filters: any;
  dataSource: any = new MatTableDataSource<any>([]);
  displayedColumns: string[] = [];
  displayedColumnsWithExpand: string[] = [];

  expandedElement: any | null | undefined;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort | undefined;
  selection = new SelectionModel<any>(true, []);
  // @ViewChild(MatTable, { static: false }) table!: MatTable<any>;
  @ViewChild('table', { read: ViewContainerRef }) table!: ViewContainerRef;
  private _liveAnnouncer: LiveAnnouncer | undefined;
  pageSizes = pageSizeOptions;
  //*==============
  resultsLength = 100;
  pageSize = 10;
  pageIndex = 0;
  dataTotal: any;
  displayCheckbox = false;
  isShowMes = true;
  @Output() eventDelete = new EventEmitter();
  @Output() eventUpsert = new EventEmitter();
  @Output() eventData = new EventEmitter();
  count = 0;
  isUpsert: boolean = true;
  oldData: any[] = [];
  isClickRow = false;
  constructor(
    private servive: ApiService,
    private changeDetectorRefs: ChangeDetectorRef,
    private dataService: DataService
  ) {}
  ngOnInit(): void {
    this.condition = {};
    this.condition.limit = this.pageSize;
    if (this.option.isList) this.condition.limit = 10000;
    if(this.option.showActive==undefined)this.option.showActive= true;
    // console.log('this.option.isClickRow',this.option.isClickRow, this.option.url)
    if (this.option.isClickRow == undefined) {
      this.option.isClickRow = true;
      this.isClickRow = true;
    }
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    // this.getData();
    if (this.option.displayCheckbox)
      this.displayCheckbox = this.option.displayCheckbox;
    this.getData();
    this.dataService.currentMessage.subscribe((e: any) => {
      if (
        e.status == Status.Add ||
        e.status == Status.Refesh ||
        e.status == Status.Upsert
      ) {
        let search: any = {};
        delete e.status;
        if (e.value && this.searchColumns.length > 0) {
          for (let i = 0; i < this.searchColumns.length; i++) {
            search[this.searchColumns[i]] = e.value;
          }
        } else {
          search = e;
        }
        if (Object.keys(e).length > 0) this.condition = { search };
        this.getData();
      }
      if (e.status == Status.Search) {
        //console.log(e)
        if (e?.value) {
          this.dataSource.data = this.adfilter(this.oldData, e.value);
        } else {
          delete e.status;
          const url1 = e.url ? e.url : '';
          delete e.url;
          if (Object.keys(e).length > 0) this.condition = { search: e };
          this.getData(url1);
        }
      }

      if (e.status != Status.Refesh) {
        this.scrollTop();
      }
    });
  }
  addFilterData(e: any) {}
  ngOnChanges(changes: SimpleChanges): void {
    const ox = changes['filters']?.currentValue;
    if (ox) {
      const url = ox.url;
      delete ox.url;
      this.condition = { search: ox };
      this.getData(url);
    }
  }
  adfilter(data: any, searchTerm: any) {
    return data.filter((freight: any) => {
      let search = `${searchTerm}`.removeAccents();
      var values = Object.values(freight).filter((x) => x != null);
      var flag = false;
      values.forEach((val: any) => {
        if (`${val}`.removeAccents().indexOf(search) > -1) {
          flag = true;
          return;
        }
      });
      if (flag) return freight;
    });
  }
  onUpdates() {
    const data = Array.from(this.selection.selected).map((x) => {
      delete x.no;
      return x;
    });
    this.eventUpsert.emit({ values: data });
  }
  async onbulkDelete() {
    const url = this.option.url;
    const ids = Array.from(this.selection.selected).map((x) => x['id']);
    await this.servive.bulkDelete(url, ids);
    this.dataService.sendMessage({ status: Status.Refesh });
  }
  async displayDetails() {
    await delay(300);
    const array = document.querySelectorAll('tr.ad-detail-row');

    if (array.length > 0) {
      array.forEach((item: any) => {
        item.style.opacity = '1';
        item.style.display = 'contents';
      });
    }
  }
  async initData(data: any[]) {
    const array = data;
    this.dataTotal = array;
    let ar1 = !this.option.displayedColumnsChild
      ? array.map((x, index) => {
          x['no'] = index + 1 + this.pageIndex * this.pageSize;
          return x;
        })
      : array;
    this.dataSource = new MatTableDataSource<any>(ar1);
    this.displayedColumns =
      this.option.displayedColumns.length > 0
        ? ['no', ...this.option.displayedColumns]
        : ['name', 'weight', 'symbol', 'position'];
    this.displayedColumnsWithExpand = [...this.displayedColumns];
    if (this.option?.displayedColumnsChild) {
      const dt = new GroupITable(array, this.displayedColumns);
      //this.dataSource.data = new Array();
      // this.dataSource = new MatTableDataSource<any>(dt.customData);
      this.dataSource.data = dt.customData;
      //console.log('count: ',dt.customData?.length)
      //this.dataSource.connect().next(dt.customData);
      if (this.displayedColumnsWithExpand.filter((x) => x !== 'expand'))
        this.displayedColumnsWithExpand.push('expand');
      this.option.displayedColumnsChild = this.option.displayedColumnsChild;
      if (!this.option.displayedColumnsChild.find((x: any) => x == 'no')) {
        this.option.displayedColumnsChild.unshift('no');
      }
    }

    if (!this.displayedColumns.find((x: any) => x == 'no')) {
      this.displayedColumns.unshift('no');
    }
    await this.displayDetails();
    //this.table.renderRows()

    this.changeDetectorRefs.detectChanges();
  }
  getData(url = '') {
    // console.log(this.option.url)
    let condition = this.condition ? this.condition : this.option?.condition;
    this.servive
      .get(!url ? this.option.url : url, condition)
      .then(async (e: any) => {
        this.isShowMes = e.count == 0;
        if (e.count > 0) {
          this.resultsLength = e.count;
          let array =
            this.option.isList == true
              ? Array.from(e.items).filter((x: any) => {
                  if (x?.active) {
                    return x.active == true;
                  } else {
                    return x;
                  }
                })
              : e.items;
          if (array.length == 0) {
            this.isShowMes = true;
          }
          if(this.option.showActive==false)array = Array.from(array).filter((x:any)=>x.active==true)
      
          this.eventData.emit(array);
          await this.initData(array);
          this.oldData = array;
        }
      });
  }
  scrollTop() {
    setTimeout(() => {
      var element = document.getElementById('scrollTop');
      if (element) {
        element.scrollTo({ top: element.scrollHeight, behavior: 'instant' });
      }
    }, 200);
  }
  changeTable(data: any) {}
  getServerData(event: any) {
    this.pageIndex = event.pageIndex;
    this.condition.offset = event.pageIndex;
    this.condition.limit = event.pageSize;
    this.getData();
  }
  //========================================================================
  ngAfterViewInit() {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
    this.changeDetectorRefs.detectChanges();
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.position + 1
    }`;
  }
  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer?.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer?.announce('Sorting cleared');
    }
  }
  eventChecked() {
    const selected = this.selection.selected.filter(
      (x: any) => x['details'] == null
    );
    this.onEmit(selected, true);
    this.isUpsert = selected.length == 0;
  }
  onEmit(item: any, isSelected = false) {
    if (!Array.isArray(item)) item = [item];
    let ob: any = {};
    if (this.isClickRow) {
      ob.isSekected = isSelected;
      ob.values = item;
      this.eventUpsert.emit(ob);
    } else {
      this.eventUpsert.emit(item);
    }
  }
  onRowClick(item: any, event: any, index: any) {
    this.onEmit(item);
    if (this.option.isClickRow) {
      event.preventDefault();
    } else {
      const rows = document.querySelectorAll('.mat-mdc-row');
      rows.forEach((e: any) => e.classList.remove('active'));
      (event.target as HTMLElement)
        .closest('.mat-mdc-row')
        ?.classList.add('active');
      this.selection.setSelection(item);
    }
  }
  onChangeSlide(event: any, element: any) {
    delete element.no;
    element['active'] = event.checked;
    this.servive.update(this.option.url, element);
  }
}
