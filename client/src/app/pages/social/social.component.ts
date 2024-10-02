import { Component } from '@angular/core';

@Component({
  selector: 'app-social',
  templateUrl: './social.component.html',
  styleUrl: './social.component.scss'
})
export class SocialComponent {
  optionsTable: any = {
    url: 'social',
    displayedColumns: [
      'userName',
      'password',
      'idfb',
      'cookies',
      'proxy',
      'active',
    ],
    isShowBt: true,
    displayCheckbox:true
  };
}
