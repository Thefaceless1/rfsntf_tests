import {test as base} from '@playwright/test';
import {NotificationsPage} from "../../pages/notifications/NotificationsPage.js";
import {MailPage} from "../../pages/MailPage.js";

type Fixtures = {
    notifications: NotificationsPage,
    adminNotification: NotificationsPage
    mailPage: MailPage
}
export const test = base.extend<Fixtures>({
    notifications : async ({page},use) => {
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
        await mailPage.addMailNotificationAttribute();
        await mailPage.saveMessage();
        await use(mailPage);
        await mailPage.updateAnswerAttribute(false);
    },
    adminNotification : async ({page},use) => {
        const adminNotification = new NotificationsPage(page);
        await adminNotification.deleteNotificationUser();
        await adminNotification.addNotificationUser();
        await adminNotification.login();
        await use(adminNotification);
        await adminNotification.deleteModules();
    },
})