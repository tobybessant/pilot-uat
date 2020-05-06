import { browser, ElementFinder } from "protractor";
import { By, WebElement, WebElementPromise } from "selenium-webdriver";
import { NavElement } from "../../elements/nav.page";

export class LoginPage {
  public static readonly PAGE_URN: string = "login";
  private navElement = new NavElement();

  public async get(): Promise<any> {
    return browser.get(browser.baseUrl + LoginPage.PAGE_URN);
  }

  public async title(): Promise<string> {
    return browser.getTitle();
  }

  public async getNavHeading(): Promise<string> {
    return this.navElement.getNavHeadingText();
  }

  public getEmailInput(): WebElementPromise {
    return browser.findElement(By.css(".form-inputs input:first-child"));
  }

  public getPasswordInput(): WebElementPromise {
    return browser.findElement(By.css(".form-inputs input[type=password]"));
  }

  public getCreateAccountRedirect(): WebElementPromise {
    return browser.findElement(By.linkText("here"));
  }
}
