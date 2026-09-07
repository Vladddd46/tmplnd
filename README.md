# MMA Training for Kids — Landing Page (Obolon, Kyiv)

Static one-page landing site for Meta Ads traffic. Funnel:

**Meta Ads → Landing page → Telegram bot → Lead**

No forms on the website. All lead qualification happens in Telegram.

Built with vanilla HTML, CSS, and JavaScript. No frameworks, no npm, no build step. Ready for GitHub Pages.

---

## 1. Project overview

| Item | Value |
|------|--------|
| Service | Children's MMA training |
| Coach | Alberto Cortes |
| Area | Obolon, Kyiv |
| Location | Levka Lukianenka St, 9A |
| Schedule | Tuesday & Thursday, 19:00–20:30 |
| Age | Children aged 8+ |
| Phone | +380 63 370 04 60 |
| Language | Ukrainian (all user-facing website copy) |

Pricing is intentionally **not** shown anywhere on the site.

---

## 2. File structure

```
/
  index.html          # Main landing page
  privacy.html        # Privacy policy (Ukrainian)
  css/
    style.css         # All styles
  js/
    config.js         # Telegram URL + Meta Pixel ID (edit this)
    main.js           # Telegram CTA, Pixel events, UTM, sticky CTA, animations
  assets/
    images/           # Local WebP images (see below)
  README.md
```

---

## 3. How to run locally

No install required.

**Option A — open the file**

1. Open `index.html` in a browser.

**Option B — local static server (recommended)**

```bash
# Python
python3 -m http.server 8080

# or Node (if available)
npx serve .
```

Then visit `http://localhost:8080`.

---

## 4. How to deploy to GitHub Pages

1. Create a GitHub repository and push this project.
2. In the repo: **Settings → Pages**.
3. Source: **Deploy from a branch**.
4. Branch: `main` (or `master`), folder: `/ (root)`.
5. Save and wait for the site to publish.

No build step is required. The site is already static.

If the repo name is `mma_ads` and your username is `example`, the default URL will look like:

`https://example.github.io/mma_ads/`

Update canonical / Open Graph URLs to match (see sections 14–16).

---

## 5. Configuration (`js/config.js`)

**Edit only `js/config.js` before publishing.**

```js
window.SITE_CONFIG = {
  TELEGRAM_BOT_URL: "https://t.me/YOUR_BOT_USERNAME?start=mma_meta",
  META_PIXEL_ID: "YOUR_META_PIXEL_ID",
};
```

### Telegram

Set `TELEGRAM_BOT_URL` to your full bot link, for example:

`https://t.me/mma_kids_bot?start=mma_meta`

All `.telegram-cta` buttons get this URL from JavaScript.

### Meta Pixel

**Replace `YOUR_META_PIXEL_ID` before production deployment.**

Set `META_PIXEL_ID` to your real Pixel ID (digits only).

If the placeholder is not replaced:

- The site still works
- Pixel `init` / `PageView` are skipped
- Telegram CTA click handlers still run safely

---

## 7. Images to place in `assets/images`

| File | Purpose |
|------|---------|
| `hero.webp` | Strong real MMA training photo (children and/or coach). Used as hero background. |
| `coach.webp` | Portrait or training photo of Alberto Cortes. |
| `training-1.webp` | Training photo — technique / kids practicing. |
| `training-2.webp` | Training photo — pad work / partner drills. |
| `training-3.webp` | Training photo — warm-up / conditioning. |
| `training-4.webp` | Training photo — group activity / supervised sparring. |
| `og-image.webp` | Social preview for Meta / Open Graph / Twitter. |

**Do not hotlink Instagram CDN images.** Download and save locally.

Until images are added, the page still renders using dark gradients and fallback blocks.

Use the coach Instagram for visual reference only:

https://www.instagram.com/cortezcoach.ua/

---

## 8. Recommended image dimensions

| File | Suggested size |
|------|----------------|
| `hero.webp` | 1600×1000 (landscape) |
| `coach.webp` | 900×1100 (portrait) |
| `training-1.webp` … `training-4.webp` | 1000×750 minimum |
| `og-image.webp` | 1200×630 |

Compress WebP for mobile. Prefer real training photos over stock.

---

## 9. How to test the Telegram CTA

1. Set a real bot username in `TELEGRAM_BOT_URL`.
2. Open the landing page.
3. Click any **Book a Training Session** / **Continue in Telegram** button.
4. Confirm Telegram opens with `?start=mma_meta`.
5. In DevTools → Console, confirm:

```text
Telegram CTA clicked { trafficSource: ..., ... }
```

---

## 10. How to test Meta Pixel

1. Replace `YOUR_META_PIXEL_ID` with a real Pixel ID.
2. Deploy or serve over `http://localhost` / HTTPS.
3. Open the page — `PageView` should fire on load.
4. Click a Telegram CTA — `Lead` and custom `TelegramClick` should fire.

---

## 11. Meta Pixel Helper

1. Install the [Meta Pixel Helper](https://chrome.google.com/webstore/detail/meta-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc) Chrome extension.
2. Open the live or local landing page.
3. Check that `PageView` appears on load.
4. Click a CTA and verify `Lead` + `TelegramClick`.

---

## 12. Meta Events Manager — Test Events

1. Open Meta Events Manager → your Pixel → **Test Events**.
2. Enter your landing page URL (or use the browser extension test flow).
3. Load the page → confirm `PageView`.
4. Click Telegram CTA → confirm `Lead` and `TelegramClick`.

---

## 13. Add a custom domain later

1. GitHub Pages → **Custom domain** → enter your domain.
2. Add the DNS records GitHub shows (usually `A` / `CNAME`).
3. Enable HTTPS once DNS propagates.
4. Update canonical, `og:url`, and absolute `og:image` URLs (below).

---

## 14. Update canonical URL

In `index.html` and `privacy.html`:

```html
<link rel="canonical" href="https://YOUR_DOMAIN.github.io/">
```

Replace with your real public URL, for example:

`https://yourdomain.com/` or `https://username.github.io/mma_ads/`

For privacy:

`https://yourdomain.com/privacy.html`

---

## 15. Update `og:url`

In `index.html`:

```html
<meta property="og:url" content="https://YOUR_DOMAIN.github.io/">
```

Use the same absolute public URL as the canonical.

---

## 16. Update `og:image`

In `index.html`:

```html
<meta property="og:image" content="assets/images/og-image.webp">
```

For production Meta previews, use an **absolute** URL:

```html
<meta property="og:image" content="https://yourdomain.com/assets/images/og-image.webp">
```

Also update `twitter:image` the same way.

---

## 17. How UTM parameters are stored

On page load, `saveTrafficSource()` reads:

- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `utm_term`
- `fbclid`

Any present values are merged into `sessionStorage` under key `mma_traffic_source`.

`getTrafficSource()` returns an object like:

```js
{
  utm_source: "facebook",
  utm_medium: "paid",
  utm_campaign: "mma_kids_obolon",
  fbclid: "...."
}
```

Missing values are ignored. On Telegram CTA click, attribution is logged via `console.debug` so a future Telegram backend can consume the same shape.

---

## 18. Lead on Telegram CTA click

On Telegram CTA click the landing fires:

- `Lead`
- custom `TelegramClick`

The Telegram bot only collects and delivers the application; it does not send Meta events.

---

## Manual checklist before publishing

Replace / update these before going live:

- [ ] `TELEGRAM_BOT_URL` in `js/config.js`
- [ ] `META_PIXEL_ID` in `js/config.js`
- [ ] Canonical URL in `index.html` and `privacy.html`
- [ ] `og:url` in `index.html`
- [ ] Absolute `og:image` / `twitter:image` URLs
- [ ] Real images in `assets/images/` (`hero`, `coach`, `training-1`–`4`, `og-image`)

---

## License / notes

© 2026 MMA Training with Alberto Cortes.  
Landing page copy and structure provided for this campaign. No pricing is displayed.
