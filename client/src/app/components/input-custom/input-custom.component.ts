import {
  Component,
  EventEmitter,
  Input,
  input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-input-custom',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './input-custom.component.html',
  styleUrl: './input-custom.component.scss',
})
export class InputCustomComponent {
  @Input() obj = {
    type: 'text',
    value: '',
    lable: 'TL Cân Lần 1:',
    require: false,
  };
  @Output() outputValue = new EventEmitter();
  onClickClear() {
    this.obj.value = '';
  }
  keyup() {
    this.outputValue.emit(this.obj);
  }
  focus(){
    
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.outputValue.emit(this.obj);
  }
}
