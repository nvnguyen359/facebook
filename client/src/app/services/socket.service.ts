import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs/operators';
const mes = 'message';
@Injectable({
  providedIn: 'root',
})
export class SocketService {
  constructor(private socket: Socket) {}
  /**
   *
   * @param msg thông tin cần gửi
   * @param mes1 key
   */
  async sendMessage(msg: any, mes1 = '') {
    if (mes1 == '') mes1 = mes;
    // console.log(mes1,msg)
    this.socket.emit(mes1, msg);
  }
  /**
   *
   * @param msg thông tin cần gửi
   * @param eventName
   */
  async sendData(eventName: any = '', data: any) {
    if (eventName == '') eventName = mes;
    // console.log(mes1,msg)
    this.socket.emit(eventName, data);
  }
  async getMessage(mes1 = '', outData: any) {
    if (mes1 == '') mes1 = mes;
    return new Promise((res: any, rej: any) => {
      this.socket.on(mes1, (data: any) => {
        //console.log(data);
        outData(data);
        return data;
      });
    });
  }
}
