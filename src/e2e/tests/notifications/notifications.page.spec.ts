import {test} from "../../page-objects/helpers/fixtures/fixtures.js";

test.describe("Уведомления",() => {
    test("Сценарий проверки работы с уведомлениями: " +
        "1. Просмотр выбранного уведомления " +
        "2. Перемещение уведомления в корзину " +
        "3. Удаление уведомления " +
        "4. Пометка уведомления как прочитанного " +
        "5. Изменение подписки на уведомления"
        ,async ({notifications}) => {
        await test.step("View selected notification",async () => notifications.viewSelectedNotification());
        await test.step("Move notification to trash",async () => notifications.moveToTrash());
        await test.step("Deleting selected notification",async () => notifications.deleteNotification());
        await test.step("Mark notification as read",async () => notifications.markAsRead());
        await test.step("Changing notification subscriptions",async () => notifications.changeSubscription());
    })
    test("Сценарий проверки администрирования уведомлений: " +
        "1. Добавление модуля " +
        "2. Добавление шаблона уведомлений " +
        "3. Редактирование шаблона уведомлений " +
        "4. Удаление шаблона уведомлений",async ({notifications}) => {
        await test.step("Adding a module",async () => notifications.addModule());
        await test.step("Adding a notification template",async () => notifications.addTemplate());
        await test.step("Editing a notification template",async () => notifications.editTemplate());
        await test.step("Removing a notification template",async () => notifications.deleteTemplate());
    })
})