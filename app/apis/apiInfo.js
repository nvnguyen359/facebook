const excelJS = require("exceljs");
const { posPrintThermal, posPrinter } = require("../shares/posPrinter");
const { CRUDKNEX } = require("../features/crudKnex");
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const lib = require("../shares/lib");

const { SerialPort } = require("serialport");
const {
  app,
  BrowserWindow,
  ipcMain,
  ipcRenderer,
  nativeImage,
  Tray,
  Menu,
  clipboard,
} = require("electron");
require("dotenv").config();
const electron = require("electron");
//const { print, getDefaultPrinter, getPrinters } = require("pdf-to-printer");
const pf = require("pdf-to-printer");
const getListPrinter = (app) => {
  app.get(`/api/printers`, async (req, res, next) => {
    res.send({
      printers: await pf.getPrinters(),
      default: await pf.getDefaultPrinter(),
    });
    next();
  });
};
const thermalPrinter = (app) => {
  app.post(`/api/printers`, async (req, res, next) => {
    //await  setThermal()
    const order = req.body;
    const result = await posPrintThermal(order);
    res.send(result);
    next();
  });
};
let demMax = 0;
const getEventWindow = (app) => {
  app.get(`/api/window/:id`, async (req, res, next) => {
    let data = "";
    const v = req.params.id;
    const w = electron.BrowserWindow.getFocusedWindow();
    switch (v) {
      case "close":
        electron.app.exit();
        break;
      case "max":
        {
          demMax++;
          if (demMax % 2 == 0) {
            w.unmaximize();
          } else {
            w.maximize();
          }
          data = "done";
        }
        break;
      case "min":
        w.hide();
        let icon = nativeImage.createFromPath("./img/electron.png");
        let tray = new Tray(icon);

        const contextMenu = Menu.buildFromTemplate([
          {
            label: "Open",
            click: () => {
              w.show();
              tray.destroy();
            },
          },
          {
            label: "Close",
            click: () => {
              electron.app.exit();
            },
          },
          // { label: "Item3", click: handleClick, checked: true },
          // { label: "Item4", click: handleClick },
        ]);
        tray.setToolTip("Menu");
        tray.setContextMenu(contextMenu);
        data = "done";
        break;

      default:
        data = process.env.ver;
        break;
    }
    res.send({ data });
    next();
  });
};
const getComs = (app) => {
  app.get(`/api/ports`, async (req, res, next) => {
    res.send(await SerialPort.list());
    next();
  });
};
const configSerial = (app) => {
  app.post(`/api/ports`, async (req, res, next) => {
    const body = req.body;
    const serialPort = new SerialPort({
      path: body.port,
      baudRate: body.baudRate,
    });
    res.send(await SerialPort.list());
    next();
  });
};
const fileBill = async (app) => {
  app.get(`/api/bill`, async (req, res, next) => {
    const body = req.body;
    console.log(body);
    try {
      fs.readFile(
        path.join(__dirname, "/phieucan.html"),
        { encoding: "utf8" },
        async (err, data) => {
          res.send({ data });
          return res.end();
        }
      );
    } catch (err) {
      res.send({ err });
    }

    //next();
  });
};
const printBill = async (app) => {
  app.put(`/api/bill`, async (req, res, next) => {
    const body = req.body;
    // console.log(body);
    try {
      fs.readFile(
        path.join(__dirname, "/phieucan.html"),
        { encoding: "utf8" },
        async (err, data) => {
          // body.isPreview,body.printerName,body.pageSize,body.data,body.rawHtml
          res.send({ data: await posPrintThermal(body) });
          return res.end();
        }
      );
    } catch (err) {
      res.send(err);
    }

    //next();
  });
};
const printerHtml = async (app) => {
  app.put(`/api/print-html`, async (req, res, next) => {
    const { printerName, rawHtml, pageSize } = req.body;
    await posPrinter({ printerName, rawHtml, pageSize });
    res.send({ data: "Đã in xong!" });
    return res.end();
  });
};
const downloadExcel = async (app) => {
  app.get(`/api/downloadExcel`, async (req, res, next) => {
    const body = req.body;
    let crud = new CRUDKNEX("weighStation");
    const data = await crud.findAll();
    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet("weighStation");

    // Define columns in the worksheet
    //worksheet.columns = [{ header: "Biển Số Xe", key: "carNumber", width: 15 }];
    // Define columns in the worksheet
    worksheet.columns = [
      { header: "First Name", key: "fname", width: 15 },
      { header: "Last Name", key: "lname", width: 15 },
      { header: "Email", key: "email", width: 25 },
      { header: "Gender", key: "gender", width: 10 },
    ];

    // Add data to the worksheet
    data.items.forEach((user) => {
      // console.log(user)
      worksheet.addRow(user);
    });
    const fileName = `ReportDate${new Date().toLocaleDateString()}.xlsx`;
    // Set up the response headers
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=" + fileName);

    // Write the workbook to the response object
    workbook.xlsx.write(res).then(() => res.end());
    // res.send({ data });
    // return res.end();
  });
};

const allApisPrinter = async (app) => {
  getListPrinter(app);
  thermalPrinter(app);
  getEventWindow(app);
  getComs(app);
  configSerial(app);
  await fileBill(app);
  await printBill(app);
  await downloadExcel(app);
  await printerHtml(app);
};
module.exports = { getListPrinter, thermalPrinter, allApisPrinter, getComs };
