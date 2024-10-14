import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  HostBinding,
  Inject,
  Input,
  signal,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';

@Component({
  selector: 'ad-schedule',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatInputModule,
    NzTimePickerModule,
    MatCheckboxModule,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ScheduleComponent),
      multi: true,
    },
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} }
  ],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleComponent implements ControlValueAccessor {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any){}
  public time: Date = new Date();
  control: any;
  task = signal<any>({
    name: 'Thứ: ',
    completed: false,
    subtasks: [
      { name: '2', completed: false },
      { name: '3', completed: false },
      { name: '4', completed: false },
      { name: '5', completed: false },
      { name: '6', completed: false },
      { name: '7', completed: false },
      { name: 'CN', completed: false },
    ],
  });
  @HostBinding('attr.id')
  externalId: any = '';

  @Input()
  set id(value: any) {
    this._ID = value;
    this.externalId = null;
  }

  get id() {
    return this._ID;
  }

  private _ID = '';

  @Input('value') _value = '';
  onChange: any = () => {};
  onTouched: any = () => {};

  get value() {
    return this._value;
  }

  set value(val) {
    this._value = val;
    this.onChange(val);
    this.onTouched();
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  writeValue(value: any) {
    if (value) {
      this.value = value;
      this.control.setValue(value);
    }
  }
  partiallyComplete = computed(() => {
    const task = this.task();
    if (!task.subtasks) {
      return false;
    }
    return (
      task.subtasks.some((t: any) => t.completed) &&
      !task.subtasks.every((t: any) => t.completed)
    );
  });
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
  }
  disabledHours(): number[] {
    return [1, 2, 3];
  }

  update(completed: boolean, index?: number) {
    this.task.update((task: any) => {
      if (index === undefined) {
        task.completed = completed;
        task.subtasks?.forEach((t: any) => (t.completed = completed));
      } else {
        task.subtasks![index].completed = completed;
        task.completed = task.subtasks?.every((t: any) => t.completed) ?? true;
      }
      this.onClick();
      return { ...task };
    });
  }
  onClick() {
    const task = this.task();
    const t = task.subtasks
      .filter((t: any) => t.completed)
      .map((x: any) => {
        return x['name'] == 'CN' ? '0' : x['name'];
      });
    let text2 =
      t.length == 7
        ? 'Hàng ngày'
        : t
            .map((x: any) => {
              return x == '0' ? 'Chủ Nhật' : 'Thứ ' + x;
            })
            .join(',');
    const result = {
      start: this.time.toLocaleTimeString('vi'),
      task: t,
      text: {
        time:
          'Bắt đầu lúc:' +
          this.time.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
          }),
        date: 'Các ngày:' + text2,
      },
    };
    this.value = JSON.stringify(result);
  }
}
export interface Task {
  name: string;
  completed: boolean;
  subtasks?: Task[];
}
