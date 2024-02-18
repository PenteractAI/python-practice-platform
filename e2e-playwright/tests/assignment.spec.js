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

test("Verifies feedback and failure status for an incorrect submission.", async ({ page }) => {
  // Send an incorrect submission for grading
  await page.getByTestId('code-editor').fill('incorrect submission');
  await page.getByTestId('grading-button').click();

  // Wait for the page to receive feedbacks
  await page.waitForSelector('[data-testid="feedback-alert"]');

  // Check their is only one feedback containing the right text
  const feedbackAlert = await page.getByTestId('feedback-alert');
  await expect(feedbackAlert).toHaveCount(1);
  await expect(feedbackAlert).toHaveText(/Traceback/);

  // CHeck that the submission status is Failed
  await expect(page.getByTestId('status-badge')).toHaveText('Failed');
});

test("Verifies success feedback for a correct submission.", async ({ page }) => {
  // Send a correct submission for grading
  await page.getByTestId('code-editor').fill("def hello():\n\treturn 'Hello'");
  await page.getByTestId('grading-button').click();

  // Wait for the page to receive feedbacks
  await page.waitForSelector('[data-testid="feedback-alert"]');

  // Check that their is only one feedback
  const feedbackAlert = await page.getByTestId('feedback-alert');
  await expect(feedbackAlert).toHaveCount(1);

  // Check that the submission status is Passed
  await expect(page.getByTestId('status-badge')).toHaveText('Passed');
});

test("Confirms navigation to a new assignment after passing tests.", async ({ page }) => {
  // Select the original infos
  const oldAssignmentOrder = page.getByTestId('assignment-order').textContent();
  const oldAssignmentTitle = page.getByTestId('assignment-title').textContent();
  const oldAssignmentHandout = page.getByTestId('assignment-handout').textContent();

  // Send a correct submission for grading
  await page.getByTestId('code-editor').fill("def hello():\n\treturn 'Hello'");
  await page.getByTestId('grading-button').click();

  // Wait for the page to receive feedbacks
  await page.waitForSelector('[data-testid="grading-bar"]');
  await page.waitForSelector('[data-testid="feedback-alert"]');

  // Move to the next assignment
  await page.getByTestId('next-assignment-button').click();

  // Check that the new assignment is loaded
  await expect(page.getByTestId('assignment-order')).not.toBe(oldAssignmentOrder);
  await expect(page.getByTestId('assignment-title')).not.toBe(oldAssignmentTitle);
  await expect(page.getByTestId('assignment-handout')).not.toBe(oldAssignmentHandout);
});