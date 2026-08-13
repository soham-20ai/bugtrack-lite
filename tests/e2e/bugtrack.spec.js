const { test, expect } = require("@playwright/test");

test("user can report a bug and see it on the dashboard", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Report Bug" }).click();

  await page.locator("#title").fill("Checkout button is broken");
  await page.locator("#description").fill("The checkout button does nothing.");
  await page.locator("#priority").selectOption("Critical");
  await page.locator("#assignee").fill("Soham");

  await page.getByRole("button", { name: "Create Issue" }).click();

  await expect(page.locator(".bug-card").first()).toContainText(
    "Checkout button is broken"
  );

  await expect(page.locator(".bug-card").first()).toContainText("Critical");
});

test("user can search, filter, update and delete a bug", async ({ page }) => {
  await page.goto("/");

  // Create a bug
  await page.getByRole("button", { name: "Report Bug" }).click();

  const bugTitle = "E2E Search Test Bug";

  await page.locator("#title").fill(bugTitle);
  await page.locator("#description").fill("Testing search and filtering.");
  await page.locator("#priority").selectOption("High");
  await page.locator("#assignee").fill("Soham");

  await page.getByRole("button", { name: "Create Issue" }).click();

  // Go to Issues
  await page.getByRole("button", { name: "Issues" }).click();

  // Search for the bug
  await page.locator("#search").fill(bugTitle);

  const bugCard = page.locator(".bug-card").filter({
    hasText: bugTitle
  });

  await expect(bugCard).toHaveCount(1);
  await expect(bugCard).toContainText("High");

  // Filter by priority
  await page.locator("#priorityFilter").selectOption("High");

  await expect(bugCard).toHaveCount(1);

  // Change status
  await bugCard
    .locator("select[aria-label='Change status']")
    .selectOption("Resolved");

  await expect(bugCard).toContainText("Resolved");

 // Accept the browser confirmation dialog
page.on("dialog", async dialog => {
  await dialog.accept();
});

// Delete the bug
await bugCard.getByRole("button", { name: "Delete" }).click();

// Confirm deletion
await expect(bugCard).toHaveCount(0);
});