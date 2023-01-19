import { test, Page, expect } from '@playwright/test';
import { OperationsPage } from '../pages/operationsPage';
import { BasePage } from '../pages/basePage';
import { ExternalLoginPage } from "../pages/externalLoginPage";
import { UserType } from "../consts"

test.describe.configure({ mode: 'serial' });
let page: Page;

test.beforeAll(async ({ browser }) => {
  // Create page once and sign in.
  page = await browser.newPage();
  const externalLoginPage = new ExternalLoginPage(page)
  await page.goto(externalLoginPage.pageUrl);
  await externalLoginPage.connectExistingWallet(UserType.Retail);
});

test.afterAll(async () => {
  await page.close();
});

test('@smoke @wallet-1 Verify UI change after connect Wallet', async () => {
  const basePage = new BasePage(page);
  const foundUserAmount = await basePage.getAmountFromApp(basePage.nearAmountOnHeader);
  await expect(foundUserAmount! > 0).toBeTruthy();
});

test('@regression @wallet-2 User can enter valid amount for Stake operation', async () => {
  const operationsPage = new OperationsPage(page);
  await operationsPage.validateStakeInputData(true);
});

test('@regression @wallet-3 Relevant error message appears on enter invalid amount for Stake operation', async () => {
  const operationsPage = new OperationsPage(page);
  await operationsPage.validateStakeInputData(false);
});

test('@regression @wallet-4 Stake You will receive is counted correctly for repeat transaction', async () => {
  const operationsPage = new OperationsPage(page);
  const testAmount = '2'
  await operationsPage.amountInput.fill(testAmount);
  const currentYouWillReceiveValue = await operationsPage.getAmountFromApp(operationsPage.youWillReceive);
  console.log('show me you will receive from app', currentYouWillReceiveValue);
  const excahngeRateFromApp = await operationsPage.getAmountFromApp(operationsPage.exchangeRate);
  console.log('show me counted you will receive', excahngeRateFromApp! * Number(testAmount));
  await expect(currentYouWillReceiveValue! === excahngeRateFromApp! * Number(testAmount)).toBeTruthy();
});

test('@regression @wallet-5 Instant Unstake You will receive is counted correctly', async () => {
  const operationsPage = new OperationsPage(page);
  const excahngeRateFromAppNear = await operationsPage.getAmountFromApp(operationsPage.exchangeRate);
  await operationsPage.unstakeSwitcher.click();
  const instantUnstakeFeeFromApp = await operationsPage.getAmountFromApp(operationsPage.instantUnstakeFee);
  const testAmount = '0.01'
  await operationsPage.amountInput.fill(testAmount);
  const currentYouWillReceiveValue = await operationsPage.getAmountFromApp(operationsPage.youWillReceive);
  const excahngeRateFromApp = await operationsPage.getAmountFromApp(operationsPage.exchangeRate);
  console.log('currentYouWillReceive ', currentYouWillReceiveValue);
  const totalFee = instantUnstakeFeeFromApp! * Number(testAmount) / 100;
  console.log('devided ', Number(testAmount) / excahngeRateFromAppNear! - totalFee);
  console.log('multiplied', excahngeRateFromApp! * Number(testAmount) - totalFee);
  console.log('counted total fee', totalFee);
  console.log('stNear rate diff', excahngeRateFromApp! * Number(testAmount) - totalFee - currentYouWillReceiveValue!);
  console.log('Near Rate diff second diff', Number(testAmount) / excahngeRateFromAppNear! - totalFee - currentYouWillReceiveValue!);
  await expect(excahngeRateFromApp! * Number(testAmount) - totalFee - currentYouWillReceiveValue! < 0.001).toBeTruthy();
  await expect(Number(testAmount) / excahngeRateFromAppNear! - totalFee - currentYouWillReceiveValue! < 0.001).toBeTruthy();
});

test('@regression @wallet-6 User balance on Header and on Main view are synchronized', async () => {
  const operationsPage = new OperationsPage(page);
  const userBalanceOnHeader = await operationsPage.getAmountFromApp(operationsPage.nearAmountOnHeader);
  const userBalanceOnCalculator = await operationsPage.getAmountFromApp(operationsPage.userNearBalanceOnCalculator);
  await expect((userBalanceOnHeader! == userBalanceOnCalculator)).toBeTruthy();
});

test('@smoke @wallet-8 Validate User Account view', async () => {
  const operationsPage = new OperationsPage(page);
  await operationsPage.validateUserAccountLink();
});


test('@smoke @wallet-9 User can Disconnect Account', async () => {
  const basePage = new BasePage(page);
  await basePage.validateDisconnectUser();
});