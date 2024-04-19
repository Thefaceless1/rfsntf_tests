import {test} from "../../page-objects/helpers/fixtures/fixtures.js";
import {InputData} from "../../page-objects/helpers/InputData.js";
import * as Process from "process";
import config from "../../../../playwright.config.js"

test.describe("Администрирование уведомлений",() => {
    test(`Дата запуска: ${InputData.currentDate}, Версия модуля: ${Process.env.APP_VERSION}`,
        async ({adminNotification}) => {
            test.info().annotations.push
            (
                {type: "Дата и время запуска",description: InputData.testAnnotationDate},
                {type: "Версия модуля",description: `${Process.env.APP_VERSION}`},
                {type: "Адрес сервера",description: `${config.use?.baseURL}`}
            );

            await test.step(
                "Добавление модуля",
                async () => adminNotification.addModule()
            );
            await test.step(
                "Добавление шаблона уведомлений",
                async () => adminNotification.addTemplate()
            );
            await test.step(
                "Редактирование шаблона уведомлений",
                async () => adminNotification.editTemplate()
            );
            await test.step(
                "Удаление шаблона уведомлений",
                async () => adminNotification.deleteTemplate()
            );
        })
})