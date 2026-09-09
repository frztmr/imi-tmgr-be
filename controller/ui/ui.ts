import { Response } from 'express';
import { dbPgMainQuery } from '../../config/db'
// import { } from '../../../config/encrypt'
import { colorBg, colorTx, concol } from '../../config/customConsole'
import { ui } from './uiQueryPg';
// import { error } from 'console';
// import { dateShifter } from '../../../config/formatShifter'

let location: string = "/ui";

const uiController = {

    getSideMenu: async (res: Response) => {


        let date = new Date();
        let timestamp = colorTx.Blue + date.toLocaleDateString('id') + ' ' + date.toLocaleTimeString('id') + ' => ';

        // if (req.dataToken.uid) {

        // if (company_id) {

        // let sqlParam: [number] = [company_id];

        dbPgMainQuery.query(
            ui.getSidebarMenu,
            (err: any, results: any) => {
                if (err) { //error catch
                    res.status(500).send("Error 500 at /ui/side_menu")
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


    },
    getTransactionAction: async (res: Response) => {


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


    },

}; export default uiController;

