# BuilderSite funnel — React + Tailwind + PHP

The approved three page funnel, converted to React with Tailwind, plus a PHP endpoint
for lead capture. Design and copy are unchanged: the build is verified pixel identical
to the signed off HTML (0.00% pixel difference at 1280px and 390px on all three pages).

```
/                 Editorial advertorial  (was BuilderSite_Editorial_v3.html)
/audit            Two step qualifying wizard (was BuilderSite_Audit_v3.html)
/thank-you        Booking confirmation + proof (was BuilderSite_ThankYou_v3.html)
```

## Requirements

- Node 18+
- PHP 8.1+ for the API (uses the `never` return type and non capturing `catch`)

## Run it

```bash
npm install
cp .env.example .env          # set VITE_BOOKING_URL when the booking link is live
npm run dev                   # http://localhost:5173

# in a second terminal, so /api/lead.php resolves in dev
php -S localhost:8000 -t api
```

`vite.config.js` proxies `/api` to `localhost:8000`, so the form posts to the real PHP
handler while you develop.

## Build

```bash
npm run build                 # -> dist/
```

Deploy `dist/` as the web root and `api/` alongside it, so `/api/lead.php` resolves.
The app uses `BrowserRouter`, so point all unmatched routes at `index.html`
(Apache: `FallbackResource /index.html`. Nginx: `try_files $uri /index.html`).

## The API

`api/lead.php` accepts a JSON POST from the audit wizard and:

- rejects anything but POST, and only answers the origins in `config.php`
- throttles per IP (6 submissions per hour by default, no database needed)
- drops bot submissions via the `company_website` honeypot
- validates every field, and checks the dropdown answers against an allow list
  so nothing arbitrary is stored
- appends the lead to newline delimited JSON **outside the web root**, locked on write
- stores a hash of the IP, never the raw address
- optionally emails a notification

Copy `api/config.example.php` to `api/config.php` and fill it in. Do not commit
`config.php`. If you add a new city or question option in the React form, add the same
option to `config.php`, otherwise the API will reject it.

Failures never trap a qualified lead: if the endpoint is down, the front end logs the
error and still sends the builder to the next step.

## Wiring the booking flow

Set `VITE_BOOKING_URL` to the real TidyCal or Calendly event link. The wizard appends
`?name=` and `?email=` so the booking form is prefilled, and you should set the booking
tool's post booking redirect to `/thank-you`.

Leave it blank and the wizard goes straight to `/thank-you`, which keeps the whole funnel
clickable for demos.

## How the styling works

- `tailwind.config.js` carries the brand tokens (`ink`, `accent`, `cta1`, `lime`,
  `news`, the font stacks), so new work can use `bg-ink`, `text-accent`, and so on.
- `src/styles/pages.css` holds the approved design system, scoped under `.editorial-root`
  and `.bs-root`. The two are scoped because the newspaper pastiche and the BuilderSite
  brand both style `body`, `h1`, `h2`, `.sec` and `*`, and would otherwise bleed into
  each other.
- **Preflight is off** (`corePlugins: { preflight: false }`). The ported CSS already ships
  its own reset. Leaving Preflight on shifted the approved layout, because it forces
  `img { display: block }` and strips heading margins. With it off the render is exact.
- A few utilities carry `!` (for example `!pt-[3.6rem]`). Those replace inline styles from
  the original HTML and have to beat the scoped rules, which are more specific.

## Before this goes live to Australian audiences

- VelBuilt (velbuilt.com.au) is the only real client site. Ardent Atelier, Stratum, Verso
  and Stillpoint are demonstration builds and are labelled as such.
- The four testimonials, the builder faces, and the proof ticker activity are
  **illustrative samples**. Replace them with real, verified customer reviews before
  launch. Publishing invented reviews or fake activity risks breaching the Australian
  Consumer Law.
