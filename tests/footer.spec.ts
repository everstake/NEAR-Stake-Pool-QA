import { test, expect } from '@playwright/test';
import { BasePage } from '../pages/basePage';


test.beforeEach(async ({ page, context }, testInfo) => {
    const basePage = new BasePage(page);
    await page.goto(basePage.pageUrl);
  });

  test('@regression @footer: Validate Footer Elements', async ({ page, context }) => {
    const basePage = new BasePage(page,);
    await basePage.validateVisibleElements({ visibleObject: basePage.footerElements });
});


