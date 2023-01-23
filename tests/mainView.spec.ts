import { test, expect } from '@playwright/test';
test.describe.configure({ mode: 'parallel' });

import { OperationsPage } from '../pages/operationsPage';


test.beforeEach(async ({ page }, testInfo) => {
    const operationsPage = new OperationsPage(page);
    await page.goto(operationsPage.pageUrl);
  });

test('@regression @mainView: Validate Connect Wallet Modal called from main view', async ({ page }) => {
  const operationsPage = new OperationsPage(page);
  await operationsPage.connectWalletButton.click();
  await operationsPage.validateVisibleElements({ visibleObject: operationsPage.connectWalletDialog });
  await operationsPage.checkIsElementDisabled({ element: operationsPage.connectWalletDialog.nearButton });
});


