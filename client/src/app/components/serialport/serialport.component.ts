import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { delay, getItem, setItem } from 'src/app/general';
import { ImportsModule } from 'src/app/imports';
import { ApiService } from 'src/app/services/api.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-serialport',
  standalone: true,
  imports: [ImportsModule],
  templateUrl: './serialport.component.html',
  styleUrl: './serialport.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SerialportComponent {
  constructor(
    private service: ApiService,
    private socket: Socket,
    private socketService: SocketService
  ) {}
  data: any = [];
  receiveData: any = null;
  showProgress = false;
  ngModel = { modelPort: '', modelBaud: 9600 };
  baudRates: any = [
    110, 300, 600, 1200, 2400, 4800, 9600, 14400, 19200, 38400, 57600, 115200,
    128000, 256000,
  ];
  keyLocal = 'serial';
  async ngOnInit() {
    this.service.get('ports').then((e: any) => {
      this.data = e;
    });
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    await this.getPorts();
    if (!getItem(this.keyLocal)) return;
    const t = JSON.parse(getItem(this.keyLocal));
    if (t && t.modelPort) {
      this.ngModel.modelBaud = t.modelBaud;
      this.ngModel.modelPort = t.modelPort;
    }
  }

  async selectionChange() {
    await this.socketService.sendMessage(
      {
        port: this.ngModel.modelPort,
        baudRate: this.ngModel.modelBaud || 9600,
      },
      'changePort'
    );
    setItem(this.keyLocal, JSON.stringify(this.ngModel));
    if (this.socket.disconnect()) this.socket.connect();
  }
  async getPorts() {
    this.socket.on('message', async (response: any) => {
      this.receiveData = {
        data:
          response.data != 0 ? response.data.match(/(\d+)/)[0] : response.data,
        err: JSON.stringify(response.err),
      };
      //console.log(response);
      this.showProgress = true;
      if (response.data != 0) {
        setItem(this.keyLocal, JSON.stringify(this.ngModel));
        await delay(5000);
        //this.socket.disconnect();
        this.showProgress = false;
      }
    });
  }
}
