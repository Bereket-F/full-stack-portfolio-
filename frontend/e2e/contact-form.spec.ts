import { test, expect } from '@playwright/test';

test.describe('Contact form', () => {
  test('shows validation errors for empty submission', async ({ page }) => {
    await page.goto('/#contact');
    await page.getByRole('button', { name: /send message/i }).click();

    await expect(page.getByText(/name is required/i)).toBeVisible();
    await expect(page.getByText(/enter a valid email/i)).toBeVisible();
  });

  test('submits successfully with valid data', async ({ page }) => {
    await page.goto('/#contact');

    await page.getByLabel('Name').fill('Playwright Tester');
    await page.getByLabel('Email').fill('playwright-tester@example.com');
    await page.getByLabel('Subject').fill('End-to-end test submission');
    await page.getByLabel('Message').fill('This message was submitted by an automated Playwright test.');

    await page.getByRole('button', { name: /send message/i }).click();

    await expect(page.getByText(/message sent/i)).toBeVisible();
  });
});
