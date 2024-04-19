import {Page} from "@playwright/test";
import {MailNotify} from "../helpers/MailNotify.js";

export class MainPage extends MailNotify {
    constructor(page: Page) {
        super(page);
    }
}