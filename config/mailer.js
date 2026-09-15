"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nativeMailer = exports.gmailMailer = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
// PERHATIAN: INI CUMA BISA BERJALAN JIKA DI SERVER PRODUCTION
const transporter = nodemailer_1.default.createTransport({
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
const gmailTransporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        // TODO: replace `user` and `pass` values from <https://forwardemail.net>
        user: process.env.GMAIL_MAIL_USERNAME,
        pass: process.env.GMAIL_MAIL_PASSWORD,
    },
});
const gmailMailer = (recipient) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield gmailTransporter.sendMail({
            from: 'babuitiod@gmail.com',
            to: recipient,
            subject: `[NOREPLY] Forgot Password Token!`,
            html: `
                            <style> 
                            </div>
                        
                        `,
        });
    }
    catch (error) {
        console.log("MAILER ERROR, Message: " + error);
    }
});
exports.gmailMailer = gmailMailer;
const nativeMailer = (recipient) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield transporter.sendMail({
            from: 'no-reply@indofoodinternational.com',
            to: "dist_mail",
            cc: "carbonCopy",
            subject: `[E-Order] Order Submission  is Successful!`,
            html: ` <div>
                    <p>`
        });
    }
    catch (error) {
        console.log("MAILER ERROR, Message: " + error);
    }
});
exports.nativeMailer = nativeMailer;
