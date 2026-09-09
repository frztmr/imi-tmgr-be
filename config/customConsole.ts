
/*
just make the console colorful


*/


export const colorTx = {
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
}

export const colorBg = {

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

}

export const colorReset = "\x1b[0m" //reset semua effect dan warna

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
}

export const concol = {
    bright: (mainLocationName: string, timestamp: string, msg: string, colorTx: string, colorBg: string) => {
        return console.log(colorReset + colorEffect.Bright + colorBg + colorTx + "  " + timestamp + " " + mainLocationName + " =>" + msg + colorReset)
    },
    dim: (mainLocationName: string, timestamp: string, msg: string, colorTx: string, colorBg: string) => {
        return console.log(colorReset + colorEffect.Dim + colorBg + colorTx + "  " + timestamp + " " + mainLocationName + " =>" + msg + colorReset)
    },
    underscore: (mainLocationName: string, timestamp: string, msg: string, colorTx: string, colorBg: string) => {
        return console.log(colorReset + colorEffect.Underscore + colorBg + colorTx + "  " + timestamp + " " + mainLocationName + " =>" + msg + colorReset)
    },
    blink: (mainLocationName: string, timestamp: string, msg: string, colorTx: string, colorBg: string) => {
        return console.log(colorReset + colorEffect.Blink + colorBg + colorTx + "  " + timestamp + " " + mainLocationName + " =>" + msg + colorReset)
    },
    reverse: (mainLocationName: string, timestamp: string, msg: string, colorTx: string, colorBg: string) => {
        return console.log(colorReset + colorEffect.Reverse + colorEffect.Bright + colorBg + colorTx + "  " + timestamp + " " + mainLocationName + " =>" + msg + colorReset)
    },
    hidden: (mainLocationName: string, timestamp: string, msg: string, colorTx: string, colorBg: string) => {
        return console.log(colorReset + colorEffect.Hidden + colorBg + colorTx + "  " + timestamp + " " + mainLocationName + " =>" + msg + colorReset)
    },
    plain: (mainLocationName: string, timestamp: string, msg: string, colorTx: string, colorBg: string) => {
        return console.log(colorReset + colorBg + colorTx + "  " + timestamp + " " + mainLocationName + " => " + msg + colorReset)
    },

} 

export const consoleBright = (mainLocationName: string, timestamp: string, msg: string, colorTx: string, colorBg: string) => {
    return console.log(colorReset + colorEffect.Bright + colorBg + colorTx + "  " + timestamp + " " + mainLocationName + " =>" + msg + colorReset)
}
export const consoleEffecteDim = (mainLocationName: string, timestamp: string, msg: string, colorTx: string, colorBg: string) => {
    return console.log(colorReset + colorEffect.Dim + colorBg + colorTx + "  " + timestamp + " " + mainLocationName + " =>" + msg + colorReset)
}
export const consoleEffectUnderscore = (mainLocationName: string, timestamp: string, msg: string, colorTx: string, colorBg: string) => {
    return console.log(colorReset + colorEffect.Underscore + colorBg + colorTx + "  " + timestamp + " " + mainLocationName + " =>" + msg + colorReset)
}
export const consoleEffectBlink = (mainLocationName: string, timestamp: string, msg: string, colorTx: string, colorBg: string) => {
    return console.log(colorReset + colorEffect.Blink + colorBg + colorTx + "  " + timestamp + " " + mainLocationName + " =>" + msg + colorReset)
}
export const consoleReverse = (mainLocationName: string, timestamp: string, msg: string, colorTx: string, colorBg: string) => {
    return console.log(colorReset + colorEffect.Reverse + colorEffect.Bright + colorBg + colorTx + "  " + timestamp + " " + mainLocationName + " =>" + msg + colorReset)
}
export const consoleHidden = (mainLocationName: string, timestamp: string, msg: string, colorTx: string, colorBg: string) => {
    return console.log(colorReset + colorEffect.Hidden + colorBg + colorTx + "  " + timestamp + " " + mainLocationName + " =>" + msg + colorReset)
}
export const consolePlain = (mainLocationName: string, timestamp: string, msg: string, colorTx: string, colorBg: string) => {
    return console.log(colorReset + colorBg + colorTx + "  " + timestamp + " " + mainLocationName + " => " + msg + colorReset)
} 
