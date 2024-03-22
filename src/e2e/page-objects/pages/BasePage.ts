import {PlaywrightDevPage} from "../../framework/helpers/PlaywrightDevPage.js";
import {Locator, Page} from "@playwright/test";
import {Element} from "../../framework/elements/Element.js";

export class BasePage extends PlaywrightDevPage{
    protected prolicenseName: string
    constructor(page: Page) {
        super(page)
        this.prolicenseName = ''
    }
    /**
     * Field "Comment"
     */
    protected comment: Locator = Element.getElement(this.page,"//textarea[@name='comment']")
    /**
     * Button "Delete"
     */
    protected deleteButton: Locator = Element.getElement(this.page,"//button[text()='Удалить']")
    /**
     * Button "Delete" in a table
     */
    protected deleteTableButton: Locator = Element.getElement(this.page,"//span[contains(@class,'IconTrash')]")
    /**
     * Field "Name"
     */
    protected name: Locator = Element.getElement(this.page,"//input[@name='name']")
    /**
     * Button "Add"
     */
    protected addButton: Locator = Element.getElement(this.page,"//button[text()='Добавить']")
    /**
     * Field "Description"
     */
    protected description: Locator = Element.getElement(this.page,"//*[@name='description' or @placeholder='Описание' or @placeholder='Введите описание']")
    /**
     * Button "Save"
     */
    protected saveButton: Locator = Element.getElement(this.page,"//button[text()='Сохранить']")
    /**
     * Checkboxes
     */
    public checkbox: Locator = Element.getElement(this.page,"//input[@type='checkbox' and not(@disabled) and not(contains(@name,'isGetNotify'))]")
    /**
     * Get notification by text
     */
    public notification(text: string): Locator {
        return Element.getElement(this.page,`//*[text()='${text}']`).last();
    }
}