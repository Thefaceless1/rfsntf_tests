import {test} from "../../page-objects/helpers/fixtures/fixtures.js";
import {InputData} from "../../page-objects/helpers/InputData.js";
import * as Process from "process";
import config from "../../../../playwright.config.js"

test.describe("Уведомления в Телеграм",() => {
    test(`Дата запуска: ${InputData.currentDate}, Версия модуля: ${Process.env.APP_VERSION}`
        ,async ({telegramNotify}) => {
            test.info().annotations.push
            (
                {type: "Дата и время запуска",description: InputData.testAnnotationDate},
                {type: "Версия модуля",description: `${Process.env.APP_VERSION}`},
                {type: "Адрес сервера",description: `${config.use?.baseURL}`}
            );

            await test.step(
                "Отправка уведомления в мессенджер Телеграм",
                async () => telegramNotify.checkTelegramMessageSending()
            );
        })
})