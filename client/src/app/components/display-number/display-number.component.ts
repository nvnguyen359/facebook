import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ImportsModule } from 'src/app/imports';
import { displayNumber } from 'src/app/Models/disolayNumber';

@Component({
  selector: 'app-display-number',
  standalone: true,
  imports: [ImportsModule],
  templateUrl: './display-number.component.html',
  styleUrl: './display-number.component.scss',
})
export class DisplayNumberComponent {
  @Input() inputObj:displayNumber = {
    label: 'Bàn Cân',
    value: 0,
    time: '',
    tare:'' ,
  };
  tapchats: any = [];
  modelDefault = '5%';
  @Output() eventOutput = new EventEmitter();
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getTapchats();
  }
  getTapchats() {
    for (let i = 0; i < 51; i++) {
      this.tapchats.push(`${i}%`);
    }
  }
  onChange(event: any) {
    this.eventOutput.emit(this.inputObj.tare);
  }
}
