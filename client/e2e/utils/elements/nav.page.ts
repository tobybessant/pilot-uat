import { browser } from "protractor";
import { By } from "selenium-webdriver";

export class NavElement {
  public async getNavHeadingText(): Promise<string> {
    return browser.findElement(By.css("app-nav h3")).getText();
  }
}
