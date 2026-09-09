/* ================= enviroment detector and selector ==================== */

const os = require('os')

function production(): boolean {

    function getLocalIp() {
        const networkInterfaces = os.networkInterfaces();
        for (const interfaceName in networkInterfaces) {
            const addresses = networkInterfaces[interfaceName];
            for (const address of addresses) {
                if (address.family === 'IPv4' && !address.internal) {
                    return address.address; // Return the local IP address
                }
            }
        }
    }

    if (getLocalIp() == process.env.PRO_IP) {
        // return "production"
        return true;
    } else {
        // return "development"
        return false;
    }


}


export let db_host_config: string = production() ? process.env.DB_HOST || "no_data" : process.env.DEV_DB_HOST || "no_data";

export let db_user_config: string = production() ? process.env.DB_USER || "no_data" : process.env.DEV_DB_USER || "no_data";

export let db_pswd_config: string = production() ? process.env.DB_PSWD || "no_data" : process.env.DEV_DB_PSWD || "no_data";

export let PORT: number = parseInt(production() ? process.env.PORT_SSL || "3000" : process.env.DEV_PORT || "3001");

export let cookieSecureParameter: boolean = production() ? true : false

export let cookieSameSiteParameter: string = production() ? "strict" :  "none"
// module.exports = { db_host_config, db_user_config, db_pswd_config }