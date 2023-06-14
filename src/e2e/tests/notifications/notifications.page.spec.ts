import {test} from "../../page-objects/helpers/fixtures/fixtures.js";
import {InputData} from "../../page-objects/helpers/input-data.js";

test.describe("Уведомления",() => {
    test(`Работа с уведомлениям. Дата запуска: ${InputData.currentDate}, Версия модуля: ${InputData.moduleVersion}`
        ,async ({notifications}) => {
        await test.step("Просмотр выбранного уведомления",async () => notifications.viewSelectedNotification());
        await test.step("Перемещение уведомления в корзину",async () => notifications.moveToTrash());
        await test.step("Удаление уведомления",async () => notifications.deleteNotification());
        await test.step("Отметка уведомления как прочитанного",async () => notifications.markAsRead());
        await test.step("Отметка уведомления как непрочитанного",async () => notifications.markAsUnread());
        await test.step("Изменение подписки на уведомления",async () => notifications.changeSubscription());
    })
    test(`Администрирование уведомлений. Дата запуска: ${InputData.currentDate}, Версия модуля: ${InputData.moduleVersion}`,
        async ({notifications}) => {
        await test.step("Добавление модуля",async () => notifications.addModule());
        await test.step("Добавление шаблона уведомлений",async () => notifications.addTemplate());
        await test.step("Редактирование шаблона уведомлений",async () => notifications.editTemplate());
        await test.step("Удаление шаблона уведомлений",async () => notifications.deleteTemplate());
    })
})