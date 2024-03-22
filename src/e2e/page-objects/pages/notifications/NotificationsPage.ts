import {MainPage} from "../MainPage.js";
import {expect, Locator, Page} from "@playwright/test";
import {Element} from "../../../framework/elements/Element.js";
import {DbHelper} from "../../../../db/DbHelper.js";
import {Notification} from "../../helpers/enums/Notification.js";
import {InputData} from "../../helpers/InputData.js";
import {randomInt} from "crypto";

export class NotificationsPage extends MainPage {
    private readonly moduleName: string = InputData.randomWord;
    private templateName: string = InputData.randomWord;
    constructor(page: Page) {
        super(page);
    }
    /**
     * Checkbox Prevent disabling Push notifications
     */
    private isSubscribeLockCheckBox: Locator = Element.getElement(this.page,"//input[contains(@name,'isSubscribeLock')]")
    /**
     * Checkbox Prevent disabling email notifications
     */
    private isEmailSubscribeLockCheckBox: Locator = Element.getElement(this.page,"//input[contains(@name,'isEmailSubscribeLock')]")
    /**
     * Checkbox Prevent disabling email notifications
     */
    private isTelegramSubscribeLockCheckBox: Locator = Element.getElement(this.page,"//input[contains(@name,'isTelegramSubscribeLock')]")
    /**
     * Checkbox IsActive
     */
    private isActiveCheckBox: Locator = Element.getElement(this.page,"//input[contains(@name,'isActive')]")
    /**
     * Checkbox CanAnswer
     */
    private canAnswerCheckBox: Locator = Element.getElement(this.page,"//input[contains(@name,'canAnswer')]")
    /**
     * Checkbox Periodic
     */
    private typeIsPeriodicCheckBox: Locator = Element.getElement(this.page,"//input[contains(@name,'typeIsPeriodic')]")
    /**
     * Button "Subscription to notifications"
     */
    private subscriptionNotificationButton: Locator = Element.getElement(this.page,"//span[text()='Подписка на уведомления']")
    /**
     * Message text
     */
    private messageText: Locator = Element.getElement(this.page,"//*[contains(@class,'NotificationInfoPage_message')]")
    /**
     * Column "Date and time created"
     */
    private createdDateColumn: Locator = Element.getElement(this.page,"//td[@class='ant-table-cell'][3]")
    /**
     * Column "Notification"
     */
    private notificationsColumn: Locator = Element.getElement(this.page,"//td[@class='ant-table-cell'][2]//div//a")
    /**
     * Button "Delete selected"
     */
    private deleteSelectedButton: Locator = Element.getElement(this.page,"//span[text()='Удалить выбранные']")
    /**
     * Button "Delete from trash"
     */
    private deleteFromTrashButton: Locator = Element.getElement(this.page,"//span[text()='Удалить из корзины']")
    /**
     * Button "Deleted notifications"
     */
    private deletedNotificationsButton: Locator = Element.getElement(this.page,"//span[text()='Удаленные уведомления']")
    /**
     * Button "Delete without recovery"
     */
    private deleteWithoutRecoveryButton: Locator = Element.getElement(this.page,"//button[text()='Удалить без восстановления']")
    /**
     * Button "Mark as read"
     */
    private markAsReadButton: Locator = Element.getElement(this.page,"//span[text()='Отметить как прочитанные']")
    /**
     * Button "Mark as unread"
     */
    private markAsUnreadButton: Locator = Element.getElement(this.page,"//span[text()='Отметить как непрочитанные']")
    /**
     * Read message
     */
    private readMessage: Locator = Element.getElement(this.page,"//a//*[contains(@class,'Text_view_secondary')]")
    /**
     * Button "Administration"
     */
    private administrationButton: Locator = Element.getElement(this.page,"//span[text()='Администрирование']")
    /**
     * Button "Navigation menu"
     */
    private navigationMenuButton: Locator = Element.getElement(this.page,"//*[contains(@class,'Navbar_menuButton')]//button")
    /**
     * Button "Close navigation menu"
     */
    private closeMenuButton: Locator = Element.getElement(this.page,"//*[contains(@class,'ant-drawer-close')]//button")
    /**
     * Field "Select module"
     */
    private selectModule: Locator = Element.getElement(this.page,"//*[contains(@class,'module__control')]")
    /**
     * Button "Notification template management"
     */
    private manageTemplateButton: Locator = Element.getElement(this.page,"//li[contains(@data-menu-id,'template')]")
    /**
     * Button "Module editor"
     */
    private moduleEditButton: Locator = Element.getElement(this.page,"//li[contains(@data-menu-id,'modules')]")
    /**
     * Button "Add template"
     */
    private addTemplateButton: Locator = Element.getElement(this.page,"//button[text()='Добавить шаблон']")
    /**
     * Field "Code"
     */
    private code: Locator = Element.getElement(this.page,"//input[@placeholder='Введите код']")
    /**
     * Field "Title"
     */
    private title: Locator = Element.getElement(this.page,"//input[@placeholder='Введите заголовок']")
    /**
     * Field "Template text"
     */
    private templateText: Locator = Element.getElement(this.page,"//textarea[contains(@placeholder,'Введите текст шаблона')]")
    /**
     * Field "Period"
     */
    private period: Locator = Element.getElement(this.page,"//input[contains(@name,'period')]")
    /**
     * Button "Add module"
     */
    private addModuleButton: Locator = Element.getElement(this.page,"//button[text()='Добавить модуль']")
    /**
     * Get module by name
     */
    private getModuleByName(moduleName: string): Locator {
        return Element.getElement(this.page,`//td[text()='${moduleName}']`);
    }
    /**
     * Get template by name
     */
    private getTemplateByName(templateName: string): Locator {
        return Element.getElement(this.page,`//textarea[contains(@name,'title') and text()='${templateName}']`);
    }
    /**
     * Dropdown values of field "Select module"
     */
    private moduleValue(moduleName: string): Locator {
        return Element.getElement(this.page,`//*[contains(@class,'module__option') and text()='${moduleName}']`);
    }
    /**
     * Open selected notification
     */
    public async viewSelectedNotification(): Promise<void> {
        await Element.waitForVisible(this.createdDateColumn.first());
        await this.notificationsColumn.first().click();
        await expect(this.messageText).toBeVisible();
        await this.page.goBack();
    }
    /**
     * Move to trash notification
     */
    public async moveToTrash(): Promise<void> {
        await Element.waitForVisible(this.createdDateColumn.first());
        await this.checkbox.nth(1).click();
        await this.deleteSelectedButton.click();
        await this.deletedNotificationsButton.click();
        await Element.waitForVisible(this.createdDateColumn.first());
        await expect(this.notification(Notification.movedToTrash)).toBeVisible();
    }
    /**
     * Delete notification
     */
    public async deleteNotification(): Promise<void> {
        await this.checkbox.nth(1).click();
        await this.deleteFromTrashButton.click();
        await this.deleteWithoutRecoveryButton.click();
        await expect(this.notification(Notification.deletedFromTrash)).toBeVisible();
    }
    /**
     * Mark notification as read
     */
    public async markAsRead(): Promise<void> {
        await this.checkbox.nth(1).click();
        await this.markAsReadButton.click();
        await expect(this.notification(Notification.markedAsRead)).toBeVisible();
        await expect(this.readMessage).toBeVisible();
    }
    /**
     * Mark notification as unread
     */
    public async markAsUnread(): Promise<void> {
        await this.checkbox.nth(1).click();
        await this.markAsUnreadButton.click();
        await expect(this.notification(Notification.markedAsUnread)).toBeVisible();
    }
    /**
     * Changing notification subscriptions
     */
    public async changeSubscription(): Promise<void> {
        await this.page.goBack();
        await this.subscriptionNotificationButton.click();
        await Element.waitForVisible(this.checkbox.first());
        const enabledCheckboxCount: number = await this.checkbox.count();
        for(let i = 1; i < enabledCheckboxCount; i++) {
            if(i%2 != 0) await this.checkbox.nth(i).click();
        }
        await this.saveButton.click();
        await expect(this.notification(Notification.subscriptionChanged)).toBeVisible();
    }
    /**
     * User validation for notification module:
     * 1. Create the user if he doesn't exist
     * 2. Set admin role if the user has a different role
     */
    public async addNotificationUser(): Promise<void> {
        const dbHelper = new DbHelper();
        await dbHelper.insertUser(this.userId);
        await dbHelper.closeConnect();
    }
    /**
     * Delete user from notification module
     */
    public async deleteNotificationUser(): Promise<void> {
        const dbHelper = new DbHelper();
        await dbHelper.deleteUser(this.userId);
        await dbHelper.closeConnect();
    }
    /**
     * Delete created modules
     */
    public async deleteModules(): Promise<void> {
        const dbHelper = new DbHelper();
        await dbHelper.deleteModule();
        await dbHelper.closeConnect();
    }
    /**
     * Navigate to the notification template management page
     */
    private async navigateTo(target: "manageTemplates" | "moduleEditor"): Promise<void> {
        await this.navigationMenuButton.click();
        try {
            await this.administrationButton.click();
        }
        catch (err) {
            await this.navigationMenuButton.click();
            await this.administrationButton.click();
        }
        await Element.waitForVisible(this.manageTemplateButton);
        (target == "manageTemplates") ?
            await this.manageTemplateButton.click() :
            await this.moduleEditButton.click();
        await this.closeMenuButton.click();
    }
    /**
     * Add a module
     */
    public async addModule(): Promise<void> {
        await this.navigateTo("moduleEditor");
        await this.addModuleButton.click();
        await this.name.type(this.moduleName);
        await this.description.type(InputData.randomWord);
        await this.addButton.click();
        await expect(this.getModuleByName(this.moduleName)).toBeVisible();
    }
    /**
     * Add a notification template
     */
    public async addTemplate(): Promise<void> {
        await this.navigateTo("manageTemplates");
        await this.selectModule.click();
        await Element.waitForVisible(this.moduleValue(this.moduleName));
        await this.moduleValue(this.moduleName).click();
        await this.addTemplateButton.click();
        await this.code.type(InputData.randomWord);
        await this.title.type(this.templateName);
        await this.description.type(InputData.randomWord);
        await this.templateText.type(InputData.randomWord);
        await this.clickOnTemplateCheckBoxes();
        const periodicTime: string = String(randomInt(0, 100));
        await this.period.type(periodicTime);
        await this.addButton.click();
        await Element.waitForHidden(this.addButton);
        await expect(this.getTemplateByName(this.templateName)).toBeVisible();
        await expect(this.isSubscribeLockCheckBox).toBeChecked();
        await expect(this.isEmailSubscribeLockCheckBox).toBeChecked();
        await expect(this.isTelegramSubscribeLockCheckBox).toBeChecked();
        await expect(this.isActiveCheckBox).toBeChecked();
        await expect(this.canAnswerCheckBox).toBeChecked();
        await expect(this.typeIsPeriodicCheckBox).toBeChecked();
        await expect(this.period).toHaveValue(periodicTime);
    }
    /**
     * Edit a notification template
     */
    public async editTemplate(): Promise<void> {
        const newTemplateName: string = InputData.randomWord;
        await this.getTemplateByName(this.templateName).fill(newTemplateName);
        this.templateName = newTemplateName;
        await this.clickOnTemplateCheckBoxes();
        await this.saveButton.click();
        await expect(this.getTemplateByName(this.templateName)).toBeVisible();
        await expect(this.isSubscribeLockCheckBox).not.toBeChecked();
        await expect(this.isEmailSubscribeLockCheckBox).not.toBeChecked();
        await expect(this.isTelegramSubscribeLockCheckBox).not.toBeChecked();
        await expect(this.isActiveCheckBox).not.toBeChecked();
        await expect(this.canAnswerCheckBox).not.toBeChecked();
        await expect(this.typeIsPeriodicCheckBox).not.toBeChecked();
    }
    /**
     * Click on template checkboxes
     */
    private async clickOnTemplateCheckBoxes(): Promise<void> {
        await this.isSubscribeLockCheckBox.click();
        await this.isEmailSubscribeLockCheckBox.click();
        await this.isTelegramSubscribeLockCheckBox.click();
        await this.isActiveCheckBox.click();
        await this.canAnswerCheckBox.click();
        await this.typeIsPeriodicCheckBox.click();
    }
    /**
     * Delete a template
     */
    public async deleteTemplate(): Promise<void> {
        await this.deleteTableButton.click();
        await this.deleteButton.click();
        await Element.waitForHidden(this.deleteButton);
        await expect(this.getTemplateByName(this.templateName)).not.toBeVisible;
    }
}