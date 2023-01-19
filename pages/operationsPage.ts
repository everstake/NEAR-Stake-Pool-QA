import { expect, Locator, Page, request } from "@playwright/test";
import { UserType, UnstakeType } from "../consts"
import { BasePage } from "./basePage";
const environments = require("../environment.conf");
const currentEnv = process.env.ENVIRONMENT || "testnet";


export class OperationsPage extends BasePage {
  page: Page;
  amountInput: Locator;
  maxButton: Locator;
  stakeMode: { pagedHeader: Locator; nearLogo: Locator };
  submitButton: Locator;
  youWillReceive: Locator;
  exchangeRate: Locator;
  stakingRewardsFee: Locator;
  approveButton: Locator;
  unstakeMode: { pagedHeader: Locator; nearLogo: Locator };
  connectWalletButton: Locator;
  errorMessage: Locator;
  errorMessageIndicator: Locator;
  userNearBalanceOnCalculator: Locator;
  cancelButton: any;
  RETAILNICKNAMEOnCalculator: Locator;
  userStakedBalanceInStNear: Locator;
  userStakedBalanceInNear: Locator;
  investorModeCheckbox: Locator;
  selectValidator: Locator;
  firstValidator: Locator;
  completeTransactionDialogClose: Locator;
  instantUnstakeFee: Locator;
  userAwaitingUnbonding: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.stakeMode = {
      pagedHeader: page.locator('h3:has-text("Stake")'),
      nearLogo: page.locator(
        '[src^="data:image/svg+xml;base64,PD94bWwgdmVyc"]'
      ),
    };
    this.unstakeMode = {
      pagedHeader: page.locator('h3:has-text("Unstake")'),
      nearLogo: page.locator('[src^="data:image/svg+xml;base64,PHN2ZyB"]'),
    };
    this.amountInput = page.locator('form input[name="amount"]');
    this.investorModeCheckbox = page.locator('form div:nth-of-type(1) label:nth-of-type(2)');
    this.selectValidator = page.locator('form input[placeholder=" "]');
    this.firstValidator = page.locator('[role="listbox"] button:nth-of-type(1)');
    this.maxButton = page.locator('form button:has-text("MAX")');
    this.submitButton = page.locator('button:has-text("Submit")');
    this.userNearBalanceOnCalculator = page.locator(('div [class^="walletCardStyles__WalletCardValueStyle"] > span')).first()
    this.userStakedBalanceInStNear = page.locator(('[class^="walletCardStyles__WalletCardRowStyle"]:nth-of-type(3) [class^="walletCardStyles__WalletCardValueStyle-sc"] > div > span'))
    this.userStakedBalanceInNear = page.locator(('[class^="walletCardStyles__WalletCardRowStyle"]:nth-of-type(3) [class^="walletCardStyles__WalletCardValueStyle-sc"] > div div span'))
    this.userAwaitingUnbonding = page.locator(('//*[text() = "Awaiting Unbonding"]/parent::div/div/span'))
    this.youWillReceive = page.locator(
      'main > div [class^="FormStyles__FormWrapper"] > div div:nth-of-type(1) div:nth-of-type(2)'
    );
    this.exchangeRate = page.locator(
      'main > div [class^="FormStyles__FormWrapper"] > div div:nth-of-type(2) div:nth-of-type(2)'
    );
    this.stakingRewardsFee = page.locator(
      'main > div [class^="FormStyles__FormWrapper"] > div div:nth-of-type(3) div:nth-of-type(2)'
    );

    this.instantUnstakeFee = page.locator(
      'main > div [class^="FormStyles__FormWrapper"] > div div:nth-of-type(3) div:nth-of-type(2)'
    );
    this.RETAILNICKNAMEOnCalculator = page.locator('main div div div div div span').first();
    this.approveButton = page.locator('button:has-text("Approve")');
    this.cancelButton = page.locator('button:has-text("Cancel")');
    this.connectWalletButton = page.locator('form button:has-text("Connect Wallet")');
    this.errorMessage = page.locator('form label span:nth-of-type(3)');
    this.errorMessageIndicator = page.locator('form label span:nth-of-type(4)');
    this.completeTransactionDialogClose = page.locator('[role="dialog"] button');
  }

  async stakeNear(nearAmount: string, isInvestor?:boolean): Promise<void> {
    if (isInvestor) {
      await this.investorModeCheckbox.click();
      await this.selectValidator.click();
      await this.firstValidator.click();
    }
    await this.amountInput.fill(nearAmount);
    await Promise.all([
      this.page.waitForNavigation(),
      this.submitButton.click(),
    ]);
    await Promise.all([
      this.page.waitForNavigation(),
      this.approveButton.click(),
    ]);
    await this.completeTransactionDialogClose.click();
    await expect(this.nickNameOnHeader).toHaveCount(1);
  }

  async cancelStakeNear( nearAmount: string ): Promise<void> {
    await this.amountInput.fill(nearAmount);
    await Promise.all([
      this.page.waitForNavigation(),
      this.submitButton.click(),
    ]);
    await Promise.all([
      this.page.waitForNavigation(),
      this.cancelButton.click(),
    ]);
    await expect(this.nickNameOnHeader).toHaveCount(1);
  }

  async unstakeNear(nearAmount: string, isInvestor:boolean, unstakeOperation?: UnstakeType): Promise<void> {
    await this.unstakeSwitcher.click();
    await expect(this.unstakeMode.pagedHeader).toContainText("Unstake");
    if (unstakeOperation == UnstakeType.Delayed) { await this.delayedUnstakeSwitcher.click() };
    if (isInvestor == true && unstakeOperation == UnstakeType.Delayed) {
      await this.investorModeCheckbox.click();
      console.log('investments reached')
      await this.selectValidator.click();
      await this.firstValidator.click();
    }
    await this.amountInput.fill(nearAmount);
    await Promise.all([
      this.page.waitForNavigation(),
      this.submitButton.click(),
    ]);
    await Promise.all([
      this.page.waitForNavigation(),
      this.approveButton.click(),
    ]);
    await this.completeTransactionDialogClose.click();
    await expect(this.nickNameOnHeader).toHaveCount(1);
  }

  async validateStakeInputData(isValidCases: boolean | true): Promise<void> {
    const currentUserBalance = await this.getAmountFromApp(this.nearAmountOnHeader);
    const maxValidStake = (currentUserBalance! - 1).toString();
    const maxInvalidtake = (currentUserBalance! + 1).toString();
    const validateStakeInputData = ["1", "35", maxValidStake];
    const invalidStakeData = [
      {value: '0', error: 'Amount must be greater than zero'},
      {value: maxInvalidtake, error: `Amount must be less than or equal:`},
      {value: '0.00000000015', error: 'Amount must be greater than or equal 1 NEAR'},
      {value: '-5', error: 'Amount must be positive'},
      {value: '#${}',  error: 'Amount must be a number'}]

    if (isValidCases) {
      for (let item of validateStakeInputData) {
        await this.amountInput.fill(item);
        await expect(this.errorMessageIndicator).toHaveCount(0);
    }
    } else {
      for (let item of invalidStakeData) {
        await this.amountInput.fill(item.value);
        await expect(this.errorMessageIndicator).toHaveCount(1);
        await expect(this.errorMessage).toContainText(item.error);
        
    }

    }
  }

  async getResponseBody(urlPart:string) {
    const response = await this.page.request.get(urlPart + '/pool');
    console.log('catch the url', urlPart + '/pool' )
    return response.text();
  }


  async mockRequestResponse(url: string, mockingBody:string) {
    await this.page.route(url, route => {
      if (route.request().postData().includes(url))
        route.fulfill({ body: mockingBody });
      else {
        route.continue();
        console.log('request failed to mock!')
      }
        
    });
  }

  async validateRateCount(rateValue: string) {
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
    let mockBody = `{"apr":"0","total_staked":"0","delegators":2,"market_cap":"350.35","exchange_rate":${rateValue},"tx_coast":"0","rewards_fee":"0.01","total_rewards":"0","price":"3.5"}`
    let url = `${this.apiUrl}/pool`;
    await this.mockRequestResponse(url, mockBody);
    await delay(10000);
    await expect(this.exchangeRate).toHaveText(`1 stNEAR ≈ ${rateValue} NEAR`);
    
  }

  async openUserAccountView(): Promise<void> {
    await this.RETAILNICKNAMEOnCalculator.click();
    await expect( this.disconnectButton).toHaveCount(1)
  }

  async validateUserAccountLink() {
  const userAccount = await this.nickNameOnHeader.textContent({ timeout: 600 });
  const viewOnNearLocator = this.page.locator(`[href="https://wallet.${currentEnv}.near.org"]`);
  await this.openUserAccountView();
  await expect(viewOnNearLocator).toHaveCount(1);
  await this.closeModal();
  }
}
