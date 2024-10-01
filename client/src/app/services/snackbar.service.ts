import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  constructor(private _snackBar: MatSnackBar) {}

  openSnackBar(message: string, time: number = 3) {
    const duration = time * 1000;
    this._snackBar.open(message, "OK", {
      duration,
    });
  }
}
