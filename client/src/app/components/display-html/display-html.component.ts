import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SafeHtmlPipePipe } from 'src/app/pipes/safe-html-pipe.pipe';

@Component({
  selector: 'app-display-html',
  standalone: true,
  imports: [SafeHtmlPipePipe],
  templateUrl: './display-html.component.html',
  styleUrl: './display-html.component.scss',
 
})
export class DisplayHtmlComponent {
  constructor(
    public dialogRef: MatDialogRef<DisplayHtmlComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any) {
  
    }
    ngOnInit(): void {
      //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
      //Add 'implements OnInit' to the class.
    //  console.log(this.data)
    }
}
