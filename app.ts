
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

/* ========================= IMPORTING MODULE =========================== */
import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from 'dotenv'
dotenv.config();
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { dbIod, dbHots, dbPgMainQuery, dbPgMain } from './config/db';

// import { error } from "console";

import { PORT } from './config/enviroment'

import { middleware } from "./middleware/middleware";

import { colorBg, colorTx, consoleBright, consoleReverse, concol } from './config/customConsole'

import type { RowDataPacket } from "mysql2";

let date: Date = new Date()

let timestamp = date.toLocaleDateString() + ' ' + date.toLocaleTimeString('id') + ' : ';

let mainLocation = 'index.ts'

/* =================  configuration and interface ==================== */
const App: Application = express();
App.use(cookieParser());
App.use(cors({

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
App.use(express.json());
// App.use(bearerToken());
App.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },  // Override default policy
}))
App.use('/public', express.static('public'));
/* =================================================================== */


//for trigger the landing page
App.get("/", (req: Request, res: Response) => {
    console.log(consoleReverse(
        mainLocation,
        timestamp,
        " Somebody accesing Backend page. NGAPAIN COBA? ",
        colorTx.Yellow, colorBg.Yellow))
    res
        .status(200)
        .send(
            "404 not found"
        );
});

// so, we separate code flow like this: 
// middleware => router => controller => sql.ts
// add, controller first, 
// then, register function that you put on controller to router
// finally, register to middleware. 
// WHY? this makes your code easily maintainable. 
middleware(App)

//open and running at port:
// later you can make NGINX reverse proxy to here. 
App.listen(PORT, () => {
    consoleReverse(
        mainLocation, timestamp,
        ` ICA Stock Mgmt API is running at port: ${PORT} `,
        colorTx.Green, colorBg.White
    )
});

//here all below the initiation Mysql database connection 

// ini untuk databse IOD
dbIod.getConnection((error: any, connection: any) => {
    if (error) {
        consoleReverse(
            mainLocation, timestamp,
            ` Error database IOD on initiate connection ${error} `,
            colorTx.White, colorBg.Red
        )

    } else {
        consoleReverse(
            mainLocation, timestamp,
            ` DB IOD has been connected ${connection.threadId}  `,
            colorTx.Green, colorBg.Green
        )
    }
})

// ini untuk databse IOD
dbHots.getConnection((error: any, connection: any) => {
    if (error) {
        consoleReverse(
            mainLocation, timestamp,
            ` Error database Hots on initiate connection ${error} `,
            colorTx.White, colorBg.Red
        )
    } else {
        consoleReverse(
            mainLocation, timestamp,
            ` DB Hots has been connected ${connection.threadId}  `,
            colorTx.Green, colorBg.Green
        )
    }
})


// this is postgresql database connection
dbPgMain.connect()
    .then(client => {
        consoleReverse(
            mainLocation, timestamp,
            ` DB imi_tmgr PostgreSQL has been connected `,
            colorTx.Green, colorBg.Green
        )
        client.release();
    })
    .catch(err => consoleReverse(
        mainLocation, timestamp,
        ` Error database imi_tmgr PostgreSQL on initiate connection ${err} `,
        colorTx.White, colorBg.Red)
    );



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

