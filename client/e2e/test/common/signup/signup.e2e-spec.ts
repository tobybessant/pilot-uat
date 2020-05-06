import { SignupPage } from "./signup.page";
import { browser } from "protractor";

describe("Create Account", () => {
  let page: SignupPage;

  beforeEach(() => {
    page = new SignupPage();
  });

  it("should have page title be 'Pilot'", async () => {
    page.get();
    expect(await page.title()).toBe("Pilot");
  });

  it("should have the navbar heading read 'Pilot'", async () => {
    page.get();
    expect(await page.getNavHeading()).toBe("Pilot");
  });

  it("should have an input for the first name", async () => {
    page.get();
    page.getFirstNameField();
  });

  it("should have an input for the last name", async () => {
    page.get();
    page.getLastNameField();
  });

  it("should have an input for the orginisation", async () => {
    page.get();
    page.getOrganisationField();
  });

  it("should have an input for the email", async () => {
    page.get();
    page.getEmailField();
  });

  it("should have an input for the password", async () => {
    page.get();
    page.getPasswordField();
  });

  describe("Login redirect link", async () => {
    it("should be present on the login page", async () => {
      page.get();
      page.getLoginRedirect();
    });

    it("should navigate to the login page", async () => {
      page.get();
      await (await page.getLoginRedirect()).click();
      await browser.waitForAngular();

      expect(await browser.getCurrentUrl()).toEqual(browser.baseUrl + "login");
    });
  });
});
