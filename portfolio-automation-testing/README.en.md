<h1 align="center">🧪 Automation Testing Portfolio</h1>
<p align="center"><b>Aurora Beauty Salon — E2E Testing for the "Main Menu" Flow</b></p>
<p align="center">Playwright · Page Object Model · Laravel 12</p>

---

> 🇮🇩 *Versi Bahasa Indonesia (lebih lengkap) tersedia di [README.md](README.md).*

## 1. Summary

This folder is a **automation testing case study** I built for **Aurora Beauty Salon**, a Laravel-based
beauty salon booking application. I acted as QA/SDET: exploring the app, designing test scenarios,
implementing automated tests with Playwright, running them, triaging failures, and documenting the
results.

**Scope tested:** the **Main Menu** flow — customer-facing navigation (navbar, language switcher,
profile panel) and the Home page (hero, service search, category grid, gallery, recommendations).

**Result:**

| Metric | Value |
|---|---|
| Total test cases | **40** (+ 1 setup) |
| Status | ✅ **41 / 41 passed** |
| Run time | ~2.5 minutes |
| Framework | Playwright (`@playwright/test`) |
| Design pattern | Page Object Model |

Full HTML report available at [`test-report/index.html`](test-report/index.html) (download this
folder and open the file in a browser).

---

## 2. Tech Stack

### 2.1 Application Under Test

| Category | Technology |
|---|---|
| Backend framework | **Laravel 12** (PHP 8.2+) |
| Auth & starter kit | Laravel Jetstream 5, Laravel Sanctum |
| Reactive components | Livewire 3 |
| Templating | Blade |
| Database | MySQL |
| Customer-facing styling | Custom CSS, Google Fonts |
| Admin-facing styling | Bootstrap 5, jQuery, Select2 |
| Build tooling | Vite 7, Tailwind CSS 3 |
| UI notifications | SweetAlert2 |
| Charts/reporting | Chart.js |
| Data export | `barryvdh/laravel-dompdf` (PDF), `maatwebsite/excel` (Excel) |
| Payment gateway | Midtrans |
| Built-in test tooling | PHPUnit 11 |

### 2.2 Automation Testing Stack (this case study)

| Category | Technology | Why |
|---|---|---|
| Test framework | **Playwright (`@playwright/test`)** v1.63 | Built-in auto-waiting, trace viewer, fast & stable for a JS-heavy UI (dropdowns, modals, AJAX-driven content) |
| Language | JavaScript (ES Modules) | Native to the Playwright ecosystem |
| Browser runtime | Google Chrome (`channel: 'chrome'`) | Uses the machine's installed Chrome instead of depending on bundled-browser downloads |
| Design pattern | **Page Object Model** | Decouples selectors from test logic → easier to maintain as the UI evolves |
| Login state | Playwright `storageState` | Log in once during setup, reuse the session across tests → faster & more stable |
| Test data | PHP seed script using the app's own Eloquent models | Idempotent, never touches real customer data |
| Reporter | Playwright HTML Reporter | Visual pass/fail report with per-test duration |
| Runtime | Node.js 22 | Runs the Playwright test runner |

---

## 3. Test Strategy & Structure

```
e2e/
  auth.setup.js                          # Setup project: seeds the test user + saves login session
  fixtures/auth.fixture.js               # Manual login helper (for flows that break the session, e.g. logout)
  pages/
    MainMenuPage.js                      # Page Object: navbar, language dropdown, profile panel
    HomePage.js                         # Page Object: hero, search, categories, gallery, recommendations
  support/
    test-data.js                        # Credentials, routes, per-locale labels, constants
    seed-test-user.php                  # Provisions the dedicated E2E customer account
  ui/
    main-menu-navigation-ui.e2e.test.js  # Group A & B — navigation & language switcher
    main-menu-auth-state-ui.e2e.test.js  # Group C & D — auth state & profile panel
    home-search-ui.e2e.test.js           # Group E — service search
    home-content-ui.e2e.test.js          # Group F, G, H — AJAX-loaded home content
playwright.config.js
```

Full source examples live in [`sample-code/`](sample-code/) in this same folder (the two Page
Objects, two test files, `playwright.config.js`, and `test-data.js`).

### Principles applied

- **Page Object Model** — every UI locator lives once in `pages/`, reused across many tests.
- **Setup separated from tests** — login and data seeding run once in `auth.setup.js`; the resulting
  `storageState` is reused, making the suite faster and test-to-test independent.
- **Isolated test data** — a single dedicated customer account is provisioned by an idempotent
  script; production/dev customer data is never touched.
- **Assertions resilient to copy changes** — e.g. "grid finished loading" is verified via DOM
  structure (element counts), not placeholder text, so it doesn't break when the active locale changes.
- **Happy path + edge cases** — every scenario group includes both normal and boundary conditions
  (empty search keyword, unsupported locale, unauthenticated access, etc.).

---

## 4. Scenario Coverage (40 test cases, 8 groups)

| Group | Focus | Count |
|---|---|---|
| A | Main menu navigation (guest) | 5 |
| B | Language switcher (ID/EN) | 6 |
| C | Guest vs. logged-in customer state | 4 |
| D | Profile panel (sidebar) & logout confirmation | 10 |
| E | Service search (autocomplete) | 8 |
| F | Service category grid (AJAX) | 3 |
| G | "Experience" gallery (AJAX) | 1 |
| H | Recommendations carousel (AJAX) | 3 |

Full scenario-by-scenario breakdown is in the app repo's [`e2e/README.md`](../e2e/README.md).

---

## 5. Visual Evidence

| Screenshot | Description |
|---|---|
| ![Home - guest](screenshots/01-beranda-tamu.png) | Home page, guest state — full nav, hero, categories, gallery, recommendations |
| ![Active nav - About](screenshots/02-nav-active-about.png) | "About" link marked active after navigation |
| ![Language switch](screenshots/03-language-switch-id.png) | Same page, menu text switched to another language |
| ![Search autocomplete](screenshots/04-search-autocomplete.png) | Search suggestions appearing while typing "Facial" |
| ![Profile panel logged in](screenshots/05-panel-profil-login.png) | Customer profile panel after login |
| ![Mobile hamburger menu](screenshots/06-mobile-hamburger-menu.png) | Hamburger menu on a mobile viewport (375px) |
| ![Playwright report](screenshots/07-playwright-html-report.png) | Playwright HTML report — 41/41 tests passed |

> All screenshots above were captured from the live running application (not mockups), via the
> `capture-screenshots.mjs` script in this folder.

---

## 6. Finding During Testing

On the first run, **2 of 41 tests failed**. Triage showed this was **not an application bug**,
but an incorrect assumption in my own test setup:

> The app's `config/app.php` hardcodes the default locale to `'id'` instead of reading
> `env('APP_LOCALE')` as a standard Laravel config would. So even though `.env` sets
> `APP_LOCALE=en`, the app still defaults to Indonesian. The application's behavior is
> consistent — only the test's expectation needed correcting.

I fixed this on the test side (introduced a `DEFAULT_LOCALE` constant as a single source of truth)
**without touching application code**, and reported the finding explicitly — following good QA
practice of separating *product bugs* from *incorrect test assumptions*.

---

## 7. How to Re-run

```bash
# from the application's project root (not this portfolio folder)
npm install
php artisan serve            # start the app at http://127.0.0.1:8000
npm run test:e2e             # run the full Playwright suite
npm run test:e2e:ui          # Playwright's interactive UI mode
npm run test:e2e:report      # open the HTML report from the last run
```

Full details (prerequisites, env vars, how the seed data works) are in
[`e2e/README.md`](../e2e/README.md).

---

## 8. Roadmap / Backlog

This case study intentionally scopes to the Main Menu flow. Areas already mapped out but not
yet implemented:

- **High priority:** end-to-end booking flow (category → schedule → payment → success),
  booking cart, Midtrans payment integration, voucher/discount validation, booking cancellation.
- **Medium priority:** registration & email verification, forgot password, admin-side navbar and
  features (master data CRUD, POS, reports & exports).
- **Low priority:** accessibility, responsive checks at other breakpoints, API/Feature (PHPUnit)
  tests for the AJAX endpoints.

Full list is in the app repo's [`e2e/README.md`](../e2e/README.md), *Backlog* section.

---

<p align="center"><i>Built as part of an automation testing portfolio.</i></p>
