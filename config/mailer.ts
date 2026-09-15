import nodemailer from "nodemailer";
import { dbPgMain, dbPgMainQuery } from "./db";


// PERHATIAN: INI CUMA BISA BERJALAN JIKA DI SERVER PRODUCTION
const transporter = nodemailer.createTransport({
    host: process.env.MAIL_SMTP_HOST,
    port: process.env.MAIL_SMTP_PORT,
    secure: false,
    auth: {
        // TODO: replace `user` and `pass` values from <https://forwardemail.net>
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,

    },
});

//
const gmailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        // TODO: replace `user` and `pass` values from <https://forwardemail.net>
        user: process.env.GMAIL_MAIL_USERNAME,
        pass: process.env.GMAIL_MAIL_PASSWORD,

    },
});

export const gmailMailer = async (recipient: string) => {
    try {
        await gmailTransporter.sendMail({
            from: 'babuitiod@gmail.com',
            to: recipient,
            subject: `[NOREPLY] Forgot Password Token!`,
            html: `
                            <style> 
                            </div>
                        
                        `,
        });
    } catch (error) {
        console.log("MAILER ERROR, Message: " + error)
    }
}
export const nativeMailer = async (recipient: string) => {

    try {
        await transporter.sendMail({
            from: 'no-reply@indofoodinternational.com',
            to: "dist_mail",
            cc: "carbonCopy",
            subject: `[E-Order] Order Submission  is Successful!`,
            html: ` <div>
                    <p>`})
    } catch (error) {
        console.log("MAILER ERROR, Message: " + error)
    }

}