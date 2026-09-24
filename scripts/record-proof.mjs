import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';

// The proof's canonical home is now the website. Override with PROOF_URL to
// record another build (the GitHub Pages copy uses the old class names and
// needs the script from commit 6509aaf).
const url = process.env.PROOF_URL ?? 'https://www.mina-saad.com/decision-to-action';
const out = process.env.PROOF_OUT ?? 'artifacts/decision-to-action-site-silent.webm';
mkdirSync('artifacts/video-temp', { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  recordVideo: { dir: 'artifacts/video-temp', size: { width: 1440, height: 900 } },
  deviceScaleFactor: 1,
});
const recordingStarted = Date.now();
const page = await context.newPage();
const video = page.video();

await page.goto(url, { waitUntil: 'load', timeout: 60_000 });
await page.evaluate(() => document.fonts.ready);
// Everything below is cued to the narration in docs/recording-script.md,
// measured from this moment rather than chained as pauses, so a slow step
// cannot push the rest of the walkthrough off its line.
const t0 = Date.now();
const at = async (seconds) => {
  const wait = t0 + seconds * 1000 - Date.now();
  if (wait > 0) await page.waitForTimeout(wait);
};
const scrollTo = (locator, offset = 96) =>
  locator.evaluate((el, off) => window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - off, behavior: 'smooth' }), offset);

// 0:00-0:10 The claim: not a chatbot, an agent that completes the workflow.
await at(10);
// 0:10-0:23 The inputs: one request, three quotations, the policy.
await scrollTo(page.getByRole('tablist', { name: 'Workflow packs' }));
await at(15);
await scrollTo(page.locator('#source-pr-1042'), 180);
await at(20.5);
await scrollTo(page.getByRole('button', { name: /run procurement agent/i }), 300);
await at(22);
await page.getByRole('button', { name: /run procurement agent/i }).click();
// 0:23-0:45 Extraction, gates, the cheapest offer excluded.
await at(25.5);
await scrollTo(page.getByRole('region', { name: /three quotations/i }), 260);
await at(36);
await scrollTo(page.getByText('Rules checked', { exact: true }), 200);
// 0:45-1:02 The recommendation, its citations, its confidence.
await at(45);
await scrollTo(page.getByText('Decision packet', { exact: true }), 110);
await at(52);
await page.getByRole('button', { name: /cedar quotation/i }).click();
await at(57);
await scrollTo(page.getByText('Evidence cited', { exact: true }), 200);
// 1:02-1:16 The stop: approve, return, or escalate.
await at(62);
await scrollTo(page.getByRole('button', { name: /approve recommendation/i }), 420);
await at(74.5);
await page.getByRole('button', { name: /approve recommendation/i }).click();
// 1:16-1:25 The prepared record and the audit trail.
await at(76);
await scrollTo(page.getByRole('heading', { name: 'Action prepared and approved' }), 200);
await at(81);
await scrollTo(page.getByText('Audit trail', { exact: true }), 140);
// 1:25-1:30 The ask.
await at(85);
await scrollTo(page.locator('#sprint'), 64);
await at(90.5);

await context.close();
await video.saveAs(out);
await browser.close();
// The offset to trim from the front: the page load before t0 is not part of the 90 seconds.
console.log(JSON.stringify({ out, trimStart: (t0 - recordingStarted) / 1000 }));
