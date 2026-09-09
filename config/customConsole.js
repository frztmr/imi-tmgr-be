"use strict";
/*
just make the console colorful


*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.consolePlain = exports.consoleHidden = exports.consoleReverse = exports.consoleEffectBlink = exports.consoleEffectUnderscore = exports.consoleEffecteDim = exports.consoleBright = exports.concol = exports.colorReset = exports.colorBg = exports.colorTx = void 0;
exports.colorTx = {
    /*
        Ini untuk mengubah warna tulisan dari apa yang muncul di terminal.
    */
    Black: "\x1b[30m",
    Red: "\x1b[31m",
    Green: "\x1b[32m",
    Yellow: "\x1b[33m",
    Blue: "\x1b[34m",
    Magenta: "\x1b[35m",
    Cyan: "\x1b[36m",
    White: "\x1b[37m",
    Gray: "\x1b[90m",
};
exports.colorBg = {
    /*
        Ini untuk mengubah background tulisan dari apa yang muncul di terminal.
    */
    Black: "\x1b[40m",
    Red: "\x1b[41m",
    Green: "\x1b[42m",
    Yellow: "\x1b[43m",
    Blue: "\x1b[44m",
    Magenta: "\x1b[45m",
    Cyan: "\x1b[46m",
    White: "\x1b[47m",
    Gray: "\x1b[100m"
};
exports.colorReset = "\x1b[0m"; //reset semua effect dan warna
const colorEffect = {
    /*
        Ini untuk memberi effect warna tulisan dari apa yang muncul di terminal.
    */
    Bright: "\x1b[1m",
    Dim: "\x1b[2m",
    Underscore: "\x1b[4m",
    Blink: "\x1b[5m",
    Reverse: "\x1b[7m",
    Hidden: "\x1b[8m"
};
exports.concol = {
    bright: (mainLocationName, timestamp, msg, colorTx, colorBg) => {
        return console.log(exports.colorReset + colorEffect.Bright + colorBg + colorTx + "  " + timestamp + " " + mainLocationName + " =>" + msg + exports.colorReset);
    },
    dim: (mainLocationName, timestamp, msg, colorTx, colorBg) => {
        return console.log(exports.colorReset + colorEffect.Dim + colorBg + colorTx + "  " + timestamp + " " + mainLocationName + " =>" + msg + exports.colorReset);
    },
    underscore: (mainLocationName, timestamp, msg, colorTx, colorBg) => {
        return console.log(exports.colorReset + colorEffect.Underscore + colorBg + colorTx + "  " + timestamp + " " + mainLocationName + " =>" + msg + exports.colorReset);
    },
    blink: (mainLocationName, timestamp, msg, colorTx, colorBg) => {
        return console.log(exports.colorReset + colorEffect.Blink + colorBg + colorTx + "  " + timestamp + " " + mainLocationName + " =>" + msg + exports.colorReset);
    },
    reverse: (mainLocationName, timestamp, msg, colorTx, colorBg) => {
        return console.log(exports.colorReset + colorEffect.Reverse + colorEffect.Bright + colorBg + colorTx + "  " + timestamp + " " + mainLocationName + " =>" + msg + exports.colorReset);
    },
    hidden: (mainLocationName, timestamp, msg, colorTx, colorBg) => {
        return console.log(exports.colorReset + colorEffect.Hidden + colorBg + colorTx + "  " + timestamp + " " + mainLocationName + " =>" + msg + exports.colorReset);
    },
    plain: (mainLocationName, timestamp, msg, colorTx, colorBg) => {
        return console.log(exports.colorReset + colorBg + colorTx + "  " + timestamp + " " + mainLocationName + " => " + msg + exports.colorReset);
    },
};
const consoleBright = (mainLocationName, timestamp, msg, colorTx, colorBg) => {
    return console.log(exports.colorReset + colorEffect.Bright + colorBg + colorTx + "  " + timestamp + " " + mainLocationName + " =>" + msg + exports.colorReset);
};
exports.consoleBright = consoleBright;
const consoleEffecteDim = (mainLocationName, timestamp, msg, colorTx, colorBg) => {
    return console.log(exports.colorReset + colorEffect.Dim + colorBg + colorTx + "  " + timestamp + " " + mainLocationName + " =>" + msg + exports.colorReset);
};
exports.consoleEffecteDim = consoleEffecteDim;
const consoleEffectUnderscore = (mainLocationName, timestamp, msg, colorTx, colorBg) => {
    return console.log(exports.colorReset + colorEffect.Underscore + colorBg + colorTx + "  " + timestamp + " " + mainLocationName + " =>" + msg + exports.colorReset);
};
exports.consoleEffectUnderscore = consoleEffectUnderscore;
const consoleEffectBlink = (mainLocationName, timestamp, msg, colorTx, colorBg) => {
    return console.log(exports.colorReset + colorEffect.Blink + colorBg + colorTx + "  " + timestamp + " " + mainLocationName + " =>" + msg + exports.colorReset);
};
exports.consoleEffectBlink = consoleEffectBlink;
const consoleReverse = (mainLocationName, timestamp, msg, colorTx, colorBg) => {
    return console.log(exports.colorReset + colorEffect.Reverse + colorEffect.Bright + colorBg + colorTx + "  " + timestamp + " " + mainLocationName + " =>" + msg + exports.colorReset);
};
exports.consoleReverse = consoleReverse;
const consoleHidden = (mainLocationName, timestamp, msg, colorTx, colorBg) => {
    return console.log(exports.colorReset + colorEffect.Hidden + colorBg + colorTx + "  " + timestamp + " " + mainLocationName + " =>" + msg + exports.colorReset);
};
exports.consoleHidden = consoleHidden;
const consolePlain = (mainLocationName, timestamp, msg, colorTx, colorBg) => {
    return console.log(exports.colorReset + colorBg + colorTx + "  " + timestamp + " " + mainLocationName + " => " + msg + exports.colorReset);
};
exports.consolePlain = consolePlain;
