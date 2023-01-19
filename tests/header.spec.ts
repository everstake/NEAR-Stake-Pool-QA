import { test, expect } from '@playwright/test';
test.describe.configure({ mode: 'parallel' });

import { BasePage } from '../pages/basePage';


test.beforeEach(async ({ page }, testInfo) => {
    const basePage = new BasePage(page);
    await page.goto(basePage.pageUrl);
  });

  test('@regression @header: Validate Header Elements', async ({ page }) => {
    const basePage = new BasePage(page);
    await basePage.validateVisibleElements({ visibleObject: basePage.headerElements });
});

test('@regression @header: Validate Connect Wallet Modal called from Header', async ({ page }) => {
  const basePage = new BasePage(page);
  await basePage.headerElements.connectWallet.click();
  await basePage.validateVisibleElements({ visibleObject: basePage.connectWalletDialog });
  await basePage.checkIsElementDisabled({ element: basePage.connectWalletDialog.nearButton });
});

test('@regression @header: Validate Switch Light/Dark Modes', async ({ page }) => {
  const basePage = new BasePage(page);
  await basePage.headerElements.switchModeButton.click();
  await basePage.checkUpdateColor({ element: basePage.headerElements.pagedHeader, expectedColor: "rgb(39, 56, 82)" })
  await basePage.headerElements.switchModeButton.click();
  await basePage.checkUpdateColor({ element: basePage.headerElements.pagedHeader, expectedColor: "rgb(255, 255, 255)" })
});


