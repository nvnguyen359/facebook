import { AsyncPipe, NgIf } from '@angular/common';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  forwardRef,
  HostBinding,
  Input,
  Output,
  VERSION,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { environment } from 'src/app/environment';
import { BaseApiUrl } from 'src/app/general';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'ad-upload',
  standalone: true,
  imports: [
    FormsModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
    MatIconModule,
    MatRippleModule,
    NgIf,
    MatTooltipModule,
    MatButtonModule,
  ],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UploadComponent),
      multi: true,
    },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class UploadComponent implements ControlValueAccessor {
  percentDone: number | undefined;
  uploadSuccess: boolean | undefined;
urlUpload=''
  constructor(private service: ApiService, private http: HttpClient) {
    this.urlUpload=environment.baseUrl+'/upload'
  }

  @Output() output = new EventEmitter();
  @Input() option = {
    icon: 'folder',
    url: '',
  };
  @HostBinding('attr.id')
  externalId: any = '';
  control = new FormControl();
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
  fileName = '';
  onChangeFile(event: any) {
    const files = event.target.files;
    this.upload(files);
    this.value = files;
    this.writeValue(this.value);
    console.log(this.control.value);
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
      // console.log(value);
      //this.value = value;
      this.control.setValue(value);
      this.output.emit(value);
    }
  }

  version = VERSION;

  upload(files: File[]) {
    //pick from one of the 4 styles of file uploads below
    this.uploadAndProgress(files);
  }

  basicUpload(files: File[]) {
    var formData = new FormData();
    Array.from(files).forEach((f) => formData.append('file', f));
    this.http.post(this.urlUpload, formData).subscribe((event) => {
      console.log('done');
    });
  }

  //this will fail since file.io dosen't accept this type of upload
  //but it is still possible to upload a file with this style
  basicUploadSingle(file: File) {
    this.http.post(this.urlUpload, file).subscribe((event) => {
      console.log('done');
    });
  }

  uploadAndProgress(files: File[]) {
    console.log(files);
    var formData = new FormData();
    Array.from(files).forEach((f) => formData.append('file', f));

    this.http
      .post(this.urlUpload, formData, {
        reportProgress: true,
        observe: 'events',
      })
      .subscribe((event: any) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.percentDone = Math.round((100 * event.loaded) / event.total);
        } else if (event instanceof HttpResponse) {
          this.uploadSuccess = true;
        }
      });
  }

  //this will fail since file.io dosen't accept this type of upload
  //but it is still possible to upload a file with this style
  uploadAndProgressSingle(file: File) {
    this.http
      .post(this.urlUpload, file, {
        reportProgress: true,
        observe: 'events',
      })
      .subscribe((event: any) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.percentDone = Math.round((100 * event.loaded) / event.total);
        } else if (event instanceof HttpResponse) {
          this.uploadSuccess = true;
        }
      });
  }
}
