import { ChangeDetectorRef, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { fields } from 'src/app/general';
import { Fields } from 'src/app/Models/field';

@Component({
  selector: 'app-report-article',
  templateUrl: './report-article.component.html',
  styleUrl: './report-article.component.scss',
})
export class ReportArticleComponent {
  url = 'reportSocial';
  optionsTable: any = {
    url: this.url,
    displayedColumns: ['nameGroup', 'title', 'count','status', 'createdAt', 'updatedAt'],
    isShowBt: false,
    displayCheckbox: false,
  };
  fieldFilter: any;
  constructor(
  ) {
    this.fieldFilter = (fields() as Fields[])
      .filter((x: any) => this.optionsTable.displayedColumns.includes(x.field))
      .map((x: Fields) => {
        if (x.field == 'updatedAt' || x.field == 'createdAt') {
          x.show = false;
        } else {
          x.show = true;
        }
        return x;
      });
  }
}
