import {test as base} from '@playwright/test';
import {NotificationsPage} from "../../pages/notifications/NotificationsPage.js";
import {MailPage} from "../../pages/MailPage.js";
import {TelegramNotify} from "../TelegramNotify.js";

type Fixtures = {
    notifications: NotificationsPage,
    adminNotification: NotificationsPage
    mailPage: MailPage,
    telegramNotify: TelegramNotify
}
export const test = base.extend<Fixtures>({
    notifications: async ({page},use) => {
        const notification = new NotificationsPage(page);
        await notification.deleteNotificationUser();
        await notification.addNotificationUser();
        await notification.updateAnswerAttribute(false);
        await notification.saveMessage();
        await notification.login();
        await use(notification);
    },
    mailPage: async ({page},use) => {
        const mailPage = new MailPage(page);
        await mailPage.deleteNotificationUser();
        await mailPage.addNotificationUser();
        await mailPage.deleteExistingMessages();
        await mailPage.deleteExistingAnswers();
        await mailPage.updateAnswerAttribute(true);
        await mailPage.addGetMailAttribute();
        await mailPage.saveMessage();
        await use(mailPage);
        await mailPage.updateAnswerAttribute(false);
    },
    adminNotification: async ({page},use) => {
        const adminNotification = new NotificationsPage(page);
        await adminNotification.deleteNotificationUser();
        await adminNotification.addNotificationUser();
        await adminNotification.login();
        await use(adminNotification);
        await adminNotification.deleteModules();
    },
    telegramNotify: async ({page},use) => {
        const telegramNotify = new TelegramNotify(page);
        await telegramNotify.deleteNotificationUser();
        await telegramNotify.addNotificationUser();
        await telegramNotify.deleteTestMessagesOperationLog();
        await telegramNotify.addGetTelegramAttribute();
        await telegramNotify.saveMessage();
        await use(telegramNotify);
    }
})