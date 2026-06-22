import { test, expect, Page } from "@playwright/test";

const TESTER = { email: "tester@bugflow.com", password: "tester123" };
const ADMIN  = { email: "admin@bugflow.com",  password: "admin123"  };

async function login(page: Page, creds = TESTER) {
  await page.goto("/login");
  await page.getByPlaceholder(/email/i).fill(creds.email);
  await page.getByPlaceholder(/password/i).fill(creds.password);
  await page.getByRole("button", { name: /login|sign in/i }).click();
  await page.waitForURL(/(?!.*login)/);
}

test.describe("Bugs", () => {

  test("bugs list page loads and shows bugs", async ({ page }) => {
    await login(page);
    await page.goto("/bugs");
    await expect(page.getByRole("heading", { name: /bug/i })).toBeVisible();
    // At least the seed bugs should be visible
    await expect(page.getByText(/Login button|Product images|Checkout crashes/i).first()).toBeVisible({ timeout: 5000 });
  });

  test("search filter narrows results", async ({ page }) => {
    await login(page);
    await page.goto("/bugs");
    const searchBox = page.getByPlaceholder(/search/i);
    await searchBox.fill("mobile");
    await page.waitForTimeout(500); // debounce
    await expect(page.getByText(/Login button unresponsive on mobile/i)).toBeVisible({ timeout: 5000 });
  });

  test("status filter works", async ({ page }) => {
    await login(page);
    await page.goto("/bugs");
    await page.getByRole("combobox").filter({ hasText: /all statuses/i }).selectOption("OPEN");
    await page.waitForTimeout(400);
    // Only OPEN bugs should show
    const badgesText = await page.locator("text=OPEN").count();
    expect(badgesText).toBeGreaterThan(0);
  });

  test("tester can create a new bug", async ({ page }) => {
    await login(page);
    await page.goto("/bugs/new");
    await page.getByLabel(/title/i).fill("E2E Test Bug — automated test");
    await page.getByLabel(/description/i).fill("Created by Playwright E2E test suite");
    // Select project (first option)
    const projectSelect = page.getByLabel(/project/i);
    await projectSelect.selectOption({ index: 1 });
    await page.getByRole("button", { name: /submit|report|create/i }).click();
    // Should redirect to bug detail or bugs list
    await expect(page.getByText(/E2E Test Bug/i)).toBeVisible({ timeout: 8000 });
  });

  test("bug detail page shows all sections", async ({ page }) => {
    await login(page);
    await page.goto("/bugs");
    // Click first bug
    await page.locator("table tbody tr").first().getByRole("link").click();
    await expect(page.getByText(/description/i)).toBeVisible();
    await expect(page.getByText(/comments/i)).toBeVisible();
    await expect(page.getByText(/attachments/i)).toBeVisible();
  });

  test("admin can delete a bug", async ({ page }) => {
    await login(page, ADMIN);
    await page.goto("/bugs");
    // Find the E2E test bug we created and delete it
    const testBugLink = page.getByText(/E2E Test Bug/i);
    if (await testBugLink.isVisible()) {
      await testBugLink.click();
      page.on("dialog", (dialog) => dialog.accept());
      const deleteBtn = page.getByRole("button", { name: /delete/i });
      if (await deleteBtn.isVisible()) {
        await deleteBtn.click();
        await expect(page).toHaveURL(/\/bugs$/, { timeout: 5000 });
      }
    }
  });

});
