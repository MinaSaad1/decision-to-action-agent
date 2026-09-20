import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const url = 'https://minasaad1.github.io/decision-to-action-agent/';
const out = 'artifacts/decision-to-action-proof-silent.webm';
mkdirSync('artifacts/video-temp', { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  recordVideo: { dir: 'artifacts/video-temp', size: { width: 1440, height: 900 } },
  deviceScaleFactor: 1,
});
const page = await context.newPage();
const video = page.video();
const pause = ms => page.waitForTimeout(ms);
const scroll = async (selector, position = 'center') => {
  await page.locator(selector).scrollIntoViewIfNeeded();
  await page.locator(selector).evaluate((el, p) => el.scrollIntoView({ behavior: 'smooth', block: p }), position);
  await pause(1200);
};

await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60_000 });
await pause(5_000);
await scroll('.pack-tabs', 'start');
await pause(3_000);
await scroll('.sources', 'start');
await pause(5_000);
await page.locator('.workflow-summary').scrollIntoViewIfNeeded();
await pause(2_000);
await page.getByRole('button', { name: /Run Procurement agent/i }).click();
await pause(7_000);
await scroll('.decision', 'start');
await pause(8_000);
await scroll('.decision-grid > div:last-child', 'center');
await pause(8_000);
await scroll('.human-gate', 'center');
await pause(12_000);
await page.getByRole('button', { name: /Approve recommendation/i }).click();
await pause(2_000);
await scroll('.action-record', 'start');
await pause(8_000);
await scroll('.audit', 'center');
await pause(6_000);
await scroll('.final-cta', 'center');
await pause(6_000);
await context.close();
await video.saveAs(out);
await browser.close();
console.log(out);
