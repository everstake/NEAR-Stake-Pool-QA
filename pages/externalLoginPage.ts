import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./basePage";
import { UserType} from "../consts"

const environments = require("../environment.conf");
const currentEnv = process.env.ENVIRONMENT || "testnet";
const  retailUserSeed= process.env.RETAILWALLETRECOVER || "";
const  investorSeed= process.env.INVESTORWALLETRECOVER || "";


export class ExternalLoginPage extends BasePage {
  page: Page;
  loginRedirectUrl: string;
  importAccountButton: Locator;
  recoverAccountUrl: string;
  recoverAccountWithPassphraseButton: Locator;
  recoverSeedPhraseUrl: string;
  seedPhraseRecoveryInput: Locator;
  seedPhraseRecoverySubmitButton: Locator;
  nextButton: Locator;
  connectButton: Locator;
  createAccountButton: Locator;
  createAccountInput: Locator;
  reserveAccountButton: Locator;
  

  constructor(page: Page) {
    super(page);
    this.page = page;
    (this.loginRedirectUrl =
      "https://wallet.testnet.near.org/login/?success_url=https%3A%2F%2Fnear-staking.vercel.app%2F&failure_url=https%3A%2F%2Fnear-staking.vercel.app%2F"),
      (this.importAccountButton = page.locator(
        '[data-test-id="homePageImportAccountButton"]'
      )),
      (this.createAccountButton = page.locator(
        '[data-test-id="landingPageCreateAccount"]'
      )),
      (this.createAccountInput = page.locator(
        '[data-test-id="createAccount.accountIdInput"]'
      )),
      (this.reserveAccountButton = page.locator(
        '[data-test-id="reserveAccountIdButton"]'
      )),
      (this.recoverAccountUrl =
        "https://wallet.testnet.near.org/recover-account"),
      (this.recoverAccountWithPassphraseButton = page.locator(
        '[data-test-id="recoverAccountWithPassphraseButton"]'
      )),
      (this.recoverSeedPhraseUrl =
        "https://wallet.testnet.near.org/recover-seed-phrase"),
      (this.seedPhraseRecoveryInput = page.locator(
        '[data-test-id="seedPhraseRecoveryInput"]'
      )),
      (this.seedPhraseRecoverySubmitButton = page.locator(
        '[data-test-id="seedPhraseRecoverySubmitButton"]'
      )),
      (this.nextButton = page.locator("text=Next")),
      (this.connectButton = page.locator('button:has-text("Connect")'));
  }

  async connectExistingWallet(userType: UserType): Promise<void> {
    const walletRecoverSeed = userType === UserType.Retail ? retailUserSeed : investorSeed;    
    await this.headerElements.connectWallet.click();
    await this.connectWalletDialog.agreementCheckbox.click();
    await this.connectWalletDialog.nearButton.click();
    await this.importAccountButton.click();
    await this.recoverAccountWithPassphraseButton.click();
    await this.seedPhraseRecoveryInput.click();
    await this.seedPhraseRecoveryInput.fill(walletRecoverSeed);
    await this.seedPhraseRecoverySubmitButton.click();
    await this.nextButton.click();
    await Promise.all([
      this.page.waitForNavigation(),
      this.connectButton.click(),
    ]);
    await expect(this.nickNameOnHeader).toHaveCount(1);
  }
}
