#!/usr/bin/env node
/**
 * review-screens.mjs — Capture full-page screenshots of every site page
 * at 10 responsive widths using Playwright.
 *
 * Usage: npm run review:screens
 * Prerequisites: npx playwright install chromium
 *
 * Output: review/screens/{pageName}/{width}.png
 */

import { chromium } from 'playwright';
import { mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUT_DIR = join(ROOT, 'review', 'screens');

const BASE_URL = process.env.REVIEW_URL || 'http://localhost:4321';

const WIDTHS = [320, 360, 375, 390, 414, 768, 820, 1024, 1280, 1440];

const PAGES = [
  { path: '/ru/', name: 'ru-home' },
  { path: '/en/', name: 'en-home' },
  { path: '/ru/beremennost/', name: 'ru-beremennost' },
  { path: '/en/during-pregnancy/', name: 'en-during-pregnancy' },
  { path: '/ru/posle-rodov/', name: 'ru-posle-rodov' },
  { path: '/en/after-childbirth/', name: 'en-after-childbirth' },
  { path: '/ru/formaty-i-ceny/', name: 'ru-formaty-i-ceny' },
  { path: '/en/formats-pricing/', name: 'en-formats-pricing' },
  { path: '/ru/o-trenere/', name: 'ru-o-trenere' },
  { path: '/en/about/', name: 'en-about' },
  { path: '/ru/bezopasnost-i-podhod/', name: 'ru-bezopasnost' },
  { path: '/en/safety-approach/', name: 'en-safety-approach' },
  { path: '/ru/otzyvy/', name: 'ru-otzyvy' },
  { path: '/en/reviews/', name: 'en-reviews' },
  { path: '/ru/faq/', name: 'ru-faq' },
  { path: '/en/faq/', name: 'en-faq' },
  { path: '/ru/kontakty/', name: 'ru-kontakty' },
  { path: '/en/contact/', name: 'en-contact' },
  { path: '/ru/blog/', name: 'ru-blog' },
  { path: '/en/blog/', name: 'en-blog' },
  { path: '/ru/blog/trenirovki-dlya-beremennyh/', name: 'ru-blog-trenirovki' },
  { path: '/en/blog/safe-pregnancy-training/', name: 'en-blog-safe-training' },
  { path: '/ru/blog/vosstanovlenie-posle-rodov/', name: 'ru-blog-vosstanovlenie' },
  { path: '/en/blog/postpartum-recovery-start/', name: 'en-blog-postpartum' },
  { path: '/ru/privacy/', name: 'ru-privacy' },
  { path: '/en/privacy/', name: 'en-privacy' },
  { path: '/ru/consent/', name: 'ru-consent' },
  { path: '/en/consent/', name: 'en-consent' },
];

async function captureScreenshots() {
  console.log(`\n  Capturing ${PAGES.length} pages × ${WIDTHS.length} widths = ${PAGES.length * WIDTHS.length} screenshots\n`);
  console.log(`  Base URL: ${BASE_URL}`);
  console.log(`  Output:   ${OUT_DIR}\n`);

  const browser = await chromium.launch();
  let captured = 0;
  const total = PAGES.length * WIDTHS.length;

  for (const page of PAGES) {
    const pageDir = join(OUT_DIR, page.name);
    await mkdir(pageDir, { recursive: true });

    for (const width of WIDTHS) {
      const context = await browser.newContext({
        viewport: { width, height: 900 },
        deviceScaleFactor: 1,
      });
      const tab = await context.newPage();

      try {
        await tab.goto(`${BASE_URL}${page.path}`, {
          waitUntil: 'networkidle',
          timeout: 15000,
        });
        // Wait for fonts and images
        await tab.waitForTimeout(500);

        const screenshotPath = join(pageDir, `${width}.png`);
        await tab.screenshot({
          path: screenshotPath,
          fullPage: true,
        });
        captured++;
        const pct = Math.round((captured / total) * 100);
        process.stdout.write(`\r  [${pct}%] ${captured}/${total} — ${page.name} @ ${width}px`);
      } catch (err) {
        console.error(`\n  ERROR: ${page.name} @ ${width}px — ${err.message}`);
      }

      await context.close();
    }
  }

  await browser.close();
  console.log(`\n\n  Done. ${captured} screenshots saved to review/screens/\n`);
}

captureScreenshots().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
