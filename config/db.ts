import { createPool } from "mysql2";
import { db_host_config, db_pswd_config, db_user_config } from './enviroment'
import pkg from "pg";
const { Pool } = pkg;
const util = require('util');

/* ================= Database connection  ====================  */
/**
 * iod global (i2i - e_order) database connection
 */

export const dbIod: any = createPool(({
    // connectionLimit : 20, 
    multipleStatements: true,
    host: db_host_config,
    user: db_user_config,
    password: db_pswd_config,
    database: "your_database_name",
    supportBigNumbers: true,
    bigNumberStrings: true
}))
export const dbIodQuery: any = util.promisify(dbIod.query).bind(dbIod);


// HOTS database ===============================
export const dbHots: any = createPool(({
    // connectionLimit : 20, 
    multipleStatements: true,
    host: db_host_config,
    user: db_user_config,
    password: db_pswd_config,
    database: "your_database_name",
    supportBigNumbers: true,
    bigNumberStrings: true
}))
export const dbHotsQuery: any = util.promisify(dbHots.query).bind(dbHots);



// PostgresSQL ICASTOCK
export const dbPgMain = new Pool({
    user: process.env.DB_PGUSER,
    host: process.env.DB_PGHOST,
    database: process.env.DB_PGDATABASE,
    password: process.env.DB_PGPASSWORD,
    port: Number(process.env.DB_PGPORT) || 5432,
});
export const dbPgMainQuery: any = util.promisify(dbPgMain.query).bind(dbPgMain);