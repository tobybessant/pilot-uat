import { LoginPage } from "./login.page";
import { browser } from "protractor";

describe("Login", () => {
  let page: LoginPage;

  beforeEach(() => {
    page = new LoginPage();
  });

  it("should have page title be 'Pilot'", async () => {
    page.get();
    expect(await page.title()).toBe("Pilot");
  });

  it("should have the navbar heading read 'Pilot'", async () => {
    page.get();
    expect(await page.getNavHeading()).toBe("Pilot");
  });

  it("should have a text input for the email", async () => {
    page.get();
    page.getEmailInput();
  });

  it("should have a text input for the password", async () => {
    page.get();
    page.getPasswordInput();
  });

  describe("Signup redirect link", async () => {
    it("should be present on the login page", async () => {
      page.get();
      page.getCreateAccountRedirect();
    });

    it("should navigate to the signup page", async () => {
      page.get();
      await (await page.getCreateAccountRedirect()).click();
      await browser.waitForAngular();

      expect(await browser.getCurrentUrl()).toEqual(browser.baseUrl + "signup");
    });
  });
});
