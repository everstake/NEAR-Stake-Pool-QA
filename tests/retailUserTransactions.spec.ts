import { test, Page, expect } from '@playwright/test';
import { OperationsPage } from '../pages/operationsPage';
import { BasePage } from '../pages/basePage';
import { ExternalLoginPage } from "../pages/externalLoginPage";
import { UnstakeType, UserType } from "../consts"

test.describe.configure({ mode: 'serial' });

let page: Page;

test.beforeAll(async ({ browser }) => {
  // Create page once and sign in.
  page = await browser.newPage();
  const  externalLoginPage = new ExternalLoginPage(page)
  await page.goto(externalLoginPage.pageUrl);
  await externalLoginPage.connectExistingWallet(UserType.Retail);
});

test.afterAll(async () => {
  await page.close();
});

test('@smoke @retail-1 User can perform Stake Transaction', async () => {
    const operationsPage = new OperationsPage(page);
    const testAmount = '2'
    const excahngeRateFromAppNear = await operationsPage.getAmountFromApp(operationsPage.exchangeRate);
    const currentUseNearrBalance = await operationsPage.getAmountFromApp(operationsPage.nearAmountOnHeader);
    const currentUserStNearStakedBalance = await operationsPage.getAmountFromApp(operationsPage.userStakedBalanceInStNear);
    await operationsPage.stakeNear(testAmount);
    const updatedUserNearBalance = await operationsPage.getAmountFromApp(operationsPage.nearAmountOnHeader);
    const updatedUserStNearStakedBalance = await operationsPage.getAmountFromApp(operationsPage.userStakedBalanceInStNear);
    console.log('currentNear - updatedNear = ', currentUseNearrBalance! - updatedUserNearBalance!);
    console.log('stake amount = ', Number(testAmount));
    await expect(currentUseNearrBalance! - updatedUserNearBalance! - Number(testAmount) < 0.001).toBeTruthy(); 
    await expect((updatedUserStNearStakedBalance! - currentUserStNearStakedBalance!) - excahngeRateFromAppNear!*Number(testAmount) < 0.001).toBeTruthy(); 
});

test('@smoke @retail-2 User can perform Instant Unstake', async () => {
  const operationsPage = new OperationsPage(page);
    const excahngeRateFromAppNear = await operationsPage.getAmountFromApp(operationsPage.exchangeRate);
    await operationsPage.unstakeSwitcher.click();
    const instantUnstakeFeeFromApp = await operationsPage.getAmountFromApp(operationsPage.instantUnstakeFee);
    const testAmount = '0.01'
    await operationsPage.amountInput.fill(testAmount);
    const currentYouWillReceiveValue = await operationsPage.getAmountFromApp(operationsPage.youWillReceive);
    const excahngeRateFromApp = await operationsPage.getAmountFromApp(operationsPage.exchangeRate);
    console.log('currentYouWillReceive ', currentYouWillReceiveValue);
    console.log('devided ', Number(testAmount)/excahngeRateFromAppNear!);
    const totalFee = instantUnstakeFeeFromApp!*Number(testAmount)/100;
    console.log('counted total fee', totalFee)
    await expect(excahngeRateFromApp! * Number(testAmount) - totalFee - currentYouWillReceiveValue! < 0.001).toBeTruthy();
    await expect(Number(testAmount) / excahngeRateFromAppNear! - totalFee - currentYouWillReceiveValue! < 0.001).toBeTruthy();
});

test('@smoke @retail-3 User can perform Delayed Unstake', async () => {
  const operationsPage = new OperationsPage(page);
  const testAmount = '0.1'
  const excahngeRateFromAppNear = await operationsPage.getAmountFromApp(operationsPage.exchangeRate);
  const currentUserBalance = await operationsPage.getAmountFromApp(operationsPage.nearAmountOnHeader);
  const currentUserAwaitingUnbonding = await operationsPage.getAmountFromApp(operationsPage.userAwaitingUnbonding);
  await operationsPage.unstakeNear(testAmount, false, UnstakeType.Delayed);
  const updatedUserBalance = await operationsPage.getAmountFromApp(operationsPage.nearAmountOnHeader);
  const updatedUserAwaitingUnbonding = await operationsPage.getAmountFromApp(operationsPage.userAwaitingUnbonding);
  console.log('awaiting before unstake', currentUserAwaitingUnbonding!);
  console.log('awaiting after unstake', updatedUserAwaitingUnbonding!);
  console.log('awaiting unbounding diff real', updatedUserAwaitingUnbonding! - currentUserAwaitingUnbonding!);
  console.log('updatedNear  - currentNear = ', updatedUserBalance! - currentUserBalance!);
  const diffAwaitingUnbonding = (updatedUserAwaitingUnbonding! - currentUserAwaitingUnbonding!).toFixed(3)
  const unstakeAmountInNear = (Number(testAmount)/excahngeRateFromAppNear!).toFixed(3)
  console.log('amount in near', unstakeAmountInNear)
  console.log('awaiting unbounding diff fixed', diffAwaitingUnbonding);
  await expect(Number(diffAwaitingUnbonding) == Number(unstakeAmountInNear)).toBeTruthy(); 
  
});

test('@regression @wallet-7 User can cancel Stake operation instead confirm', async () => {
  const operationsPage = new OperationsPage(page);
  await operationsPage.stakeSwitcher.click();
  const startUserBalance = await operationsPage.getAmountFromApp(operationsPage.nearAmountOnHeader);
  await operationsPage.cancelStakeNear('1');
  const endUserBalance = await operationsPage.getAmountFromApp(operationsPage.nearAmountOnHeader);
  console.log('current balance', startUserBalance);
  console.log('updated balance', endUserBalance);
  await expect((startUserBalance == endUserBalance)).toBeTruthy();
});

