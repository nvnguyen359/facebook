import { Injectable } from '@angular/core';
import { FormControlDirective, FormGroup } from '@angular/forms';
@Injectable({
  providedIn: 'root',
})
export class AD_Form {
  private _form: any;

  public set setForm(f: any) {
    if (!this._form) this._form = f;
  }
  setValues(obj:any){
    this._form.setValue(obj)
  }
  setPathValues(obj:any){
    this._form.patchValue(obj);
  }
  getValue(name: string) {
    return this._form.controls[name].value;
  }
  setValue(name: string, value: any) {
    this._form.controls[name].setValue(value);
  }
}
