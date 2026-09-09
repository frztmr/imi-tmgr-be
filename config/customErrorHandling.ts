import { concol, colorTx, colorBg } from "./customConsole"


// ini untuk ngasih tau anak intern kalau data yang dikirim salahnya apa.
export const ganjelString = (obj: Record<string, any>) => {

    const variableName = Object.keys(obj)[0];
    let value = obj[variableName];

    if (value === undefined) {

        concol.bright('', '',
            ` [YAELA] ${variableName}-nya UNDEFINED. harusnya STRING wkwkwk `,
            colorTx.White, colorBg.Yellow
        )

        return ''

    } else if (typeof value !== 'string') {

        concol.bright('', '',
            ` [YAELA] ${variableName}-nya DATA TYPE salah kalo ${typeof value}. harusnya STRING wkwkwk`,
            colorTx.White, colorBg.Yellow
        )

        return value

    } else {

        return value

    }
}
export const ganjelNumber = (obj: Record<string, any>) => {

    const variableName = Object.keys(obj)[0];
    let value = obj[variableName];

    if (value === undefined) {

        concol.bright('', '',
            ` [YAELA] ${variableName}-nya UNDEFINED. harusnya NUMBER wkwkwk `,
            colorTx.White, colorBg.Yellow
        )

        return 0

    } else if (typeof value !== 'number') {

        concol.bright('', '',
            ` [YAELA] ${variableName}-nya DATA TYPE salah kalo ${typeof value}. harusnya NUMBER wkwkwk `,
            colorTx.White, colorBg.Yellow
        )

        return value

    } else {

        return value
        
    }
}