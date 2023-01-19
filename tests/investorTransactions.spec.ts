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
  await externalLoginPage.connectExistingWallet(UserType.Investor);
});

test.afterAll(async () => {
  await page.close();
});

test('@smoke @investor-1 Investor can perform Stake Transaction as Retail User', async () => {
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

test('@smoke @investor-2 Investor can perform Stake Transaction as Investor', async () => {
    const operationsPage = new OperationsPage(page);
    const testAmount = '2'
    const excahngeRateFromAppNear = await operationsPage.getAmountFromApp(operationsPage.exchangeRate);
    const currentUseNearrBalance = await operationsPage.getAmountFromApp(operationsPage.nearAmountOnHeader);
    const currentUserStNearStakedBalance = await operationsPage.getAmountFromApp(operationsPage.userStakedBalanceInStNear);
    await operationsPage.stakeNear(testAmount, true);
    const updatedUserNearBalance = await operationsPage.getAmountFromApp(operationsPage.nearAmountOnHeader);
    const updatedUserStNearStakedBalance = await operationsPage.getAmountFromApp(operationsPage.userStakedBalanceInStNear);
    console.log('currentNear - updatedNear = ', currentUseNearrBalance! - updatedUserNearBalance!);
    console.log('stake amount = ', Number(testAmount));
    await expect(currentUseNearrBalance! - updatedUserNearBalance! - Number(testAmount) < 0.005).toBeTruthy(); 
    await expect((updatedUserStNearStakedBalance! - currentUserStNearStakedBalance!) - excahngeRateFromAppNear!*Number(testAmount) < 0.001).toBeTruthy(); 
});


test('@smoke @investor-3 Investor can perform Instant Unstake', async () => {
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

test('@smoke @investor-4 Investor can perform Delayed Unstake as Retail User', async () => {
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

test('@smoke @investor-5 Investor can perform Delayed Unstake from selected validator', async () => {
  const operationsPage = new OperationsPage(page);
  const testAmount = '0.1'
  const excahngeRateFromAppNear = await operationsPage.getAmountFromApp(operationsPage.exchangeRate);
  const currentUserBalance = await operationsPage.getAmountFromApp(operationsPage.nearAmountOnHeader);
  const currentUserAwaitingUnbonding = await operationsPage.getAmountFromApp(operationsPage.userAwaitingUnbonding);
  await operationsPage.unstakeNear(testAmount, true, UnstakeType.Delayed);
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
