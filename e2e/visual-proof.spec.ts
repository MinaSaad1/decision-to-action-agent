import { mkdirSync } from 'node:fs';
import { expect, test } from '@playwright/test';

const output = 'artifacts/screenshots';

test('capture every workflow pack with a clean console', async ({ page }) => {
  mkdirSync(output, { recursive: true });
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });

  await page.goto('/');
  await page.screenshot({ path: `${output}/01-overview.png`, fullPage: true });

  await page.getByRole('button', { name: /run procurement agent/i }).click();
  await expect(page.getByText('Ready for human review')).toBeVisible({ timeout: 10000 });
  await page.screenshot({ path: `${output}/02-procurement-decision.png`, fullPage: true });
  await page.getByRole('button', { name: /approve recommendation/i }).click();
  await expect(page.getByText('Action prepared and approved')).toBeVisible();
  await page.screenshot({ path: `${output}/03-procurement-action.png`, fullPage: true });

  await page.getByRole('tab', { name: /recruitment/i }).click();
  await page.getByRole('button', { name: /run recruitment agent/i }).click();
  await expect(page.getByText('Ready for human review')).toBeVisible({ timeout: 10000 });
  await page.screenshot({ path: `${output}/04-recruitment-decision.png`, fullPage: true });

  await page.getByRole('tab', { name: /customer operations/i }).click();
  await page.getByRole('button', { name: /run customer operations agent/i }).click();
  await expect(page.getByText('Ready for human review')).toBeVisible({ timeout: 10000 });
  await page.screenshot({ path: `${output}/05-customer-operations-decision.png`, fullPage: true });

  await page.getByRole('tab', { name: /procurement/i }).click();
  await page.getByLabel('Scenario').selectOption('missing-compliance');
  await page.getByRole('button', { name: /run procurement agent/i }).click();
  await expect(page.getByText('Required certificate is not attached.')).toBeVisible({ timeout: 10000 });
  await page.getByRole('button', { name: /escalate exception/i }).click();
  await page.screenshot({ path: `${output}/06-procurement-exception.png`, fullPage: true });

  expect(errors).toEqual([]);
});
