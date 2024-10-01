import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule, MatIconButton } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";

@Component({
  selector: "app-discount",
  templateUrl: "./discount.component.html",
  styleUrls: ["./discount.component.scss"],
  standalone: true,
  imports: [
    MatInputModule,
    MatIconModule,
    MatButtonToggleModule,
    FormsModule,
    CommonModule,
    MatFormFieldModule,
    MatButtonModule,
  ],
})
export class DiscountComponent {
  value: any=0;
  keySelect: any ='vnd';
  @Output() outPut = new EventEmitter();
  @Input() required = false;
  ngOnInit() {
    this.onData();
  }
  onChange(event: any) {
    this.keySelect = event.value;
    this.onData();
  }
  onData() {
    const t = {
      key: this.keySelect ,
      value: this.value || 0,
    };
    this.outPut.emit(t);
  }
  keyPress(event: Event) {
    this.onData();
    event.stopPropagation();
  }
}
