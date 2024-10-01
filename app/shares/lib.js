const { exec } = require("child_process");
const fs = require("fs");
const os = require("os");
Date.prototype.addHours = function (h) {
  this.setTime(this.getTime() + h * 60 * 60 * 1000);
  return this;
};
Date.prototype.addDays = function (d = 0) {
  this.setTime(this.getTime() + 24 * 60 * 60 * 1000 * d);
  return this;
};
Date.prototype.startDay = function () {
  return new Date(this.setHours(0, 0, 0, 0));
};
Date.prototype.endDay = function () {
  return new Date(this.setHours(23, 59, 59, 999));
};


function isEqualObj(obj,obj1) {
  let result = true;
  const objArr = Object.keys(obj);
  const objArr1 = Object.keys(obj1);
  let oTemp = objArr.length >= objArr1 ? objArr : objArr1;
  for (let index = 0; index <= oTemp.length; index++) {
    const key = oTemp[index];
    if (`${objArr[key]}` != `${objArr1[key]}`) {
      result = false;
      return;
    }
  }
  return result;
};
String.prototype.removeAccents = function () {
  return this.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
};
String.prototype.xoaDau = function () {
  return this.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
};

String.prototype.convertStringVNToDateISO = function () {
  const str = this.split("/").map((x) => parseInt(x));
  let thang = str[1] < 10 ? "0" + str[1] : str[1];
  let ngay = str[0] < 10 ? "0" + str[0] : str[0];
  return str[2] + "-" + thang + "-" + ngay;
};

String.prototype.DateFormatDDMMYYY = function () {
  if (new Date(this.toString()).toString() !== "Invalid Date") {
    var timestamp = new Date(this.toString());
    const day =
      timestamp.getDate() < 10
        ? `0${timestamp.getDate()}`
        : timestamp.getDate();
    const m =
      timestamp.getMonth() + 1 < 10
        ? `0${timestamp.getMonth() + 1}`
        : timestamp.getMonth() + 1;
    return day + "/" + m + "/" + timestamp.getFullYear();
  } else {
    return this.toString();
  }
};
const getPrinters = () => {
  return new Promise((res, rej) => {
    exec("wmic printer list brief", (err, stdout, stderr) => {
      if (err) {
        // node couldn't execute the command
        rej(err);
      }
      // list of printers with brief details
      console.log(stdout);
      // the *entire* stdout and stderr (buffered)
      stdout = stdout.split("  ");
      var printers = [];
      j = 0;
      stdout = stdout.filter((item) => item);
      for (i = 0; i < stdout.length; i++) {
        if (stdout[i] == " \r\r\n" || stdout[i] == "\r\r\n") {
          printers[j] = stdout[i + 1];
          j++;
        }
      }
      // list of only printers name

      console.log(stderr);
      res(printers);
    });
  });
};
function delay(delayInms = 1000) {
  return new Promise((resolve) => setTimeout(resolve, delayInms));
}
function createIdRow(id, nameSheet, startId) {
  if (!startId) startId = createFirstId(nameSheet);
  if (!id) {
    id = "0";
  } else {
    if (typeof id == "number") {
      id = `${startId}${id}`;
    }
  }
  const t = "000000";
  id =
    id == "0"
      ? parseInt(`${id}`.split(startId)[0])
      : parseInt(`${id}`.split(startId)[1]);
  const x = parseInt(id) + 1;
  return `${x}`.length < t.length
    ? `${startId}${t.slice(`${x}`.length)}${x}`
    : `${startId}${x}`;
}
function createFirstId(str) {
  s = "";
  Array.from(str.split(" ")).forEach((x) => {
    s += x[0];
  });
  return s.toUpperCase().removeAccents();
}
function createFolder(folderName) {
  try {
    if (!fs.existsSync(folderName)) {
      fs.mkdirSync(folderName);
    }
  } catch (err) {
    console.error(err);
  }
}
function writeFileSync(filePath, data) {
  const arr = filePath.split("/");

  const filename = arr[arr.length - 1];
  const folderName = filePath.replace(filename, "").trim();
  createFolder(folderName);
  try {
    fs.writeFileSync(filePath, data);
    return filePath;
  } catch (error) {
    return error;
  }
}

//moves the $file to $dir2
var moveFile = (file, dir2) => {
  //include the fs, path modules
  var fs = require("fs");
  var path = require("path");

  //gets file name and adds it to dir2
  var f = path.basename(file);
  if (!fs.existsSync(dir2)) {
    fs.mkdirSync(dir2);
  }

  var dest = path.resolve(dir2, f);
  if (fs.existsSync(dest)) {
    return;
  }
  fs.promises.cp(
    file,
    dest,
    {
      recursive: true,
    },
    (err) => {
      if (err) throw err;
      else console.log("Successfully moved");
    }
  );
};
const setEnvValue = (key, value) => {
  // read file from hdd & split if from a linebreak to a array
  const ENV_VARS = fs.readFileSync("./.env", "utf8").split(os.EOL);

  // find the env we want based on the key
  const target = ENV_VARS.indexOf(
    ENV_VARS.find((line) => {
      return line.match(new RegExp(key));
    })
  );

  // replace the key/value with the new value
  ENV_VARS.splice(target, 1, `${key}=${value}`);

  // write everything back to the file system
  fs.writeFileSync("./.env", ENV_VARS.join(os.EOL));
};
const autoScroll = async (page, seconds = null, timerScroll = 500) => {

  console.log('=== start auto scroll! ===');
  let result = async () => {
      return await page.evaluate(async ([seconds, timerScroll]) => {
          const begin = new Date();
          return new Promise(resolve => {
              var totalHeight = 0;
              var distance = 100;
              let count = 1;
              var timer = setInterval(() => {
                  count++;
                  var scrollHeight = document.body.scrollHeight;
                  window.scrollBy(0, distance);
                  totalHeight += distance;
                  const check = totalHeight >= scrollHeight;
                  if (check || seconds != null && count == seconds) {
                      console.log('stop scroll');
                      let end = new Date();
                      const time = Math.round(Math.abs(end - begin) / 60);
                      console.log(`time scroll:${time}s`);
                      clearInterval(timer);
                      resolve(`${end},${begin}`);

                  }
                  if (count > 180 && seconds == null) {
                      console.log('stop scroll');
                      let end = new Date();
                      const time = Math.round(Math.abs(end - begin) / 60);
                      console.log(`time scroll:${time}s`);
                      clearInterval(timer);
                      resolve(`${end},${begin}`);

                  }

                  console.log('scroll page... ', scrollHeight);
              }, timerScroll);

          })
      }, [seconds, timerScroll]);
  }
  return `stop scroll: ${(await result())}`
};

module.exports = {
  getPrinters,
  createIdRow,
  createFolder,
  writeFileSync,
  delay,
  moveFile,
  setEnvValue,
  isEqualObj,autoScroll
};
