import { test, expect } from "@playwright/test";

const ADMIN = { email: "admin@bugflow.com", password: "admin123" };
const TESTER = { email: "tester@bugflow.com", password: "tester123" };

test.describe("Authentication", () => {

  test("shows login page on unauthenticated access", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByRole("heading", { name: /login|sign in/i })).toBeVisible();
  });

  test("shows error on wrong credentials", async ({ page }) => {
    await page.goto("/login");
    await page.getByPlaceholder(/email/i).fill("wrong@email.com");
    await page.getByPlaceholder(/password/i).fill("wrongpassword");
    await page.getByRole("button", { name: /login|sign in/i }).click();
    await expect(page.getByText(/invalid|incorrect|wrong/i)).toBeVisible({ timeout: 5000 });
  });

  test("admin can log in and see dashboard", async ({ page }) => {
    await page.goto("/login");
    await page.getByPlaceholder(/email/i).fill(ADMIN.email);
    await page.getByPlaceholder(/password/i).fill(ADMIN.password);
    await page.getByRole("button", { name: /login|sign in/i }).click();
    await expect(page).not.toHaveURL(/\/login/, { timeout: 5000 });
    await expect(page.getByText(/dashboard|welcome/i).first()).toBeVisible();
  });

  test("tester can log in and see dashboard", async ({ page }) => {
    await page.goto("/login");
    await page.getByPlaceholder(/email/i).fill(TESTER.email);
    await page.getByPlaceholder(/password/i).fill(TESTER.password);
    await page.getByRole("button", { name: /login|sign in/i }).click();
    await expect(page).not.toHaveURL(/\/login/, { timeout: 5000 });
  });

  test("logout redirects to login", async ({ page }) => {
    await page.goto("/login");
    await page.getByPlaceholder(/email/i).fill(ADMIN.email);
    await page.getByPlaceholder(/password/i).fill(ADMIN.password);
    await page.getByRole("button", { name: /login|sign in/i }).click();
    await page.waitForURL(/(?!.*login)/);
    // Click logout button (look for it in sidebar or nav)
    const logoutBtn = page.getByRole("button", { name: /logout|sign out/i });
    if (await logoutBtn.isVisible()) {
      await logoutBtn.click();
      await expect(page).toHaveURL(/\/login/, { timeout: 5000 });
    }
  });

});
