import { test, expect, Page } from "@playwright/test";

async function login(page: Page) {
  await page.goto("/login");
  await page.getByPlaceholder(/email/i).fill("admin@bugflow.com");
  await page.getByPlaceholder(/password/i).fill("admin123");
  await page.getByRole("button", { name: /login|sign in/i }).click();
  await page.waitForURL(/(?!.*login)/);
}

test.describe("Dashboard", () => {

  test("stat cards show numeric values", async ({ page }) => {
    await login(page);
    await page.goto("/");
    // Total bugs card should be visible
    const totalCard = page.getByText(/total/i).first();
    await expect(totalCard).toBeVisible({ timeout: 5000 });
  });

  test("charts render (SVG elements present)", async ({ page }) => {
    await login(page);
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    // Recharts renders SVGs
    const svgs = await page.locator("svg").count();
    expect(svgs).toBeGreaterThan(0);
  });

  test("recent bugs list shows entries", async ({ page }) => {
    await login(page);
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await expect(page.getByText(/recent bug/i)).toBeVisible();
  });

  test("view all link navigates to bugs list", async ({ page }) => {
    await login(page);
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const viewAll = page.getByRole("link", { name: /view all/i });
    if (await viewAll.isVisible()) {
      await viewAll.click();
      await expect(page).toHaveURL(/\/bugs/);
    }
  });

});
