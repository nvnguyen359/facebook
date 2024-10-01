import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { environment } from './../environment';
import { catchError, retry } from 'rxjs';
import { BaseApiUrl, Status } from '../general';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfirmComponent } from '../Components/dialog-confirm/dialog-confirm.component';
import { DataService } from './data.service';
import { SnackbarService } from './snackbar.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  httpOptions = {
    //
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      responseType: 'blob',
    }),
  };
  qrViet = {
    Client_ID: 'c3503c91-f295-4574-ab2a-206e7f58a334',
    API_Key: '10a474b4-fc88-45ae-9bcd-18316d1ffe23',
  };
  private async handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
      this.snackBar.openSnackBar(`${error.message}`);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      //

      //  this.snackBar.openSnackBar(`${error.message}`);
      console.error(
        `Backend returned code ${error.message}, body was: `,
        error.error
      );
    }
    return error.error;
  }
  baseServer = '';
  hash = location.hash.replace('#/', '');
  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private dataService: DataService,
    private snackBar: SnackbarService
  ) {
    this.baseServer = environment.baseUrl;
  }
  async getBanks() {
    return new Promise(async (res, rej) => {
      this.http.get('https://api.vietqr.io/v2/banks').subscribe((e: any) => {
        res(e);
      });
    });
  }
  async lookupBank(data: any) {
    const headers = {
      'x-client-id': this.qrViet.Client_ID,
      'x-api-key': this.qrViet.API_Key,
      'Content-Type': 'application/json',
    };
    this.httpOptions.headers = new HttpHeaders(headers);
    const pathUrl = `https://api.vietqr.io/v2/lookup`;
    return new Promise((res, rej) => {
      this.http
        .post(pathUrl, data, this.httpOptions)
        .pipe(
          retry(3), // retry a failed request up to 3 times
          catchError(this.handleError)
        )
        .subscribe((data) => {
          return res(data);
        });
    });
  }
  async postPrinters(order: any) {
    if (localStorage.getItem('print')) {
      order.isPay = JSON.parse(localStorage.getItem('print') + '').isPay;
    }
    const pathUrl = `${this.baseServer}/printers`;
    return new Promise((res, rej) => {
      this.http
        .post(pathUrl, order, this.httpOptions)
        .pipe(
          retry(3), // retry a failed request up to 3 times
          catchError(this.handleError)
        )
        .subscribe((e) => {
          res(e);
        });
    });
  }
  async get(url: string, params?: any, name = ''): Promise<any> {
 //  console.log(params)
    let pas = '';
    if (params) {
      const entries = Object.entries(params);
      entries.forEach((x: any) => {
        if (Object.keys(x[1]).length > 0) {
          pas += `${x[0]}=${JSON.stringify(x[1])}&`;
        } else {
          pas += `${x[0]}=${x[1]}&`;
        }
      });
    }
    // console.log(pas);
    const pathUrl = `${this.baseServer}/${url}?${pas}`;
    return new Promise((res, rej) => {
      this.http
        .get(pathUrl, this.httpOptions)
        .pipe(
          retry(3), // retry a failed request up to 3 times
          catchError(this.handleError)
        )
        .subscribe((data: any) => {
          if (Array.isArray(data)) {
            // console.log(data)
            //let dt = !BaseApiUrl.Orders ? Array.from(data) : Array.from(data);
            return res(data);
          } else {
            res(data);
          }
        });
    });
  }
  async findAll(params?: any, name = '', url: string = ''): Promise<any> {
    if (url == '') url = this.hash;
    let pas = '';
    if (params) {
      const entries = Object.entries(params);
      entries.forEach((x: any) => {
        pas += `${x[0]}=${x[1]}&`;
      });
    }

    const pathUrl = `${this.baseServer}/${url}?${pas}`;
    return new Promise((res, rej) => {
      this.http
        .get(pathUrl, this.httpOptions)
        .pipe(
          retry(3), // retry a failed request up to 3 times
          catchError(this.handleError)
        )
        .subscribe((data: any) => {
          if (Array.isArray(data)) {
            // console.log(data)
            //let dt = !BaseApiUrl.Orders ? Array.from(data) : Array.from(data);
            return res(data);
          } else {
            res(data);
          }
        });
    });
  }
  async getId(url: string, id = '') {
    if (url == '') url = this.hash;
    const pathUrl = `${this.baseServer}/${url}/${id}`;

    return new Promise((res, rej) => {
      this.http
        .get(pathUrl, this.httpOptions)
        .pipe(
          retry(3), // retry a failed request up to 3 times
          catchError(this.handleError)
        )
        .subscribe((data) => {
          return res(data);
        });
    });
  }
  async findId(id = '', url: string = '') {
    const pathUrl = `${this.baseServer}/${url}/${id}`;

    return new Promise((res, rej) => {
      this.http
        .get(pathUrl, this.httpOptions)
        .pipe(
          retry(3), // retry a failed request up to 3 times
          catchError(this.handleError)
        )
        .subscribe((data) => {
          return res(data);
        });
    });
  }
  async update(url: string, data: any) {
    const pathUrl = `${this.baseServer}/${url}`;
    return new Promise((res, rej) => {
      this.http
        .put(pathUrl, data, this.httpOptions)
        .pipe(
          retry(3), // retry a failed request up to 3 times
          catchError(this.handleError)
        )
        .subscribe((data) => {
          this.dataService.sendMessage({ status: Status.Refesh });
          const mes = data?.data || 'Đã cập nhật thành công!';
          this.snackBar.openSnackBar(mes);
          return res(data);
        });
    });
  }
  async update1(data: any, url: string = '') {
    if (url == '') url = this.hash;
    const pathUrl = `${this.baseServer}/${url}`;
    return new Promise((res, rej) => {
      this.http
        .put(pathUrl, data, this.httpOptions)
        .pipe(
          retry(3), // retry a failed request up to 3 times
          catchError(this.handleError)
        )
        .subscribe((data) => {
          this.dataService.sendMessage({ status: Status.Refesh });
          this.snackBar.openSnackBar('Đã cập nhật thành công!');
          return res(data);
        });
    });
  }
  async create1(data: any, url: string = '') {
    if (url == '') url = this.hash;
    let req = !Array.isArray(data) ? [data] : data;
    req = Array.from(req).map((x: any) => {
      if (!x.id || x.id == '') x['id'] = null;
      return x;
    });
    const pathUrl = `${this.baseServer}/${url}`;
    return new Promise((res, rej) => {
      this.http
        .post(pathUrl, req, this.httpOptions)
        .pipe(
          retry(3), // retry a failed request up to 3 times
          catchError(this.handleError)
        )
        .subscribe((e) => {
          this.dataService.sendMessage({ status: Status.Refesh });
          this.snackBar.openSnackBar('Đã thêm mới thành công!');
          res(e);
        });
    });
  }
  async create(url: string = '', data: any) {
    let req = !Array.isArray(data) ? [data] : data;
    req = Array.from(req).map((x: any) => {
      if (!x.id || x.id == '') x['id'] = null;
      return x;
    });
    const pathUrl = `${this.baseServer}/${url}`;
    return new Promise((res, rej) => {
      this.http
        .post(pathUrl, req, this.httpOptions)
        .pipe(
          retry(3), // retry a failed request up to 3 times
          catchError(this.handleError)
        )
        .subscribe((e) => {
          this.snackBar.openSnackBar('Đã thêm mới thành công!');
          this.dataService.sendMessage({ status: Status.Refesh });
          res(e);
        });
    });
  }
  async destroy(url: string, id: any, showDialog = true) {
    const pathUrl = `${this.baseServer}/${url}/${id}`;
    if (showDialog) {
      const dialogRef = this.dialog.open(DialogConfirmComponent, {
        data: { header: 'Bạn chắc chắn muốn xóa!' },
      });
      return new Promise((res, rej) => {
        dialogRef.afterClosed().subscribe((result: any) => {
          if (result == true) {
            this.http
              .delete(pathUrl, this.httpOptions)
              .pipe(
                retry(3), // retry a failed request up to 3 times
                catchError(this.handleError)
              )
              .subscribe((e) => {
                this.snackBar.openSnackBar(`Đã xóa thành công! ${id}`);
                this.dataService.sendMessage({ status: Status.Refesh });
                res(e);
              });
          }
          this.dataService.sendMessage({ resultDelete: result });
        });
      });
    } else {
      return new Promise((res, rej) => {
        this.http
          .delete(pathUrl, this.httpOptions)
          .pipe(
            retry(3), // retry a failed request up to 3 times
            catchError(this.handleError)
          )
          .subscribe((e) => {
            this.snackBar.openSnackBar(`Đã xóa thành công! ${id}`);
            this.dataService.sendMessage({ status: Status.Refesh });
            res(e);
          });
      });
    }
  }
  async destroy1(id: any, url: string = '', showDialog = true) {
    if (url == '') url = this.hash;
    const pathUrl = `${this.baseServer}/${url}/${id}`;
    if (showDialog) {
      const dialogRef = this.dialog.open(DialogConfirmComponent, {
        data: { header: 'Bạn chắc chắn muốn xóa!' },
      });
      return new Promise((res, rej) => {
        dialogRef.afterClosed().subscribe((result: any) => {
          if (result == true) {
            this.http
              .delete(pathUrl, this.httpOptions)
              .pipe(
                retry(3), // retry a failed request up to 3 times
                catchError(this.handleError)
              )
              .subscribe((e) => {
                this.snackBar.openSnackBar(`Đã xóa thành công! ${id}`);
                this.dataService.sendMessage({ status: Status.Refesh });
                res(e);
              });
          }
          //  this.dataService.sendMessage({ resultDelete: result });
          this.dataService.sendMessage({ status: Status.Refesh });
        });
      });
    } else {
      return new Promise((res, rej) => {
        this.http
          .delete(pathUrl, this.httpOptions)
          .pipe(
            retry(3), // retry a failed request up to 3 times
            catchError(this.handleError)
          )
          .subscribe((e) => {
            this.dataService.sendMessage({ status: Status.Refesh });
            this.snackBar.openSnackBar(`Đã xóa thành công! ${id}`);
            res(e);
          });
      });
    }
  }
  async bulkDelete(url: string, ids: any, showDialog = true) {
    const pathUrl = `${this.baseServer}/${url}/${ids}`;
    if (showDialog) {
      const dialogRef = this.dialog.open(DialogConfirmComponent, {
        data: { header: 'Bạn chắc chắn muốn xóa!' },
      });
      return new Promise((res, rej) => {
        dialogRef.afterClosed().subscribe((result: any) => {
          if (result == true) {
            this.http
              .delete(pathUrl, this.httpOptions)
              .pipe(
                retry(3), // retry a failed request up to 3 times
                catchError(this.handleError)
              )
              .subscribe((e) => {
                this.snackBar.openSnackBar('Xóa thành cống!');
                res(e);
              });
          }
          // this.dataService.sendMessage({ resultDelete: result });
        });
      });
    } else {
      return new Promise((res, rej) => {
        this.http
          .delete(pathUrl, this.httpOptions)
          .pipe(
            retry(3), // retry a failed request up to 3 times
            catchError(this.handleError)
          )
          .subscribe((e) => {
            this.snackBar.openSnackBar('Xóa thành công');
            res(e);
          });
      });
    }
  }

  dowloadfileTemplate() {
    const url = `${this.baseServer}/download`;
    window.location.href = url;
    this.http
      .get(url, { responseType: 'blob', reportProgress: true })
      .subscribe((e) => {
        console.log(e);
        // window.location.href = url
      });
  }
  async translate(text: any) {
    return new Promise((res, rej) => {
      this.http
        .get(
          ` https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=vi&dt=t&q=${text}`
        )
        .subscribe((e) => {
          const arr = e as any;
          res(arr[0][0][0]);
        });
    });
  }
  async eventWindow(v: string = 'min') {
    const pathUrl = `${this.baseServer}/window/${v}`;
    return new Promise((res, rej) => {
      this.http
        .get(pathUrl, this.httpOptions)
        .pipe(
          retry(3), // retry a failed request up to 3 times
          catchError(this.handleError)
        )
        .subscribe((data) => {
          return res(data);
        });
    });
  }
}
