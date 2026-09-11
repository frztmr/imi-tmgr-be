"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbPgMainQuery = exports.dbPgMain = exports.dbHotsQuery = exports.dbHots = exports.dbIodQuery = exports.dbIod = void 0;
const mysql2_1 = require("mysql2");
const enviroment_1 = require("./enviroment");
const pg_1 = __importDefault(require("pg"));
const { Pool } = pg_1.default;
const util = require('util');
/* ================= Database connection  ====================  */
/**
 * iod global (i2i - e_order) database connection
 */
exports.dbIod = (0, mysql2_1.createPool)(({
    // connectionLimit : 20, 
    multipleStatements: true,
    host: enviroment_1.db_host_config,
    user: enviroment_1.db_user_config,
    password: enviroment_1.db_pswd_config,
    database: "iod",
    supportBigNumbers: true,
    bigNumberStrings: true
}));
exports.dbIodQuery = util.promisify(exports.dbIod.query).bind(exports.dbIod);
// HOTS database ===============================
exports.dbHots = (0, mysql2_1.createPool)(({
    // connectionLimit : 20, 
    multipleStatements: true,
    host: enviroment_1.db_host_config,
    user: enviroment_1.db_user_config,
    password: enviroment_1.db_pswd_config,
    database: 'hots',
    supportBigNumbers: true,
    bigNumberStrings: true
}));
exports.dbHotsQuery = util.promisify(exports.dbHots.query).bind(exports.dbHots);
// PostgresSQL ICASTOCK
exports.dbPgMain = new Pool({
    user: process.env.DB_PG_USER_MAIN,
    host: process.env.DB_PG_HOST_MAIN,
    database: process.env.DB_PG_NAME_MAIN,
    password: process.env.DB_PG_PEWD_MAIN,
    port: Number(process.env.DB_PG_PORT_MAIN) || 5432,
});
exports.dbPgMainQuery = util.promisify(exports.dbPgMain.query).bind(exports.dbPgMain);
