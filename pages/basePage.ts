//base page with common methods to inhearit
import { expect, Locator, Page } from "@playwright/test";
const environments = require("../environment.conf");
const currentEnv = process.env.ENVIRONMENT || "testnet";
const baseUrl = environments[currentEnv].baseUrl;
const apiBaseUrl = environments[currentEnv].apiBaseUrl;

console.log("found environment is ", currentEnv);
console.log("get data from environments", baseUrl);

export class BasePage {
  page: Page;
  pageUrl: string;
  connectWalletDialog: { dialogView: Locator; termsOfService: Locator; privcyNotice: Locator; closeButton: Locator; agreementCheckbox: Locator; nearButton: Locator; };
  headerElements: { pagedHeader: Locator; lidoLogo: Locator; stakeLink: Locator; connectWallet: Locator; netIndicator: Locator; switchModeButton: Locator };
  footerElements: { pageFooter: Locator; lidoLogo: Locator; stakeWithLido: Locator; primer: Locator; termsOfUse: Locator; privacyNotice: Locator; FAQ: Locator; pressKit: Locator; twitter: Locator; telegram: Locator; discord: Locator; gitHub: Locator; reddit: Locator; blog: Locator; infoLido: Locator; helpCenter: Locator; };
  darkModeIndicator: Locator;
  nickNameOnHeader: Locator;
  nearAmountOnHeader: Locator;
  pageTitle: Locator;
  stakeSwitcher: Locator;
  unstakeSwitcher: Locator;
  faqSections: { whatIsLidoForNear: Locator; howDoesItWorks: Locator; whatIsLiquidStaking: Locator; whatIsbNear: Locator; whichWalletsDoYouSupport: Locator; howCanIcalculateMyEarnings: Locator; howWillIreceiveRewards: Locator; howDoIunstakeMybNEAR: Locator; howLongWillItTakeToUnstakebNEAR: Locator; howIsLidoSecure: Locator; whatAreTheRisksOfStakingWithLido: Locator; isThereAfeeAppliedByLido: Locator; };
  disconnectButton: Locator;
  apiUrl: string;
  delayedUnstakeSwitcher: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageUrl = baseUrl;
    this.apiUrl = apiBaseUrl;
    this.headerElements = {
      pagedHeader: page.locator("header"),
      lidoLogo: page.locator('header [class^="headerStyles__HeaderLogoStyle"] svg'),
      stakeLink: page.locator('header span:has-text("Stake")').first(),
      connectWallet: page.locator("text=Connect Wallet").first(),
      netIndicator: page.locator("header div:nth-of-type(3) div span"),
      switchModeButton: page.locator(
        "header div:nth-of-type(3) button:nth-of-type(2)"
      ),
    };
    this.nickNameOnHeader = page.locator('header span span div div span:nth-of-type(1)'),
      this.nearAmountOnHeader = page.locator('header span span span span'),
      this.disconnectButton = page.locator('button:has-text("Disconnect")'),

      this.footerElements = {
        pageFooter: page.locator("footer"),
        lidoLogo: page.locator('footer [class^="footerStyles__FooterLogoStyle"] svg'),
        stakeWithLido: page.locator('[href="https://stake.lido.fi/"]'),
        primer: page.locator(
          '[href="https://lido.fi/static/Lido:Ethereum-Liquid-Staking.pdf"]'
        ),
        termsOfUse: page.locator('[href="https://lido.fi/terms-of-use"]'),
        privacyNotice: page.locator('[href="https://lido.fi/privacy-notice"]'),
        FAQ: page.locator('[href="https://lido.fi/faq"]'),
        pressKit: page.locator(
          '[href="https://lido.fi/static/LIDO_press_kit.zip"]'
        ),
        twitter: page.locator('[href="https://twitter.com/lidofinance"]'),
        telegram: page.locator('[href="https://t.me/lidofinance"]'),
        discord: page.locator('[href="https://discord.gg/vgdPfhZ"]'),
        gitHub: page.locator('[href="https://github.com/lidofinance"]'),
        reddit: page.locator('[href="https://www.reddit.com/r/LidoFinance/"]'),
        blog: page.locator('[href="https://blog.lido.fi/"]'),
        infoLido: page.locator('[href="mailto:info@lido.fi"]'),
        helpCenter: page.locator('[href="http://help.lido.fi/"]'),
      };

    this.connectWalletDialog = {
      dialogView: page.locator('[role="dialog"]'),
      termsOfService: page.locator('[role="dialog"] [href="https://lido.fi/terms-of-use"]'),
      privcyNotice: page.locator('[role="dialog"] [href="https://lido.fi/privacy-notice"]'),
      closeButton: page.locator('[role="dialog"] div > button').first(),
      agreementCheckbox: page.locator('text=I have read and accept Terms of Service and Privacy Notice.Near >> svg'),
      nearButton: page.locator('[role="dialog"] div div div:nth-of-type(2) button'),
    };

    this.pageTitle = page.locator('h1:has-text("Stake Near")');
    this.stakeSwitcher = page.locator('main > div > [class^="SwitchStyle__Label"]:nth-of-type(2)')
    this.unstakeSwitcher = page.locator('main > div > [class^="SwitchStyle__Label"]:nth-of-type(3)');
    this.delayedUnstakeSwitcher = page.locator('main > div > div [class^="SwitchStyle__Label"]:nth-of-type(3)');

    this.faqSections = {
      whatIsLidoForNear: page.locator('div[role="button"]:has-text("What is Lido for NEAR?")'),
      howDoesItWorks: page.locator('div[role="button"]:has-text("How does Lido work?")'),
      whatIsLiquidStaking: page.locator('div[role="button"]:has-text("What is liquid staking?")'),
      whatIsbNear: page.locator('div[role="button"]:has-text("What is bNEAR?")'),
      whichWalletsDoYouSupport: page.locator('div[role="button"]:has-text("Which wallets do you support?")'),
      howCanIcalculateMyEarnings: page.locator('div[role="button"]:has-text("How can I calculate my earnings?")'),
      howWillIreceiveRewards: page.locator('div[role="button"]:has-text("How will I receive rewards?")'),
      howDoIunstakeMybNEAR: page.locator('div[role="button"]:has-text("How do I unstake my bNEAR?")'),
      howLongWillItTakeToUnstakebNEAR: page.locator('div[role="button"]:has-text("How long will it take to unstake bNEAR?")'),
      howIsLidoSecure: page.locator('div[role="button"]:has-text("How is Lido secure?")'),
      whatAreTheRisksOfStakingWithLido: page.locator('div[role="button"]:has-text("What are the risks of staking with Lido?")'),
      isThereAfeeAppliedByLido: page.locator('div[role="button"]:has-text("Is there a fee applied by Lido?")')
    }

    this.darkModeIndicator = page.locator('[id="background-gradient"]')
  }

  async validateVisibleElements({ visibleObject }: { visibleObject: Object; }): Promise<void> {
    const typeObj: { [index: string]: any } = visibleObject;
    for (let key in typeObj) {
      await expect(typeObj[key]).toBeVisible();
    }
  }

  async closeModal(): Promise<void> {
    await this.connectWalletDialog.closeButton.click();
  }

  async validateDisconnectUser(): Promise<void> {
    await this.nickNameOnHeader.click();
    await this.disconnectButton.click();
    await expect(this.nickNameOnHeader).toHaveCount(0)
  }


  async checkIsElementDisabled({ element }: { element: Locator; }): Promise<void> {
    const didabledAttribute = await element.getAttribute('disabled');
    expect(didabledAttribute).not.toBe(null)

  }

  async checkUpdateColor({ element, expectedColor }: { element: Locator; expectedColor: string; }): Promise<void> {
    const currentColor = await element.evaluate((element) =>
      window.getComputedStyle(element).getPropertyValue('color'),
    );
    expect(currentColor).toBe(expectedColor)

  }

  async getAmountFromApp(amountLocator: Locator): Promise<number | undefined> {
    const textWithAmount = await amountLocator.textContent({ timeout: 6000 });
    if (textWithAmount === null) { console.log('element has no text'); }
    else {
      if (textWithAmount.includes('=')) {
        const normalizedText = textWithAmount.split("=").pop();
        return Number(normalizedText!.replace(/[^0-9\.]+/g, ""))

      } else return Number(textWithAmount!.replace(/[^0-9\.]+/g, ""))
      
    }

  }

}
