#!/usr/bin/env node
/**
 * review-sheets.mjs — Generate HTML contact sheets from screenshots.
 *
 * Usage: npm run review:sheets
 * Prerequisites: Run review:screens first
 *
 * Output: review/sheets/{pageName}.html (one per page, all widths in a row)
 *         review/sheets/index.html (master index with thumbnails)
 */

import { readdir, stat, writeFile, mkdir } from 'fs/promises';
import { join, dirname, relative } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SCREENS_DIR = join(ROOT, 'review', 'screens');
const SHEETS_DIR = join(ROOT, 'review', 'sheets');

const WIDTHS = [320, 360, 375, 390, 414, 768, 820, 1024, 1280, 1440];

async function dirExists(path) {
  try {
    const s = await stat(path);
    return s.isDirectory();
  } catch {
    return false;
  }
}

function pageSheetHtml(pageName, widths) {
  const screenshotRows = widths
    .map(w => {
      const imgPath = `../screens/${pageName}/${w}.png`;
      return `
      <div class="screenshot">
        <div class="width-label">${w}px</div>
        <img src="${imgPath}" alt="${pageName} at ${w}px" loading="lazy" />
      </div>`;
    })
    .join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${pageName} — Contact Sheet</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, sans-serif; background: #1a1a1a; color: #ccc; padding: 24px; }
    h1 { font-size: 20px; color: #fff; margin-bottom: 4px; }
    .meta { font-size: 13px; color: #888; margin-bottom: 24px; }
    .meta a { color: #C4766C; text-decoration: none; }
    .grid {
      display: flex;
      gap: 16px;
      overflow-x: auto;
      padding-bottom: 16px;
    }
    .screenshot {
      flex-shrink: 0;
      background: #222;
      border: 1px solid #333;
      border-radius: 4px;
      overflow: hidden;
    }
    .width-label {
      padding: 6px 12px;
      font-size: 12px;
      font-family: monospace;
      color: #C4766C;
      background: #111;
      border-bottom: 1px solid #333;
    }
    .screenshot img {
      display: block;
      height: 600px;
      width: auto;
    }
  </style>
</head>
<body>
  <h1>${pageName}</h1>
  <p class="meta"><a href="index.html">&larr; All pages</a></p>
  <div class="grid">
    ${screenshotRows}
  </div>
</body>
</html>`;
}

function masterIndexHtml(pageNames) {
  const cards = pageNames
    .map(name => {
      const thumb = `../screens/${name}/1280.png`;
      return `
      <a href="${name}.html" class="card">
        <img src="${thumb}" alt="${name}" loading="lazy" />
        <div class="card-label">${name}</div>
      </a>`;
    })
    .join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Review Contact Sheets</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, sans-serif; background: #1a1a1a; color: #ccc; padding: 32px; }
    h1 { font-size: 24px; color: #fff; margin-bottom: 8px; }
    .meta { font-size: 13px; color: #888; margin-bottom: 32px; }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 16px;
    }
    .card {
      background: #222;
      border: 1px solid #333;
      border-radius: 4px;
      overflow: hidden;
      text-decoration: none;
      transition: border-color 0.2s;
    }
    .card:hover { border-color: #C4766C; }
    .card img {
      width: 100%;
      height: 180px;
      object-fit: cover;
      object-position: top;
      display: block;
    }
    .card-label {
      padding: 10px 14px;
      font-size: 14px;
      color: #fff;
      font-family: monospace;
    }
  </style>
</head>
<body>
  <h1>Contact Sheets</h1>
  <p class="meta">${pageNames.length} pages &times; ${WIDTHS.length} widths — click a page to see all responsive screenshots</p>
  <div class="grid">
    ${cards}
  </div>
</body>
</html>`;
}

async function generateSheets() {
  if (!(await dirExists(SCREENS_DIR))) {
    console.error('  No screenshots found. Run "npm run review:screens" first.');
    process.exit(1);
  }

  await mkdir(SHEETS_DIR, { recursive: true });

  const entries = await readdir(SCREENS_DIR);
  const pageNames = [];

  for (const entry of entries) {
    const entryPath = join(SCREENS_DIR, entry);
    if (await dirExists(entryPath)) {
      pageNames.push(entry);
    }
  }

  pageNames.sort();

  console.log(`\n  Generating contact sheets for ${pageNames.length} pages...\n`);

  for (const name of pageNames) {
    const html = pageSheetHtml(name, WIDTHS);
    const outPath = join(SHEETS_DIR, `${name}.html`);
    await writeFile(outPath, html);
    console.log(`  ${name}.html`);
  }

  const indexHtml = masterIndexHtml(pageNames);
  await writeFile(join(SHEETS_DIR, 'index.html'), indexHtml);
  console.log(`\n  index.html (master)`);

  console.log(`\n  Done. Open review/sheets/index.html in your browser.\n`);
}

generateSheets().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
