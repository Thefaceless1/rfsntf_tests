import {test} from "../../page-objects/helpers/fixtures/fixtures.js";
import {InputData} from "../../page-objects/helpers/InputData.js";
import * as Process from "process";
import config from "../../../../playwright.config.js"

test.describe("Работа с уведомлениям",() => {
    test(`Дата запуска: ${InputData.currentDate}, Версия модуля: ${Process.env.APP_VERSION}`
        ,async ({notifications}) => {
        test.info().annotations.push
        (
            {type: "Дата и время запуска",description: InputData.testAnnotationDate},
            {type: "Версия модуля",description: `${Process.env.APP_VERSION}`},
            {type: "Адрес сервера",description: `${config.use?.baseURL}`}
        );

        await test.step(
            "Просмотр выбранного уведомления",
            async () => notifications.viewSelectedNotification()
        );
        await test.step(
            "Отметка уведомления как непрочитанного",
            async () => notifications.markAsUnread()
        );
        await test.step(
            "Отметка уведомления как прочитанного",
            async () => notifications.markAsRead()
        );
        await test.step(
            "Перемещение уведомления в корзину",
            async () => notifications.moveToTrash()
        );
        await test.step(
            "Удаление уведомления",
            async () => notifications.deleteNotification()
        );
        await test.step(
            "Изменение подписки на уведомления(push, email, telegram)",
            async () => notifications.changeSubscription()
        );
    })
})