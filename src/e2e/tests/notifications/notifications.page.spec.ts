import {test} from "../../page-objects/helpers/fixtures/fixtures.js";

test.describe("Уведомления",() => {
    test("Сценарий проверки работы с уведомлениями: " +
        "1. Просмотр выбранного уведомления " +
        "2. Перемещение уведомления в корзину " +
        "3. Удаление уведомления " +
        "4. Отметка уведомления как прочитанного " +
        "5. Отметка уведомления как непрочитанного " +
        "6. Изменение подписки на уведомления"
        ,async ({notifications}) => {
        await test.step("Просмотр выбранного уведомления",async () => notifications.viewSelectedNotification());
        await test.step("Перемещение уведомления в корзину",async () => notifications.moveToTrash());
        await test.step("Удаление уведомления",async () => notifications.deleteNotification());
        await test.step("Отметка уведомления как прочитанного",async () => notifications.markAsRead());
        await test.step("Отметка уведомления как непрочитанного",async () => notifications.markAsUnread());
        await test.step("Изменение подписки на уведомления",async () => notifications.changeSubscription());
    })
    test("Сценарий проверки администрирования уведомлений: " +
        "1. Добавление модуля " +
        "2. Добавление шаблона уведомлений " +
        "3. Редактирование шаблона уведомлений " +
        "4. Удаление шаблона уведомлений",async ({notifications}) => {
        await test.step("Добавление модуля",async () => notifications.addModule());
        await test.step("Добавление шаблона уведомлений",async () => notifications.addTemplate());
        await test.step("Редактирование шаблона уведомлений",async () => notifications.editTemplate());
        await test.step("Удаление шаблона уведомлений",async () => notifications.deleteTemplate());
    })
})