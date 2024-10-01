import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
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
  ],

  templateUrl: './ad-table.component.html',
  styleUrl: './ad-table.component.scss',
})
/**data */
export class AdTableComponent {
  @Input() data: any[] = [];
  @Input() option: any;
  @Input() condition: any;
  dataSource: any = new MatTableDataSource<any>([]);
  displayedColumns: string[] = [];
  displayedColumnsWithExpand: string[] = [];

  expandedElement: any | null | undefined;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort | undefined;
  // @ViewChild(MatTable, { static: false }) table!: MatTable<any>;
  @ViewChild('table', { read: ViewContainerRef }) table!: ViewContainerRef;
  private _liveAnnouncer: LiveAnnouncer | undefined;
  pageSizes = pageSizeOptions;
  //*==============
  resultsLength = 100;
  pageSize = 10;
  dataTotal: any;
  @Output() eventDelete = new EventEmitter();
  @Output() eventUpsert = new EventEmitter();
  count = 0;
  constructor(
    private servive: ApiService,
    private changeDetectorRefs: ChangeDetectorRef,
    private dataService: DataService,
  ) {
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    // this.getData();

    this.getData();
    this.dataService.currentMessage.subscribe((e: any) => {
      if (e.status == Status.Add) {
        delete e.status;
        this.condition = {};
        this.condition = { search: e };
        this.getData();
      }
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    // this.condition = {
    //   search: { ieGoods: changes['condition']['currentValue'] },
    // };
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
    const array = data?.length > 0 ? data : ELEMENT_DATA;
    this.dataTotal = array;
    let ar1 = !this.option.displayedColumnsChild
      ? array.map((x, index) => {
          x['no'] = index + 1;
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
  getData() {
    const condition = this.condition ? this.condition : this.option?.condition;
    this.servive.get(this.option.url, condition).then(async (e: any) => {
      if (e.count > 0) {
        this.resultsLength = e.count;
        await this.initData(e.items);
      }
    });
  }
  changeTable(data: any) {}
  getServerData(event: any) {}
  //========================================================================
  ngAfterViewInit() {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }
  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer?.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer?.announce('Sorting cleared');
    }
  }
  onRowClick(item: any, event: any, index: any) {
    this.eventUpsert.emit(item);
    const rows = document.querySelectorAll('.mat-mdc-row');
    rows.forEach((e: any) => e.classList.remove('active'));
    (event.target as HTMLElement)
      .closest('.mat-mdc-row')
      ?.classList.add('active');
    event.preventDefault();
    //event.stopPropagation();
  }
}

//#region  vi du data
const ELEMENT_DATA: any[] = [
  {
    position: 1,
    name: 'Hydrogen',
    weight: 1.0079,
    symbol: 'H',
    description: `Hydrogen is a chemical element with symbol H and atomic number 1. With a standard
        atomic weight of 1.008, hydrogen is the lightest element on the periodic table.`,
  },
  {
    position: 2,
    name: 'Helium',
    weight: 4.0026,
    symbol: 'He',
    description: `Helium is a chemical element with symbol He and atomic number 2. It is a
        colorless, odorless, tasteless, non-toxic, inert, monatomic gas, the first in the noble gas
        group in the periodic table. Its boiling point is the lowest among all the elements.`,
  },
  {
    position: 3,
    name: 'Lithium',
    weight: 6.941,
    symbol: 'Li',
    description: `Lithium is a chemical element with symbol Li and atomic number 3. It is a soft,
        silvery-white alkali metal. Under standard conditions, it is the lightest metal and the
        lightest solid element.`,
  },
  {
    position: 4,
    name: 'Beryllium',
    weight: 9.0122,
    symbol: 'Be',
    description: `Beryllium is a chemical element with symbol Be and atomic number 4. It is a
        relatively rare element in the universe, usually occurring as a product of the spallation of
        larger atomic nuclei that have collided with cosmic rays.`,
  },
  {
    position: 5,
    name: 'Boron',
    weight: 10.811,
    symbol: 'B',
    description: `Boron is a chemical element with symbol B and atomic number 5. Produced entirely
        by cosmic ray spallation and supernovae and not by stellar nucleosynthesis, it is a
        low-abundance element in the Solar system and in the Earth's crust.`,
  },
  {
    position: 6,
    name: 'Carbon',
    weight: 12.0107,
    symbol: 'C',
    description: `Carbon is a chemical element with symbol C and atomic number 6. It is nonmetallic
        and tetravalent—making four electrons available to form covalent chemical bonds. It belongs
        to group 14 of the periodic table.`,
  },
  {
    position: 7,
    name: 'Nitrogen',
    weight: 14.0067,
    symbol: 'N',
    description: `Nitrogen is a chemical element with symbol N and atomic number 7. It was first
        discovered and isolated by Scottish physician Daniel Rutherford in 1772.`,
  },
  {
    position: 8,
    name: 'Oxygen',
    weight: 15.9994,
    symbol: 'O',
    description: `Oxygen is a chemical element with symbol O and atomic number 8. It is a member of
         the chalcogen group on the periodic table, a highly reactive nonmetal, and an oxidizing
         agent that readily forms oxides with most elements as well as with other compounds.`,
  },
  {
    position: 9,
    name: 'Fluorine',
    weight: 18.9984,
    symbol: 'F',
    description: `Fluorine is a chemical element with symbol F and atomic number 9. It is the
        lightest halogen and exists as a highly toxic pale yellow diatomic gas at standard
        conditions.`,
  },
  {
    position: 10,
    name: 'Neon',
    weight: 20.1797,
    symbol: 'Ne',
    description: `Neon is a chemical element with symbol Ne and atomic number 10. It is a noble gas.
        Neon is a colorless, odorless, inert monatomic gas under standard conditions, with about
        two-thirds the density of air.`,
  },
];
//#endregion
