"use strict";
/* ================= enviroment detector and selector ==================== */
Object.defineProperty(exports, "__esModule", { value: true });
exports.cookieSameSiteParameter = exports.cookieSecureParameter = exports.PORT = exports.db_pswd_config = exports.db_user_config = exports.db_host_config = void 0;
const os = require('os');
function production() {
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
    }
    else {
        // return "development"
        return false;
    }
}
exports.db_host_config = production() ? process.env.DB_HOST || "no_data" : process.env.DEV_DB_HOST || "no_data";
exports.db_user_config = production() ? process.env.DB_USER || "no_data" : process.env.DEV_DB_USER || "no_data";
exports.db_pswd_config = production() ? process.env.DB_PSWD || "no_data" : process.env.DEV_DB_PSWD || "no_data";
exports.PORT = parseInt(production() ? process.env.PORT_SSL || "3000" : process.env.DEV_PORT || "3001");
exports.cookieSecureParameter = production() ? true : false;
exports.cookieSameSiteParameter = production() ? "strict" : "none";
// module.exports = { db_host_config, db_user_config, db_pswd_config }
