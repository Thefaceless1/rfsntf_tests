import nodemailer, {SendMailOptions} from 'nodemailer'
import * as path from "path";
import * as Process from "process";
import 'dotenv/config'
import Mail from "nodemailer/lib/mailer";
import * as fs from "fs";

export const transporter = nodemailer.createTransport({
    service: 'SMTP',
    host: Process.env.MAIL_HOST,
    port: Number(Process.env.MAIL_PORT),
    secure: false,
    tls: {
        rejectUnauthorized: false
    }
})

export const mailOptions: SendMailOptions = {
    from: Process.env.MAIL_FROM,
    to: Process.env.MAIL_TO!.split(",").map(address => address.trim()),
    subject: `Отчет по автотестам для модуля 'Уведомления' версии ${Process.env.APP_VERSION} от ${new Date().toLocaleDateString('ru-RU')}`,
    text: 'Скачайте прикрепленный файл index.html для просмотра отчета',
    attachments: getAttachments()
}

function getAttachments(): Mail.Attachment[] {
    const attachments: Mail.Attachment[] = [
        {
            filename: 'index.html',
            path: path.resolve("src","e2e","artifacts","report","index.html")
        }
    ]
    const screenshotsPath: string = path.resolve("src","e2e","artifacts","screenshots");
    const screenshotsFolder: string[] = fs.readdirSync(screenshotsPath);
    if(screenshotsFolder.length > 0) {
        screenshotsFolder.forEach(subFolder => {
            const subFolderPath: string = screenshotsPath + "/" + subFolder;
            const filesArray: string[] = fs.readdirSync(subFolderPath);
            if(filesArray.length > 0) {
                filesArray.forEach(file => {
                    const filePath: string = subFolderPath + "/" + file;
                    attachments.push({
                        filename: file,
                        path: path.resolve(filePath)
                    })
                })
            }
        })
    }
    return attachments;
}