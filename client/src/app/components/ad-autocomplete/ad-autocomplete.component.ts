import { AsyncPipe, NgIf } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  forwardRef,
  HostBinding,
  Input,
  input,
  Optional,
  Output,
  Self,
} from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  FormControl,
  FormControlName,
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  NgControl,
  FormGroup,
  FormBuilder,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { Observable, startWith, map } from 'rxjs';
import { delay } from 'src/app/general';
declare var removeAccents: any;
@Component({
  selector: 'ad-autocomplete',
  standalone: true,
  imports: [
    FormsModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
    MatIconModule,
    MatRippleModule,
    NgIf,
  ],
  templateUrl: './ad-autocomplete.component.html',
  styleUrl: './ad-autocomplete.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AdAutocompleteComponent),
      multi: true,
    },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AdAutocompleteComponent implements ControlValueAccessor {
  @Output() onSelection = new EventEmitter();
  @HostBinding('attr.id')
  externalId: any = '';

  @Input()
  set id(value: string) {
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
    delay(100).then(() => this.showlab(value));
  }

  hidex = false;
  control = new FormControl('');
  filteredStreets: Observable<any[]> | undefined;
  @Input() options = {
    placeholder: 'placeholder',
    display: 'name',
    default: '',
    required: false,
    data: new Array(),
    label: 'label',
    type: 'text',
  };
  @Input() data: any[] = [];
  array: any[] = [];
  constructor() {}
  async ngOnInit() {
    this.id = `id-${Math.floor(Math.random() * 100000) + 1}`;
    if (this.data?.length > 0) this.array = this.data;
    if (this.options.data?.length > 0) this.array = this.options.data;
   // if (this.array.length < 1) this.array = this.streets;
    this.filteredStreets = this.control.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || ''))
    );
    await delay(300);
    const input = document.getElementById(this.id);
    if (input) {
      input.addEventListener('click', () => {
        this.showlab(input.textContent);
      });
    }
  }

  private _filter(value: string): string[] {
    const filterValue = this._normalizeValue(value);
    return this.array.filter((street) =>
      this._normalizeValue(street[this.options.display]).includes(filterValue)
    );
  }

  private _normalizeValue(value: string): string {
    return removeAccents(value).toLowerCase().replace(/\s/g, '');
  }
  async showlab(value: any) {
    let labels = document.querySelector(`#${this.id} ~ label`);
    if (labels) {
      if (value != '') {
        labels?.classList.add('op');
      } else {
        labels?.classList.remove('op');
      }
    }
  }
  onEventInput() {
    const value = this.control.value;
    this.hidex = value != '';
    this.writeValue(value);
    this.showlab(value);
  }
  onSelectionx(item: any) {
    this.hidex = item[this.options.display] != '';
    this.writeValue('');
    this.writeValue(item[this.options.display]);
    this.onSelection.emit(item);
    this.showlab(item[this.options.display]);
  }
  onClose() {
    this.control.patchValue('');
    this.hidex = false;
    this.value = '';
    //  this.writeValue(this.control.value);
    this.showlab(this.value);
  }
}
