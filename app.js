"use strict";
/*
PLEASE READ THIS BEFORE
Here im using vertical monitor daily.
so im sorry if everything looks like
line
 by
  line
Also, My company does not allow me
 to use github.
 so i use on prem git on my network.

Im indonesian,
So im sorry if there are so many indonesian comment in my code
here im put my template of backend API that i create.
Also, I made this without agentic AI

MEAW MIAW MEEOO NYAAA
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* ========================= IMPORTING MODULE =========================== */
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const helmet_1 = __importDefault(require("helmet"));
const db_1 = require("./config/db");
// import { error } from "console";
const enviroment_1 = require("./config/enviroment");
const middleware_1 = require("./middleware/middleware");
const customConsole_1 = require("./config/customConsole");
let date = new Date();
let timestamp = date.toLocaleDateString() + ' ' + date.toLocaleTimeString('id') + ' : ';
let mainLocation = 'index.ts';
/* =================  configuration and interface ==================== */
const App = (0, express_1.default)();
App.use((0, cookie_parser_1.default)());
App.use((0, cors_1.default)({
    //ini url frontendnya dari mana. 
    //origin adalah alamat frontend yang mengirimkan request
    //di bawah ini adalah alamat yang hanya diizinkan
    origin: [
        // Ini deploy di laptop sendiri
        "http://localhost",
        "http://localhost/",
        "http://localhost:80",
        "http://localhost:8989/login",
        // Ini deploy di 110
        "http://172.16.32.110",
        "http://172.16.32.110/",
        "http://172.16.32.110:80",
    ],
    //http only request
    credentials: true,
}));
App.use(express_1.default.json());
// App.use(bearerToken());
App.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: 'cross-origin' }, // Override default policy
}));
App.use('/public', express_1.default.static('public'));
/* =================================================================== */
//for trigger the landing page
App.get("/", (req, res) => {
    console.log((0, customConsole_1.consoleReverse)(mainLocation, timestamp, " Somebody accesing Backend page. NGAPAIN COBA? ", customConsole_1.colorTx.Yellow, customConsole_1.colorBg.Yellow));
    res
        .status(200)
        .send("404 not found");
});
// so, we separate code flow like this: 
// middleware => router => controller => sql.ts
// add, controller first, 
// then, register function that you put on controller to router
// finally, register to middleware. 
// WHY? this makes your code easily maintainable. 
(0, middleware_1.middleware)(App);
//open and running at port:
// later you can make NGINX reverse proxy to here. 
App.listen(enviroment_1.PORT, () => {
    (0, customConsole_1.consoleReverse)(mainLocation, timestamp, ` ICA Stock Mgmt API is running at port: ${enviroment_1.PORT} `, customConsole_1.colorTx.Green, customConsole_1.colorBg.White);
});
//here all below the initiation Mysql database connection 
// ini untuk databse IOD
db_1.dbIod.getConnection((error, connection) => {
    if (error) {
        (0, customConsole_1.consoleReverse)(mainLocation, timestamp, ` Error database IOD on initiate connection ${error} `, customConsole_1.colorTx.White, customConsole_1.colorBg.Red);
    }
    else {
        (0, customConsole_1.consoleReverse)(mainLocation, timestamp, ` DB IOD has been connected ${connection.threadId}  `, customConsole_1.colorTx.Green, customConsole_1.colorBg.Green);
    }
});
// ini untuk databse IOD
db_1.dbHots.getConnection((error, connection) => {
    if (error) {
        (0, customConsole_1.consoleReverse)(mainLocation, timestamp, ` Error database Hots on initiate connection ${error} `, customConsole_1.colorTx.White, customConsole_1.colorBg.Red);
    }
    else {
        (0, customConsole_1.consoleReverse)(mainLocation, timestamp, ` DB Hots has been connected ${connection.threadId}  `, customConsole_1.colorTx.Green, customConsole_1.colorBg.Green);
    }
});
// this is postgresql database connection
db_1.dbPgMain.connect()
    .then(client => {
    (0, customConsole_1.consoleReverse)(mainLocation, timestamp, ` DB imi_tmgr PostgreSQL has been connected `, customConsole_1.colorTx.Green, customConsole_1.colorBg.Green);
    client.release();
})
    .catch(err => (0, customConsole_1.consoleReverse)(mainLocation, timestamp, ` Error database imi_tmgr PostgreSQL on initiate connection ${err} `, customConsole_1.colorTx.White, customConsole_1.colorBg.Red));
/*
// wanna use SSL?
const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello from plain Node.js!');
    // console.log("Marketing_API is running at port: ", PORT);
});
server.listen(PORT, () => {
    console.log(` Server running at http://localhost:${PORT}`);
});
*/
