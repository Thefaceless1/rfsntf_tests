import {test} from "../../page-objects/helpers/fixtures/fixtures.js";
import {InputData} from "../../page-objects/helpers/input-data.js";
import * as Process from "process";
import config from "../../../../playwright.config.js"

test.describe("Уведомления",() => {
    test(`Работа с уведомлениям. Дата запуска: ${InputData.currentDate}, Версия модуля: ${Process.env.APP_VERSION}`
        ,async ({notifications}) => {
        test.info().annotations.push
        (
            {type: "Дата и время запуска",description: `${new Date().toLocaleString()}`},
            {type: "Версия модуля",description: `${Process.env.APP_VERSION}`},
            {type: "Адрес сервера",description: `${config.use?.baseURL}`}
        );

        await test.step(
            "Просмотр выбранного уведомления",
            async () => notifications.viewSelectedNotification()
        );
        await test.step(
            "Перемещение уведомления в корзину",
            async () => notifications.markAsUnread()
        );
        await test.step(
            "Удаление уведомления",
            async () => notifications.markAsRead()
        );
        await test.step(
            "Отметка уведомления как прочитанного",
            async () => notifications.moveToTrash()
        );
        await test.step(
            "Отметка уведомления как непрочитанного",
            async () => notifications.deleteNotification()
        );
        await test.step(
            "Изменение подписки на уведомления",
            async () => notifications.changeSubscription()
        );
    })

    test(`Администрирование уведомлений. Дата запуска: ${InputData.currentDate}, Версия модуля: ${Process.env.APP_VERSION}`,
        async ({notifications}) => {
        test.info().annotations.push
        (
            {type: "Дата и время запуска",description: `${new Date().toLocaleString()}`},
            {type: "Версия модуля",description: `${Process.env.APP_VERSION}`},
            {type: "Адрес сервера",description: `${config.use?.baseURL}`}
        );

        await test.step(
            "Добавление модуля",
            async () => notifications.addModule()
        );
        await test.step(
            "Добавление шаблона уведомлений",
            async () => notifications.addTemplate()
        );
        await test.step(
            "Редактирование шаблона уведомлений",
            async () => notifications.editTemplate()
        );
        await test.step(
            "Удаление шаблона уведомлений",
            async () => notifications.deleteTemplate()
        );
    })
})