import {MailNotify} from "./MailNotify.js";
import {Page} from "@playwright/test";
import {DbHelper} from "../../../db/DbHelper.js";
import {logger} from "../../../logger/logger.js";

export class TelegramNotify extends MailNotify {
    private readonly operationId: string = "send_telegram"
    constructor(page: Page) {
        super(page);
    }
    /**
     * Delete records with test messages from 'work_operations_log' table
     */
    public async deleteTestMessagesOperationLog(): Promise<void> {
        const dbHelper = new DbHelper();
        await dbHelper.deleteTestMessagesOperationLog(this.testMessageData.title);
        await dbHelper.closeConnect();
    }
    /**
     * Adding 'get_telegram' attribute to notification for user
     */
    public async addGetTelegramAttribute(): Promise<void> {
        const dbHelper = new DbHelper();
        await dbHelper.addGetTelegramAttribute(this.notificationCode,this.userId);
        await dbHelper.closeConnect();
    }
    /**
     * Checking sending a message in telegram
     */
    public async checkTelegramMessageSending(): Promise<void> {
        const dbHelper = new DbHelper();
        const secondsCountToWait: number = 5;
        const checkIntervalSeconds: number = 1;
        for(let i = secondsCountToWait; i >= 0; i -= checkIntervalSeconds) {
            await this.page.waitForTimeout(checkIntervalSeconds * 1000);
            const operationLog = await dbHelper.getTestMessagesOperationLog(this.operationId,this.testMessageData.title);
            if(operationLog.length == 1 && operationLog[0].errors == null) {
                await dbHelper.closeConnect();
                logger.info("Сообщение отправлено в Телеграм");
                break;
            }
            else if(operationLog.length == 1 && operationLog[0].errors != null) {
                await dbHelper.closeConnect();
                throw new Error(`Ошибка при отправке сообщения в Телеграм: \n${operationLog[0].errors}`);
            }
            else if(i <= 0) {
                await dbHelper.closeConnect();
                throw new Error("Сообщение не было отправлено в Телеграм в указанный срок");
            }
        }
    }
}