import { defineConfig, devices } from "@playwright/test"

export default defineConfig({
  testDir: "./specs",
  outputDir: "./specs/test-results",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: [["list"], ["html", { outputFolder: "./specs/playwright-report", open: "never" }]],
  use: {
    baseURL: "http://your-site.localhost",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
})
