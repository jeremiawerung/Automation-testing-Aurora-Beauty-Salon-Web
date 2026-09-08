<h1 align="center">🧪 Automation Testing Portfolio</h1>
<p align="center"><b>Aurora Beauty Salon — E2E Testing untuk Flow "Main Menu"</b></p>
<p align="center">Playwright · Page Object Model · Laravel 12</p>

---

> 🇬🇧 *English version available at [README.en.md](README.en.md).*

## 1. Ringkasan

Folder ini adalah **studi kasus automation testing** yang saya kerjakan untuk **Aurora Beauty Salon**,
sebuah aplikasi booking salon kecantikan berbasis Laravel. Saya berperan sebagai QA/SDET: melakukan
eksplorasi aplikasi, merancang skenario test, mengimplementasikan automation test dengan Playwright,
menjalankannya, menganalisis kegagalan, dan mendokumentasikan hasilnya.

**Scope yang diuji:** flow **Main Menu** — navigasi utama pelanggan (navbar, pengalih bahasa, panel
profil) dan halaman Beranda (hero, pencarian layanan, grid kategori, galeri, rekomendasi).

**Hasil akhir:**

| Metrik | Nilai |
|---|---|
| Total test case | **40** (+ 1 setup) |
| Status | ✅ **41 / 41 passed** |
| Waktu eksekusi | ± 2,5 menit |
| Framework | Playwright (`@playwright/test`) |
| Pola desain | Page Object Model |

📄 Laporan HTML lengkap hasil run tersedia di [`test-report/index.html`](test-report/index.html)
(unduh folder ini lalu buka filenya di browser).

---

## 2. Tech Stack

### 2.1 Tech Stack Aplikasi yang Diuji (Aurora Beauty Salon)

| Kategori | Teknologi |
|---|---|
| Backend Framework | **Laravel 12** (PHP 8.2+) |
| Autentikasi & Starter Kit | Laravel Jetstream 5, Laravel Sanctum |
| Reactive Component | Livewire 3 |
| Templating | Blade |
| Database | MySQL |
| Frontend styling (sisi pelanggan) | CSS kustom, Google Fonts (Playfair Display, Plus Jakarta Sans) |
| Frontend styling (sisi admin) | Bootstrap 5, jQuery, Select2 |
| Build tool | Vite 7, Tailwind CSS 3 |
| Notifikasi UI | SweetAlert2 |
| Grafik/laporan | Chart.js |
| Ekspor data | `barryvdh/laravel-dompdf` (PDF), `maatwebsite/excel` (Excel) |
| Payment gateway | Midtrans (`midtrans/midtrans-php`) |
| Testing bawaan | PHPUnit 11 |

### 2.2 Tech Stack Automation Testing (dikerjakan pada studi kasus ini)

| Kategori | Teknologi | Alasan Pemilihan |
|---|---|---|
| Test framework | **Playwright (`@playwright/test`)** v1.63 | Auto-wait bawaan, trace viewer, cepat & stabil untuk UI berbasis JavaScript (dropdown, modal, AJAX) |
| Bahasa | JavaScript (ES Modules) | Native di ekosistem Playwright, mudah dibaca tim non-PHP |
| Browser runtime | Google Chrome (via `channel: 'chrome'`) | Memakai Chrome yang sudah terpasang di mesin, tidak bergantung unduhan browser bundel |
| Pola desain | **Page Object Model** | Memisahkan selector/element dari skenario test → mudah dipelihara saat UI berubah |
| Manajemen state login | `storageState` Playwright | Login sekali di tahap *setup*, dipakai ulang oleh banyak test → lebih cepat & stabil |
| Data test | Script PHP (`seed-test-user.php`) memakai model Eloquent aplikasi | Idempotent, tidak mengubah data pelanggan asli |
| Reporter | Playwright HTML Reporter | Laporan visual pass/fail beserta durasi tiap test |
| Runtime | Node.js 22 | Menjalankan Playwright test runner |

---

## 3. Strategi & Struktur Test

```
e2e/
  auth.setup.js                          # Setup: seed user test + simpan session login (storageState)
  fixtures/auth.fixture.js               # Helper login manual (untuk skenario yang merusak session, mis. logout)
  pages/
    MainMenuPage.js                      # Page Object: navbar, dropdown bahasa, panel profil
    HomePage.js                         # Page Object: hero, pencarian, kategori, galeri, rekomendasi
  support/
    test-data.js                        # Kredensial, rute, label per bahasa, konstanta
    seed-test-user.php                  # Penyiapan akun pelanggan khusus E2E
  ui/
    main-menu-navigation-ui.e2e.test.js  # Grup A & B — navigasi & pengalih bahasa
    main-menu-auth-state-ui.e2e.test.js  # Grup C & D — state auth & panel profil
    home-search-ui.e2e.test.js           # Grup E — pencarian layanan
    home-content-ui.e2e.test.js          # Grup F, G, H — konten AJAX Beranda
playwright.config.js
```

Contoh kode lengkap ada di folder [`sample-code/`](sample-code/) pada repo ini (Page Object
`MainMenuPage.js` & `HomePage.js`, dua file test, `playwright.config.js`, dan `test-data.js`).

### Prinsip yang diterapkan

- **Page Object Model** — setiap elemen UI (locator) didefinisikan sekali di `pages/`, dipakai ulang
  di banyak test. Saat UI berubah, cukup update satu tempat.
- **Setup terpisah dari test** — login & penyiapan data dilakukan sekali di `auth.setup.js`,
  hasilnya (`storageState`) dipakai ulang → test lebih cepat dan tidak saling mengganggu.
- **Data test terisolasi** — satu akun pelanggan khusus (`e2e.tester@aurora.test`) dibuat via script
  idempotent, tidak pernah menyentuh data pelanggan asli di database.
- **Assertion tidak bergantung teks yang berubah-ubah** — mis. verifikasi "grid sudah dimuat"
  dilakukan lewat struktur DOM (jumlah elemen), bukan teks placeholder, supaya tidak rapuh
  terhadap perubahan bahasa aktif.
- **Cakupan happy path + edge case** — setiap grup skenario menyertakan kondisi normal
  *dan* kondisi tepi (keyword pencarian kosong, locale tidak valid, akses tanpa login, dsb).

---

## 4. Cakupan Skenario Test (40 test case, 8 grup)

| Grup | Fokus | Jumlah |
|---|---|---|
| A | Navigasi menu utama (guest) | 5 |
| B | Pengalih bahasa (ID/EN) | 6 |
| C | State tamu vs pelanggan login | 4 |
| D | Panel profil (sidebar) & konfirmasi logout | 10 |
| E | Pencarian layanan (autocomplete) | 8 |
| F | Grid kategori layanan (AJAX) | 3 |
| G | Galeri "Experience" (AJAX) | 1 |
| H | Carousel rekomendasi (AJAX) | 3 |

Rincian lengkap tiap skenario ada di [`e2e/README.md`](../e2e/README.md) pada repo aplikasi.

---

## 5. Bukti Visual

| Screenshot | Deskripsi |
|---|---|
| ![Beranda - tamu](screenshots/01-beranda-tamu.png) | Beranda dalam state tamu — nav lengkap, hero, kategori, galeri, rekomendasi |
| ![Nav aktif - About](screenshots/02-nav-active-about.png) | Link "Tentang Kami" ditandai aktif setelah navigasi |
| ![Ganti bahasa](screenshots/03-language-switch-id.png) | Halaman tetap sama, teks menu berganti bahasa |
| ![Autocomplete pencarian](screenshots/04-search-autocomplete.png) | Saran pencarian layanan muncul saat mengetik "Facial" |
| ![Panel profil login](screenshots/05-panel-profil-login.png) | Panel profil pelanggan setelah login |
| ![Menu mobile](screenshots/06-mobile-hamburger-menu.png) | Hamburger menu pada viewport mobile (375px) |
| ![Laporan Playwright](screenshots/07-playwright-html-report.png) | Laporan HTML Playwright — 41/41 test passed |

> Seluruh screenshot di atas diambil langsung dari aplikasi yang berjalan (bukan mockup),
> lewat script `capture-screenshots.mjs` di folder ini.

---

## 6. Temuan Selama Pengujian

Saat menjalankan test pertama kali, **2 dari 41 test gagal**. Setelah dianalisis, penyebabnya
**bukan bug aplikasi**, melainkan asumsi awal saya yang keliru:

> `config/app.php` pada aplikasi menetapkan locale default `'id'` secara *hardcoded*, alih-alih
> membaca `env('APP_LOCALE')` seperti konfigurasi standar Laravel. Akibatnya, meski `.env` berisi
> `APP_LOCALE=en`, aplikasi tetap tampil berbahasa Indonesia secara default. Perilaku aplikasi
> sendiri konsisten — hanya ekspektasi test yang perlu disesuaikan.

Saya memperbaikinya di sisi test (menambahkan konstanta `DEFAULT_LOCALE` sebagai satu sumber
kebenaran), **tanpa mengubah kode aplikasi**, lalu melaporkan temuan ini secara eksplisit —
sesuai praktik QA yang baik: memisahkan kegagalan test akibat *bug produk* dari kegagalan akibat
*asumsi test yang salah*.

---

## 7. Cara Menjalankan Ulang

```bash
# di root project aplikasi (bukan folder portofolio ini)
npm install
php artisan serve            # jalankan aplikasi di http://127.0.0.1:8000
npm run test:e2e             # jalankan seluruh suite Playwright
npm run test:e2e:ui          # mode UI interaktif Playwright
npm run test:e2e:report      # buka laporan HTML hasil run terakhir
```

Detail lengkap (prasyarat, environment variable, cara kerja seed data) ada di
[`e2e/README.md`](../e2e/README.md).

---

## 8. Rencana Pengembangan (Backlog)

Studi kasus ini sengaja dibatasi pada flow Main Menu. Area berikutnya yang sudah dipetakan
namun belum dikerjakan:

- **Prioritas tinggi:** alur booking end-to-end (kategori → jadwal → pembayaran → sukses),
  keranjang booking, integrasi pembayaran Midtrans, validasi voucher/diskon, pembatalan booking.
- **Prioritas menengah:** registrasi & verifikasi email, lupa password, navbar & fitur sisi admin
  (CRUD data master, POS, laporan & ekspor).
- **Prioritas rendah:** aksesibilitas, responsive di breakpoint lain, test API/Feature (PHPUnit)
  untuk endpoint AJAX.

Daftar lengkap ada di [`e2e/README.md`](../e2e/README.md) bagian *Backlog*.

---

<p align="center"><i>Dibuat sebagai bagian dari portofolio automation testing.</i></p>
