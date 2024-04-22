import {Locator, Page} from "@playwright/test";
import {MailNotify} from "../helpers/MailNotify.js";
import {Element} from "../../framework/elements/Element.js";
import {logger} from "../../../logger/logger.js";
import {DbHelper} from "../../../db/DbHelper.js";

export class MailPage extends MailNotify {
    private readonly mailUrl: string = "https://mail.rfs.ru/"
    constructor(page: Page) {
        super(page);
    }
    /**
     * Message title
     */
    private messageTitle: Locator = Element.getElement(this.page,"//span[@autoid='_lvv_5']")
    /**
     * Field 'Username'
     */
    private userName: Locator = Element.getElement(this.page,"//input[@id='username']")
    /**
     * Field 'Password'
     */
    private userPass: Locator = Element.getElement(this.page,"//input[@id='password']")
    /**
     * Button 'Sign in'
     */
    private signInButton: Locator = Element.getElement(this.page,"//span[text()='sign in']")
    /**
     * Title 'Inbox'
     */
    private inbox: Locator = Element.getElement(this.page,"//span[@autoid='_n_h' and text()='Входящие']")
    /**
     * Button 'Yes'
     */
    private yesButton: Locator = Element.getElement(this.page,"//a[text()='Да']")
    /**
     * Button 'Delete'
     */
    private removeButton: Locator = Element.getElement(this.page,"//span[text()='Удалить']")
    /**
     * Button 'Send'
     */
    private sendButton(page: Page): Locator {
        return Element.getElement(page,"//button[@autoid='_mcp_g' and @title='Отправить']");
    }
    /**
     * Deleting existing messages
     */
    public async deleteExistingMessages(): Promise<void> {
        await this.page.goto(this.mailUrl);
        await this.userName.fill("rfs\\" + process.env.USER_LOGIN!);
        await this.userPass.fill(process.env.USER_PASS!);
        await this.signInButton.click();
        await Element.waitForVisible(this.inbox);
        const messagesCount: number = await this.messageTitle.count();
        if(messagesCount == 1) {
            await this.messageTitle.click();
            await this.removeButton.click();
        }
        else if(messagesCount > 1) {
            for(let i = 1; i <= messagesCount; i++) {
                await this.messageTitle.first().click();
                await this.removeButton.click();
                do {

                } while (messagesCount-i != await this.messageTitle.count());
            }
        }
    }
    /**
     * Waiting for incoming message
     */
    public async waitingIncomingMessage(): Promise<void> {
        const secondsCountToWait: number = 30;
        const checkIntervalSeconds: number = 5;
        for(let i = secondsCountToWait; i >= 0; i -= checkIntervalSeconds) {
            if(i != secondsCountToWait) await this.page.reload({waitUntil: "load"});
            await this.page.waitForTimeout(checkIntervalSeconds * 1000);
            if(await this.messageTitle.isVisible()) {
                logger.info("Сообщение доставлено на почту");
                break;
            }
            else if(i <= 0) throw new Error("Сообщение не доставлено на почту в указанный срок");
        }
    }
    /**
     * Reply to message
     */
    public async replyToMessage(): Promise<void> {
        await this.messageTitle.click();
        const popupPromise = this.page.waitForEvent("popup");
        await this.yesButton.click();
        const popup: Page = await popupPromise;
        await this.sendButton(popup).click();
        await this.checkAnswer();
    }
    /**
     * Checking answer
     */
    private async checkAnswer(): Promise<void> {
        const dbHelper = new DbHelper();
        const secondsCountToWait: number = 320;
        const checkIntervalSeconds: number = 10;
        for(let i = secondsCountToWait; i >= 0; i -= checkIntervalSeconds) {
            await this.page.waitForTimeout(checkIntervalSeconds * 1000);
            const answer = await dbHelper.getUserAnswers(this.userId);
            if(answer.length == 1) {
                await dbHelper.closeConnect();
                logger.info("Ответ пользователя на сообщение записан в БД");
                break;
            }
            else if(i <= 0) {
                await dbHelper.closeConnect();
                throw new Error("Ответ пользователя на сообщение не записан в БД в указанный срок");
            }
        }
    }
}