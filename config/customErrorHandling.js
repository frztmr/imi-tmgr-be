"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ganjelNumber = exports.ganjelString = void 0;
const customConsole_1 = require("./customConsole");
// ini untuk ngasih tau anak intern kalau data yang dikirim salahnya apa.
const ganjelString = (obj) => {
    const variableName = Object.keys(obj)[0];
    let value = obj[variableName];
    if (value === undefined) {
        customConsole_1.concol.bright('', '', ` [YAELA] ${variableName}-nya UNDEFINED. harusnya STRING wkwkwk `, customConsole_1.colorTx.White, customConsole_1.colorBg.Yellow);
        return '';
    }
    else if (typeof value !== 'string') {
        customConsole_1.concol.bright('', '', ` [YAELA] ${variableName}-nya DATA TYPE salah kalo ${typeof value}. harusnya STRING wkwkwk`, customConsole_1.colorTx.White, customConsole_1.colorBg.Yellow);
        return value;
    }
    else {
        return value;
    }
};
exports.ganjelString = ganjelString;
const ganjelNumber = (obj) => {
    const variableName = Object.keys(obj)[0];
    let value = obj[variableName];
    if (value === undefined) {
        customConsole_1.concol.bright('', '', ` [YAELA] ${variableName}-nya UNDEFINED. harusnya NUMBER wkwkwk `, customConsole_1.colorTx.White, customConsole_1.colorBg.Yellow);
        return 0;
    }
    else if (typeof value !== 'number') {
        customConsole_1.concol.bright('', '', ` [YAELA] ${variableName}-nya DATA TYPE salah kalo ${typeof value}. harusnya NUMBER wkwkwk `, customConsole_1.colorTx.White, customConsole_1.colorBg.Yellow);
        return value;
    }
    else {
        return value;
    }
};
exports.ganjelNumber = ganjelNumber;
