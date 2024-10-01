import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  RequiredValidator,
  Validators,
} from '@angular/forms';
import { InfoStore } from 'src/app/Models/inforStore';
import { BaseApiUrl, getItem, IdsContant, setItem } from 'src/app/general';
import { ApiService } from 'src/app/services/api.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
})
export class SettingComponent {
  form: any = null;
  key = 'company';
  constructor(private fb: FormBuilder,private snackbar:SnackbarService) {}
  async ngOnInit() {
    await this.initForm();
  }
  async initForm() {
    let value = getItem(this.key) ? JSON.parse(getItem(this.key)) : null;
    this.form = this.fb.group({
      name: [value?.name || '', Validators.required],
      phone: [value?.phone || '', Validators.required],
      address: [value?.address || '', Validators.required],
      infoPlus: [value?.infoPlus || ''],
    }) as FormGroup;
  }
  onFocus() {}
  async onSubmit() {
    setItem(this.key, JSON.stringify(this.form.value));
    this.snackbar.openSnackBar('Cập Nhật Thành Công!');
  }
}
