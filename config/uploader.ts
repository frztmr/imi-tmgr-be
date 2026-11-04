import multer from "multer";
import fs from "fs"
import jwt from "jsonwebtoken";
import { customAlphabet } from "nanoid";
import { Request, Response, NextFunction } from 'express'

export = {
    imageUploader: (directory: string, filePrefix: string) => {
        // Define lokasi default directory
        // Define lokasi default directory
        let defaultDir = './public/image/';

        // Konfigurasi untuk multer
        const storageUploader = multer.diskStorage({
            destination: (req, file, cb) => {
                // Menentukan lokasi penyimpanan
                const pathDir = directory ? defaultDir + directory : defaultDir;

                // Melakukan pemeriksaan pathDir
                /*
                if (fs.existsSync(pathDir)) {
                    // Jika directory ada, maka akan dijalankan cb untuk menyimpan data
                    console.log(`Directory ${pathDir} exist ✅`);
                    cb(null, pathDir);
                } else {
                    fs.mkdir(pathDir, { recursive: true }, (err) => {
                        if (err) {
                            console.log('Error make directory :', err)
                        }
                        console.log(`Success created ${pathDir}`);
                        return cb(err, pathDir)
                    });
                }
                */

                if (fs.existsSync(pathDir)) {
                    // console.log(`Directory ${pathDir} exist ✅`);
                    cb(null, pathDir);
                } else {
                    fs.mkdir(pathDir, { recursive: true }, (err) => {
                        if (err) {
                            // console.log('Error make directory:', err);
                            cb(err, pathDir); // Call cb with error
                        } else {
                            // console.log(`Success created ${pathDir}`);
                            cb(null, pathDir); // Call cb on success
                        }
                    });
                }

            },
            filename: (req: any, file, cb) => {
                jwt.verify(req.token, process.env.SECURITY_TOKEN_KEY || "ih_beneran_kepo_lu_ye", (err: any, decode: any) => {
                     
                    if (err) {
                        console.log("ERROR IN AUTH")
                    }

                    req.dataToken = decode;

                    let ext = file.originalname.split('.');

                    let time = new Date;
                    let timestamp = time.toLocaleDateString('sv-SE') + '-' + Date.now()

                    let user_id = req.dataToken.user_id + '-'

                    let newName = filePrefix + user_id + timestamp + '.' + ext[ext.length - 1];
                    // let newName = filePrefix + Date.now() + '.' + ext[ext.length - 1];
                    // console.log('New filename', newName)
                    cb(null, newName);
                })
            }
        })

        const fileFilter = (req: Request, file:any, cb:any) => {
            // const extFilter = /\.(jpg|png|webp|jpeg|svg)/;
            const extFilter = /\.(jpg|png|webp|jpeg|svg)$/i;


            if (file.originalname.toLowerCase().match(extFilter)) {
                cb(null, true)
            } else {
                cb(new Error('Your file ext are denied ❌'));
            }
        }

        return multer({ storage: storageUploader, fileFilter })
    },
}