import {test} from "../../page-objects/helpers/fixtures/fixtures.js";
import {InputData} from "../../page-objects/helpers/InputData.js";
import * as Process from "process";
import config from "../../../../playwright.config.js"

test.describe("Почтовые уведомления",() => {
    test(`Дата запуска: ${InputData.currentDate}, Версия модуля: ${Process.env.APP_VERSION}`
        ,async ({mailPage}) => {
            test.info().annotations.push
            (
                {type: "Дата и время запуска",description: InputData.testAnnotationDate},
                {type: "Версия модуля",description: `${Process.env.APP_VERSION}`},
                {type: "Адрес сервера",description: `${config.use?.baseURL}`}
            );

            await test.step(
                "Проверка наличия отправленного уведомления на почте",
                async () => mailPage.waitingIncomingMessage()
            );
            await test.step(
                "Ответ на входящее сообщение",
                async () => mailPage.replyToMessage()
            );
        })
})