// Script sekali-pakai untuk mengambil screenshot NYATA dari aplikasi berjalan,
// dipakai sebagai bukti visual di laporan portofolio. Bukan bagian dari test suite.
//
// Jalankan dari root project aplikasi (folder ini harus tetap berada di dalamnya),
// karena bergantung pada `@playwright/test` dari node_modules root dan `php artisan serve`:
//   node portfolio-automation-testing/capture-screenshots.mjs
import { chromium } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, 'screenshots');
const BASE_URL = 'http://127.0.0.1:8000';
const PELANGGAN = { email: 'e2e.tester@aurora.test', password: 'E2ePassw0rd!' };

// Pastikan akun test ada (script sama yang dipakai suite e2e).
execFileSync('php', ['e2e/support/seed-test-user.php'], { cwd: path.resolve(__dirname, '..') });

const browser = await chromium.launch({ channel: 'chrome' });

async function shot(page, name) {
  await page.screenshot({ path: path.join(OUT, name), fullPage: true });
  console.log('saved', name);
}

// 1. Beranda - state tamu
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE_URL + '/');
  await page.waitForSelector('.services-grid a', { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(500);
  await shot(page, '01-beranda-tamu.png');

  // 2. Halaman About - link aktif
  // Locale default aplikasi adalah 'id' (lihat catatan config/app.php di README e2e),
  // jadi link diklik lewat href, bukan teks, supaya tidak bergantung bahasa aktif.
  await page.locator('a[href$="/about"]').first().click();
  await page.waitForLoadState('networkidle');
  await shot(page, '02-nav-active-about.png');

  // 3. Ganti bahasa ke ID (tetap di halaman About)
  await page.locator('.language-btn').click();
  await page.locator('a[href$="/lang/id"]').click();
  await page.waitForLoadState('networkidle');
  await shot(page, '03-language-switch-id.png');

  // kembalikan ke EN supaya screenshot berikutnya konsisten
  await page.locator('.language-btn').click();
  await page.locator('a[href$="/lang/en"]').click();
  await page.waitForLoadState('networkidle');

  // 4. Autocomplete pencarian di Beranda
  await page.goto(BASE_URL + '/');
  await page.locator('#searchLayanan').click();
  await page.locator('#searchLayanan').pressSequentially('Facial', { delay: 40 });
  await page.waitForSelector('.search-suggestion-item', { timeout: 5000 });
  await shot(page, '04-search-autocomplete.png');

  await page.close();
}

// 5. Login pelanggan + panel profil terbuka
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE_URL + '/login');
  await page.locator('input[name="email"]').fill(PELANGGAN.email);
  await page.locator('input[name="password"]').fill(PELANGGAN.password);
  await page.locator('button[type="submit"]').first().click();
  await page.waitForURL(BASE_URL + '/');
  await page.locator('.nav-buttons button.profile-btn').click();
  await page.waitForTimeout(400); // tunggu transisi slide-in panel selesai
  await shot(page, '05-panel-profil-login.png');
  await page.close();
}

// 6. Viewport mobile - hamburger + panel menu
{
  const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
  await page.goto(BASE_URL + '/');
  await page.locator('.menu-toggle').click();
  await page.waitForTimeout(400);
  await shot(page, '06-mobile-hamburger-menu.png');
  await page.close();
}

await browser.close();
console.log('Selesai. Screenshot tersimpan di', OUT);
