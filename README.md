# Atelier — Wholesale Furniture Site (React + Vite)

A wholesale-focused furniture catalogue. No prices, no cart: every image opens a detail
panel with full specifications and a WhatsApp enquiry box. Categories, gallery items, the
home page slider and all contact details are editable from a built-in `/admin` panel — no
code changes needed to run the site day to day.

## Page structure

```
Home         Header → banner → category circles → why-us → gallery → Instagram → CTA → footer
Category     Category banner → category circles (current one highlighted) → gallery → Instagram → CTA
Collections  All categories as circles
Gallery      Every model, filterable by category
About        Company story and facts
Contact      Enquiry form that opens WhatsApp, plus direct contact details
Admin        Password-gated dashboard — see below
```

## Files

```
src/config/site.js          Default brand, WhatsApp number, email, Instagram, address —
                             seeds the editable copy in Admin → Settings
src/data/catalog.js         Categories, banner slides, products, Instagram posts (seed data)
src/styles.css              All styling, design tokens at the top
src/store/
  CatalogContext.jsx        Live categories + gallery items (persisted, admin-editable)
  SiteSettingsContext.jsx   Live site settings + home banner slides (persisted, admin-editable)
src/components/
  Header.jsx                Sticky header, collections dropdown, mobile drawer
  Banner.jsx                Auto-playing banner with dots and arrows
  CategoryRow.jsx           Lilac circle tiles — row and grid variants
  Gallery.jsx                Uniform image grid, opens the modal on click
  ImageModal.jsx             Image carousel + specifications + WhatsApp enquiry box
  InstagramSection.jsx       Instagram strip
  SectionTitle.jsx           Section heading with eyebrow and action slot
  Footer.jsx                 Dark footer with contact details + quiet link to /admin
  Icons.jsx                  Inline SVG icons
src/admin/
  AdminGate.jsx              Password gate (client-side only, see below)
  CategoryFormModal.jsx      Add/edit a category
  ItemFormModal.jsx          Add/edit a gallery item
  SlideFormModal.jsx         Add/edit a banner slide
src/pages/                   HomePage, CategoryPage, CollectionsPage, GalleryPage,
                              AboutPage, ContactPage, AdminPage, NotFoundPage
```

## Setup

```bash
npm install
```

```bash
npm run dev
```

Then open http://localhost:5175.

To produce a deployable build:

```bash
npm run build
```

The output in `dist/` is static and uses relative paths plus `HashRouter`, so it works from
any host or subfolder without server rewrite rules.

## The admin panel (`/admin`)

Linked quietly from the footer. Default password is `atelier-admin` — set in
`src/config/site.js` (`adminPassword`), and change it before sharing the site. It's a
client-side check only (there's no backend), so it keeps out casual visitors, not a
determined one.

Four tabs, all changes save automatically to the browser's `localStorage` and appear on the
live site immediately:

- **Categories** — add, edit, delete the circle tiles. Deleting is blocked while a category
  still has gallery items in it, so nothing gets orphaned.
- **Gallery items** — add, edit, delete products: images, material, finish, dimensions, MOQ,
  lead time, packing, certifications, and everything else shown in the detail panel.
- **Home slider** — add, edit, delete, and reorder the banner slides (up/down arrows).
- **Settings** — brand name/tagline/intro, WhatsApp number, phone, email, address, Instagram
  handle/URL, and the office hours / visiting note shown on the Contact page.

Each tab has its own "Reset to demo data" / "Reset slides" / "Reset to defaults" button that
restores the original seed content from `config/site.js` and `data/catalog.js` — handy while
testing, or if edits go sideways.

**Note:** because everything is stored in the browser, changes made in one browser (or one
device) do not appear in another. For a real deployment where multiple people manage content
or it needs to be visible to everyone from any device, this would need to move to a small
backend/database — ask if you want that built out.

## Before going live

1. **`src/config/site.js`** — replace the defaults: brand name, WhatsApp number (country code
   first, digits only, no `+`), email, Instagram handle and address. These seed the live
   settings; you can also edit everything from Admin → Settings after the site is running.

2. **`src/data/catalog.js`** — swap the `img()` helper for your own CDN and replace the demo
   products, or just add your real ones through Admin → Gallery items. Images currently come
   from picsum.photos and need an internet connection.

3. **Category circles** — the demo uses photographs, which fill the lilac disc. If your
   category images are transparent PNGs of the product itself (like the reference design),
   pass `cutout` so the product floats inside the disc:

   ```jsx
   <CategoryCircle category={c} cutout />
   ```

4. **Instagram posts** — `instagramPosts` in `catalog.js` is static demo data (the strip of
   photos, not the handle/link — those are editable in Admin → Settings). Connect a real feed
   endpoint if you want the posts themselves to be live.

## How the WhatsApp enquiry works

Nothing is submitted from the page and no backend is involved. The form builds a message
containing the product name, code and whatever the visitor filled in, then opens
`wa.me/<your number>` with that text pre-filled so they only have to press send. The number
it uses is always the current one from Admin → Settings.
