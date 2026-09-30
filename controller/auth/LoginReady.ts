

import { Request, Response } from 'express';
/* 
auth diantaranya:
- login,
- keep login,
- change password
- forgot password
- forgot password verification
- change password forgot password

*/
let yellowTerminal = "\x1b[33m";
let location: string = "auth"


export const LoginReady = async (req: Request, res: Response) => {

    let date = new Date();
    let timestamp = yellowTerminal + date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' => ' + ' Auth Login  =>';

    let msg: string = 'Whenever you ready!'
    let stats: number = 200
    let ready: boolean = true
    // let ready: boolean = true

    res.status(stats).send({ msg, ready })
    console.log(timestamp, " Check login availability. Is ready :", ready)
    // dbIod.query(dbIodQuery, paramQuery, async (error: Error, results: Response) => {})

}


