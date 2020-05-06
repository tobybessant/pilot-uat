import { browser } from "protractor";
import { By, WebElementPromise } from "selenium-webdriver";
import { NavElement } from "../../../utils/elements/nav.page";

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

  public getLoginButton(): WebElementPromise {
    return browser.findElement(By.css(".buttons button:first-child"));
  }

  public async login(email: string, password: string): Promise<void> {
    this.getEmailInput().sendKeys(email);
    this.getPasswordInput().sendKeys(email);

    // await this.getLoginButton().click();
  }
}
