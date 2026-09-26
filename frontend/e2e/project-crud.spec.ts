import { test, expect } from '@playwright/test';

const ADMIN_EMAIL = process.env.E2E_ADMIN_EMAIL ?? 'admin@example.com';
const ADMIN_PASSWORD = process.env.E2E_ADMIN_PASSWORD ?? 'ChangeMe123!';

async function login(page: import('@playwright/test').Page) {
  await page.goto('/admin/login');
  await page.getByLabel('Email').fill(ADMIN_EMAIL);
  await page.getByLabel('Password').fill(ADMIN_PASSWORD);
  await page.getByRole('button', { name: /sign in/i }).click();
  await expect(page).toHaveURL(/\/admin\/dashboard/);
}

test.describe('Project management', () => {
  test('creates, edits, and deletes a project', async ({ page }) => {
    await login(page);
    await page.goto('/admin/projects');

    // Create
    await page.getByRole('button', { name: /new project/i }).click();
    const title = `E2E Test Project ${Date.now()}`;
    await page.getByLabel('Title').fill(title);
    await page.getByLabel('Summary').fill('Created by a Playwright end-to-end test.');
    await page.getByRole('button', { name: /^save$/i }).click();

    await expect(page.getByText(title)).toBeVisible();

    // Edit
    const row = page.getByRole('row', { name: new RegExp(title) });
    await row.getByRole('button').first().click(); // pencil/edit icon button
    await page.getByLabel('Title').fill(`${title} (edited)`);
    await page.getByRole('button', { name: /^save$/i }).click();
    await expect(page.getByText(`${title} (edited)`)).toBeVisible();

    // Delete
    const editedRow = page.getByRole('row', { name: new RegExp(`${title} \\(edited\\)`) });
    await editedRow.getByRole('button').last().click(); // trash icon button
    await page.getByRole('button', { name: /^delete$/i }).click();
    await expect(page.getByText(`${title} (edited)`)).not.toBeVisible();
  });
});
