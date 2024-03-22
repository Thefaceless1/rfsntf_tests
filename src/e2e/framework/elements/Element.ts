import {Locator, Page} from "@playwright/test";

export class Element {
    /**
     * Get a page element
     */
    public static getElement(page: Page, selector: string): Locator {
        return page.locator(selector);
    }
    /**
     * Wait for element visibility
     */
    public static async waitForVisible(element: Locator): Promise<void> {
        await element.waitFor({state: "visible"});
    }
    /**
     * Wait for an element to be invisible
     */
    public static async waitForHidden(element: Locator): Promise<void> {
        await element.waitFor({state: "hidden"});
    }
}