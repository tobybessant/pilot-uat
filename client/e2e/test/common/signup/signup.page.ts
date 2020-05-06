import { browser } from "protractor";
import { By, WebElementPromise } from "selenium-webdriver";
import { NavElement } from "../../elements/nav.page";

export class SignupPage {
  public static readonly PAGE_URN: string = "signup";
  private navElement = new NavElement();


  public async get(): Promise<any> {
    return browser.get(browser.baseUrl + SignupPage.PAGE_URN);
  }

  public async title(): Promise<string> {
    return browser.getTitle();
  }

  public async getNavHeading(): Promise<string> {
    return this.navElement.getNavHeadingText();
  }

  public getLoginRedirect(): WebElementPromise {
    return browser.findElement(By.linkText("here"));
  }

  public getFirstNameField(): any {
    return browser.findElement(By.css(".name-fields:first-child"));
  }

  public getLastNameField(): any {
    return browser.findElement(By.css(".name-fields input:nth-child(2)"));
  }

  public getOrganisationField(): any {
    return browser.findElement(By.css(".form-inputs > input:nth-child(2)"));
  }

  public getEmailField(): any {
    return browser.findElement(By.css(".form-inputs > input:nth-child(3)"));
  }

  public getPasswordField(): any {
    return browser.findElement(By.css(".form-inputs > input[type=password]"));
  }
}
