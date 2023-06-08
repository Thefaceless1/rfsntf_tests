import {test as base} from '@playwright/test';
import {NotificationsPage} from "../../pages/notifications/notifications.page.js";
import * as Process from "process";

type Fixtures = {
    notifications : NotificationsPage
}
export const test = base.extend<Fixtures>({
    notifications : async ({page},use) => {
        const notification = new NotificationsPage(page);
        if (Process.env.BRANCH != "prod") await notification.checkNotificationUser();
        await notification.login()
        await use(notification);
    }
})