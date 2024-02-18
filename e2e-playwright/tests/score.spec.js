const { test, expect } = require("@playwright/test");

test.beforeEach(async ({ page }, testInfo) => {
  await page.goto('/');

  const userUuid = `test-${Math.random().toString(36)}`;

  await page.evaluate((uuid) => {
    localStorage.setItem('userUuid', uuid);
    location.reload();
  }, userUuid);

  // Wait for the page to reload
  await page.waitForLoadState();

});

test("Verifies score for an incorrect submission.", async ({ page }) => {
  // Send an incorrect submission for grading
  await expect(page.getByTestId('score')).toHaveText("0");
  await page.getByTestId('code-editor').fill("incorrect submission");
  await page.getByTestId('grading-button').click();

  // Wait for the page to receive feedbacks
  await page.waitForSelector('[data-testid="feedback-alert"]', {timeout: 240000});

  await expect(await page.getByTestId('score')).toHaveText("0");
});

test("Verifies score for a correct submission.", async ({ page }) => {
  // Send an incorrect submission for grading
  await expect(page.getByTestId('score')).toHaveText("0");
  await page.getByTestId('code-editor').fill("def hello():\n\treturn 'Hello'");
  await page.getByTestId('grading-button').click();

  // Wait for the page to receive feedbacks
  await page.waitForSelector('[data-testid="feedback-alert"]', {timeout: 240000});

  await expect(await page.getByTestId('score')).toHaveText("100");
});