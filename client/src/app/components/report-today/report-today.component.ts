import { Component } from '@angular/core';
import { radioGroup } from 'src/app/general';
import { ImportsModule } from 'src/app/imports';

@Component({
  selector: 'ad-report-today',
  standalone: true,
  imports: [ImportsModule],
  templateUrl: './report-today.component.html',
  styleUrl: './report-today.component.scss'
})
export class ReportTodayComponent {
  //radioGroups = radioGroup;
  constructor(){
    console.log(radioGroup)
  }
}
