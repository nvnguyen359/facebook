// Import builtin NodeJS modules to instantiate the service
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

require("dotenv").config({ path: "./../.env" });
const { getListPrinter, allApisPrinter } = require("./apis/apiInfo");
const CommunicationPort = require("./seiralPort");
var bodyParser = require('body-parser');
//require('./features/upsertGgsheet')
const fs = require("fs");
var bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
// const SerialPort = require("serialport");
// const bindings = require("@serialport/bindings");
// const apis = require("./apis/apiCrud");
const { apisSqlite } = require("./apis/apiSqlite");
const express = require("express");
const app = express();
const port = process.env.PORT || 3276;
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: [`http://localhost:${process.env.PORT_CLIENT}`],
    methods: ["GET", "POST"],
    allowedHeaders: ["*"],
    credentials: true,
  },
});
// let serialPort = new SerialPort("COM2", {
//   baudRate: 9600,
// });
let sr = new CommunicationPort();
sr.sendData(io);
app.get("/", (req, res, next) => {
  res.send("Api ready!");
  //next();
});

io.on("connection", async (socket) => {
  console.log("a user connected");
  socket.on("changePort", async (data) => {
    console.log("==================", data);
    if (!data) return;

    try {
      await sr.portClose();
      sr = new CommunicationPort(data.port, data.baudRate);
      sr.sendData(io);
    } catch (error) {
      console.log(error);
    }
  });
  socket.on("data", async (data) => {
    if ((data.data = "close")) {
      await sr.portClose();
    }
  });
  //send data to client
  // serialPort.on("data", function (data) {
  //   console.log(data)
  //  // io.emit("message", data.toString("utf8"));
  // });
});
const localtunnel = require("localtunnel");
const tunnel = localtunnel(port, { subdomain: "dev" }, (err, tunnel) => {
  console.log(err, tunnel);
});

tunnel.on("close", function () {
  // When the tunnel is closed
});
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

const allowedOrigins = [
  `http://localhost:${process.env.PORT_CLIENT}`,
  `http://localhost:${process.env.PORT_CLIENT}/#/`,
  " http://localhost:18062",
  " http://localhost:8200",
];
//require('./apis/apiExcute')

// app.use(express.json({limit: '50mb'})); // for parsing application/json
// app.use(express.urlencoded({ extended: true ,limit: '50mb'})); // for parsing application/x-www-form-urlencoded


app.use(cors({ origin: "*" }));
app.use(function (req, res, next) {
  // Website you wish to allow to connect

  const origin = req.headers.origin;
  if (allowedOrigins.indexOf(origin) > -1) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  // Pass to next layer of middleware
  next();
});

//============================================================
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/json', limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
    app.use(bodyParser()); // lấy thông tin từ form HTML
    app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.use(
  bodyParser.json({
    type: "*/*",
  })
);
// Function to serve all static files
// inside public directory.
app.use(express.static("public"));
// apis.callApis(app);
apisSqlite(app);
allApisPrinter(app);
app.use("/uploads", express.static("uploads"));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/imgs", express.static(path.join(__dirname, "imgs")));
app.use("/public", express.static("public"));
app.use("/app/public", express.static("public"));
var options = {
  explorer: true,
};
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));
module.exports = app;

const { CrawData } = require("./features/Adplaywright");
const craw = new CrawData("https://www.facebook.com/", false);
(async () => {
  // await craw.setup();
  // await craw.loginFaceBook('nvnguyen2504@gmail.com','anhduongthanhthuy');
  // await craw.getGroups()
})();
