import { expect, test } from '@playwright/test';
import { before, describe } from 'node:test';

describe('App', () => {
  before(() => {

  })
})

test('has title', async ({ page }) => {

  await page.goto('/');

  await page.getByLabel("Username").fill('dev.user');
  await page.getByLabel("Password", { exact: true }).fill('Pa$$word1');
  await page.getByRole("button", { name: "Sign In" }).click();

  // Expect h1 to contain a substring.
  expect(await page.locator('h1').innerText()).toContain('Welcome');
});
