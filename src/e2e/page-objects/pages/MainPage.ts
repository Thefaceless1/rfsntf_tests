import {Page} from "@playwright/test";
import {AuthPage} from "./AuthPage.js";

export class MainPage extends AuthPage {
    constructor(page: Page) {
        super(page);
    }
}