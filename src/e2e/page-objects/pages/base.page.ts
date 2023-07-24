import {PlaywrightDevPage} from "../../framework/helpers/playwright-dev-page.js";
import {Locator, Page} from "@playwright/test";
import {Elements} from "../../framework/elements/elements.js";

export class BasePage extends PlaywrightDevPage{
    protected prolicenseName: string
    constructor(page: Page) {
        super(page)
        this.prolicenseName = ''
    }
    /**
     * Field "Comment"
     */
    protected comment: Locator = Elements.getElement(this.page,"//textarea[@name='comment']")
    /**
     * Button "Delete"
     */
    protected get deleteButton(): Locator {
        return Elements.getElement(this.page,"//button[text()='Удалить']");
    }
    /**
     * Button "Delete" in a table
     */
    protected get deleteTableButton(): Locator {
        return Elements.getElement(this.page,"//span[contains(@class,'IconTrash')]");
    }
    /**
     * Field "Name"
     */
    protected get name(): Locator {
        return Elements.getElement(this.page,"//input[@name='name']");
    }
    /**
     * Button "Add"
     */
    protected get addButton(): Locator {
        return Elements.getElement(this.page,"//button[text()='Добавить']");
    }
    /**
     * Field "Description"
     */
    protected get description(): Locator {
        return Elements.getElement(this.page,"//*[@name='description' or @placeholder='Описание' or @placeholder='Введите описание']");
    }
    /**
     * Button "Save"
     */
    protected get saveButton(): Locator {
        return Elements.getElement(this.page,"//button[text()='Сохранить']");
    }
    /**
     * Checkboxes
     */
    public get checkbox(): Locator {
        return Elements.getElement(this.page,"//input[@type='checkbox' and not(@disabled) and not(contains(@name,'isGetNotify'))]");
    }
    /**
     * Get notification by text
     */
    public notification(text: string): Locator {
        return Elements.getElement(this.page,`//*[text()='${text}']`).last();
    }
}