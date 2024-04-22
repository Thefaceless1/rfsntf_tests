import {APIRequestContext, APIResponse, Page, request} from "@playwright/test";
import jwt from 'jsonwebtoken';
import {DbHelper} from "../../../db/DbHelper.js";
import config from "../../../../playwright.config.js";
import {AuthPage} from "../pages/AuthPage.js";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as fs from "fs";
import {TestMessageType} from "./types/TestMessageType";
import {logger} from "../../../logger/logger.js";

export class MailNotify extends AuthPage {
    protected readonly notificationCode: string = "1.1"
    private readonly appId: string = (process.env.BRANCH == "prod") ? "preprod-license.platform.rfs.ru" : "rfs-lic-test-01.fors.ru"
    private readonly moduleId: number = 9
    constructor(page: Page) {
        super(page);
    }
    /**
     * Update 'is_answer' attribute for notification template
     */
    public async updateAnswerAttribute(isAnswer: boolean): Promise<void> {
        const dbHelper = new DbHelper();
        await dbHelper.updateAnswerAttribute(this.notificationCode,isAnswer);
        await dbHelper.closeConnect();
    }
    /**
     * Adding a user subscription to an email notification
     */
    public async addGetMailAttribute(): Promise<void> {
        const dbHelper = new DbHelper();
        await dbHelper.addGetMailAttribute(this.notificationCode,this.userId);
        await dbHelper.closeConnect();
    }
    /**
     * Delete existing user answers
     */
    public async deleteExistingAnswers(): Promise<void> {
        const dbHelper = new DbHelper();
        await dbHelper.deleteExistingAnswers(this.userId);
        await dbHelper.closeConnect();
    }
    /**
     * Getting jwt token
     */
    private async getJwtToken(): Promise<string> {
        const dbHelper = new DbHelper();
        const secretKey: string = await dbHelper.getSecretKey(this.appId);
        await dbHelper.closeConnect();
        const tokenExpireTime: string = "1h";
        const secondsCountMinusOneMinuteTime: number = (Date.now()-60000)/1000;
        return jwt.sign({
            appId: this.appId,
            moduleId: this.moduleId,
            iat: secondsCountMinusOneMinuteTime
            },
            secretKey, {expiresIn: tokenExpireTime}
        );
    }
    /**
     * Call 'saveMessage' api
     */
    public async saveMessage(): Promise<void> {
        const saveMessageUrl: string = `${config.use?.baseURL}/api/rest/send/saveMessage`;
        const requestContext: APIRequestContext = await request.newContext();
        this.testMessageData
        const response: APIResponse = await requestContext.put(saveMessageUrl, {
            data: {
                "templateId": await this.getNotificationId(),
                "replyMessageId": null,
                "title": this.testMessageData.title,
                "message": this.testMessageData.message,
                "expireDate": new Date(),
                "recipients": [this.userId]
            },
            headers: {
                'Authorization': `Bearer ${await this.getJwtToken()}`
            }
        })
        if(response.status() != 200) throw new Error(`Ошибка при генерации сообщения ${await response.body()}`);
        else logger.info("Сообщение сгенерировано");
    }
    /**
     * Getting test message data
     */
    protected get testMessageData(): TestMessageType {
        const __dirname: string = dirname(fileURLToPath(import.meta.url));
        return JSON.parse(fs.readFileSync(path.resolve(__dirname,"testMessage.json"),{encoding: "utf-8"}));
    }
    /**
     * Getting notification id
     */
    public async getNotificationId(): Promise<number> {
        const dbHelper = new DbHelper();
        const notificationId: number = await dbHelper.getNotificationId(this.notificationCode);
        await dbHelper.closeConnect();
        return notificationId;
    }
}