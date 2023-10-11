import {test as base} from '@playwright/test';
import {NotificationsPage} from "../../pages/notifications/notifications.page.js";
import * as Process from "process";

type Fixtures = {
    notifications: NotificationsPage
}
export const test = base.extend<Fixtures>({
    notifications : async ({page},use) => {
        const notification = new NotificationsPage(page);
        await notification.deleteNotificationUser();
        await notification.addNotificationUser();
        await notification.login()
        await use(notification);
        await notification.deleteModules();
    }
})