import { CommonModule } from "@angular/common";
import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  NO_ERRORS_SCHEMA,
} from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { AutocompleteComponent } from "../autocomplete/autocomplete.component";
import { ApiService } from "src/app/services/api.service";
import { BaseApiUrl } from "src/app/general";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { ImportsModule } from "src/app/imports";
@Component({
  selector: "app-printers",
  templateUrl: "./printers.component.html",
  styleUrls: ["./printers.component.scss"],
  standalone: true,
  imports: [
    ImportsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class PrintersComponent {
  key = "print";
  array: any[] = [];
  choise = "Máy In Nhiệt";
  isPreview = false;
  isThermal: boolean = true;
  isPay = false;
  pageSizes = [
    {
      key: "A4",
      value: "210mm",
    },
    {
      key: "A5",
      value: "148mm",
    },
    {
      key: "A6",
      value: "105mm",
    },
    {
      key: "A7",
      value: "74mm",
    },
    {
      key: "In Nhiệt",
      value: "80mm",
    },
  ];
  selected: any = {};
  printDefault: any = {};
  pageDefault: any = {};
  constructor(private service: ApiService) {}
  ngOnInit() {
    this.service.get(BaseApiUrl.Printers).then((data: any) => {
      this.array = data.printers as any[];
      let check = JSON.parse(`${localStorage.getItem(this.key)}`);
      const printerDefault = data.default;
      if (!check) {
        this.printDefault = data.printers.find(
          (x: any) => x.name == printerDefault.name
        );
        this.pageDefault = this.pageSizes[1];
        this.selected.printer = this.printDefault;
        this.selected.page = this.pageSizes[1];
        this.selected.isThermal = this.isThermal;
        this.selected.isPreview = this.isPreview;
        this.selected.isPay = this.isPay;
        localStorage.setItem(this.key, JSON.stringify(this.selected));
      } else {
        this.printDefault = this.array.find(
          (x: any) => x.name == check?.printer.name
        );
        this.pageDefault = this.pageSizes.find(
          (x: any) => x.key == check?.page.key
        );
        this.isThermal = check.isThermal;
        this.isPreview = check.isPreview;
        this.isPay = check.isPay;
      }
      this.doiText();
    });
  }
  onSelected(event: any = null, type: any) {
    if (!event) return;
    const name = event.value;
    let check = JSON.parse(`${localStorage.getItem(this.key)}`);
    if (type == "page") {
      this.selected.page = name;
      this.selected.printer = check.printer;
    } else {
      this.selected.printer = name;
      this.selected.page = check.page;
    }
    this.selected.isThermal = this.isThermal;
    if (parseInt(this.selected.page.value.replace("mm", "")) < 81) {
      this.selected.isThermal = true;
      this.isThermal = true;
      this.doiText();
    }
    this.selected.isPreview = this.isPreview;
    localStorage.setItem(this.key, JSON.stringify(this.selected));
  }
  doiText() {
    this.choise = !this.isThermal ? "In Trên Trình Duyệt" : "Máy In Nhiệt";
  }
  onChange(event: any) {
    this.doiText();
    this.selected = JSON.parse(`${localStorage.getItem(this.key)}`);
    this.selected.isThermal = this.isThermal;
    localStorage.setItem(this.key, JSON.stringify(this.selected));
  }
  checkPreview(event: any) {
    this.selected = JSON.parse(`${localStorage.getItem(this.key)}`);
    this.selected.isPreview = event.checked;
    localStorage.setItem(this.key, JSON.stringify(this.selected));
  }
  checkQrPay(event: any) {
    this.selected = JSON.parse(`${localStorage.getItem(this.key)}`);
    this.selected.isPay = event.checked;
    localStorage.setItem(this.key, JSON.stringify(this.selected));
  }
}
