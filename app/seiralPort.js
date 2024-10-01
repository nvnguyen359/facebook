const { SerialPort } = require('serialport')

class CommunicationPort {
  constructor(port = "COM2", baudRate = 9600) {
    this.port = port;
    this.baudRate = baudRate;
    this.serialPort = new SerialPort( {path:this.port,
      baudRate: this.baudRate,
      autoOpen: false,
    });
  }
  setSerialPost() {
    this.serialPort = new SerialPort(this.port, {
      baudRate: this.baudRate,
    });
  }
  async portClose() {
    return new Promise((res, rej) => {
      this.serialPort.close();
      res({data:'Cổng Đã Đóng'})
    });
  }
  async getPorts() {
    return new Promise((res, rej) => {
      res(SerialPort.list());
    });
  }
  sendData(ioSocket, keyEmit = "message") {
    this.serialPort.open((err) => {
      if (err) {
        ioSocket.emit(keyEmit, { err, data: 0 });
      } else {
        this.serialPort.on("data", function (data) {
          ioSocket.emit(keyEmit, { err: 0, data: data.toString("utf8") });
        });
      }
    });
    this.serialPort.on("error", function (err) {
      ioSocket.emit(keyEmit, { err: err.message, data: 0 });
    });
  }
  async writeData() {
    return new Promise((res, rej) => {
      this.serialPort = new SerialPort(this.port, {
        baudRate: this.baudRate,
      });
      this.serialPort.on("open", function () {
        // console.log("-- Connection opened --", this.serialPort.get);
        this.serialPort.on("data", function (data) {
          console.log("Data received: " + data);
          res(data);
        });
      });
    });
  }
  async readData() {
    return new Promise((res, rej) => {
      const sr = (this.serialPort = new SerialPort(this.port, {
        baudRate: this.baudRate,
      }));
      sr.on("data", function (data) {
        res(data);
      });
    });
  }
}
module.exports = CommunicationPort;
