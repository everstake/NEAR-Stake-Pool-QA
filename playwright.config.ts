import { PlaywrightTestConfig } from "@playwright/test";
require("dotenv").config();

const config: PlaywrightTestConfig = {
  testDir: "./tests",
  /* Maximum time one test can run for. */
  timeout: 500 * 60 * 1000,
  reporter: [ [ 
    './report.js', {
      outputJSON: true,
      generateHTML: true,
      reportDir: 'mochawesome-report',
      outputFileName: 'result.json'
    } 
] ],
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 10000,
  },
  //workers: 3,

  use: {
    // Browser options
    headless: false,
    //storageState: 'storage-state/storageState.json',

    // Context options
    viewport: { width: 1280, height: 720 },

    // Artifacts
    screenshot: "only-on-failure",
    
  },

  projects: [
    {
      name: "Chrome",
      use: { browserName: "chromium" },
    },
  ],
};

export default config;
