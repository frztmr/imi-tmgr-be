import { Response } from 'express';
import { dbPgMainQuery } from '../../config/db'
// import { } from '../../../config/encrypt'
import { colorBg, colorTx, concol } from '../../config/customConsole'
import { ui } from './uiQueryPg';

let location: string = "/ui/setting";

export const getSettings = (req: Request, res: Response) => {

    let date = new Date();
    let timestamp = colorTx.Blue + date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' => ';

    // if (req.dataToken.uid) { // spare for authorization variable


    // if (company_id) {

    // let sqlParam: [number] = [company_id];

    dbPgMainQuery.query(
        ui.getTransactionAction,
        (err: any, results: any) => {
            if (err) {
                res.status(500).send("Error 500 at /ui/trx_action")
                concol.bright(
                    location, timestamp,
                    "/ui/side_menu => error at sideMenu" + err,
                    colorTx.White, colorBg.Red)
            } else {
                res.status(200).send(results)
                concol.bright(
                    location, timestamp,
                    "/ui/side_menu => success",
                    colorTx.White, colorBg.Black
                )

            }
        })

    // } else {
    //     res.status(500).send("Error 500 at getPoNumber")
    //     concol.bright(
    //         location, timestamp,
    //         "/side => error getPoNumber: company_id is not provided",
    //         colorTx.White, colorBg.Red
    //     )
    // }


    // } else {
    //     res.status(200).send("unauthorized attemt")
    //     concol.bright(location, timestamp, " get menu list unauthorized attemt" , colorTx.White, colorBg.Red)

    // }

}