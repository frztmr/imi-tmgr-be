// src/types/global.d.ts
// import { Request } from 'express';
import { Request, Response, NextFunction } from "express";

declare global {
    type Req = Request;
    type Res = Response;
    type Next = NextFunction;

    // type DataToken = {
    //     user_id: number
    //     employee_id: number,
    //     type_id: number,
    //     uid: string,
    //     active: number | null,
    //     status: number | null,
    //     user_level: number | null,
    // };
    type DataToken = {
        uname: string
        uID: string, 
    };
    type InventoryData = [{
        matcode: number
        product_sku: string,
        product_name: string,
        wh_id: number,
        location_id: number,
        company_id: number,
        po_number: string ,
        expired_date: string,
        batch_code: string,
        invoice_id: string,
        trans_type_id: number,
        customer_id: number,
        date: string,
        container_no: string,
        balance: number , 
        pack: number ,
        qty: number ,
        remarks: string,
        pack: number ,
        invoice: string ,  

    }];

    namespace Express {
        interface Request {
            dataToken: DataToken;
        }
    }

}

