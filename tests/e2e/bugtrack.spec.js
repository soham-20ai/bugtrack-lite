const { test, expect } = require("@playwright/test");

test("user can report a bug and see it on the dashboard", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Report Bug" }).click();

  await page.locator("#title").fill("Checkout button is broken");
  await page.locator("#description").fill("The checkout button does nothing.");
  await page.locator("#priority").selectOption("Critical");
  await page.locator("#assignee").fill("Soham");

  await page.getByRole("button", { name: "Create Issue" }).click();

  await expect(page.locator(".bug-card").first()).toContainText("Checkout button is broken");
  await expect(page.locator(".bug-card").first()).toContainText("Critical");
});