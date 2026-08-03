/**
 * EDIT THIS FILE FIRST.
 *
 * Everything that identifies the business lives here. It seeds the live,
 * editable copy in Admin → Settings (localStorage-backed, see
 * store/SiteSettingsContext.jsx) — so this file is what a fresh browser
 * starts from, and what "Reset settings" in the admin panel restores.
 */

export const site = {
  brand: 'ATELIER',
  tagline: 'Wholesale Furniture Collections',

  /**
   * WhatsApp number in international format: country code first, digits only,
   * no "+", no spaces, no dashes. Example for Turkey: '905551112233'.
   */
  whatsapp: '905551112233',

  email: 'export@atelier-furniture.com',
  phoneDisplay: '+90 555 111 22 33',

  instagram: 'atelier.furniture',
  instagramUrl: 'https://instagram.com/atelier.furniture',

  address: 'Organize Sanayi Bölgesi, 3. Cadde No 14, Kayseri, Türkiye',

  /** Shown in the header and footer as the short value proposition. */
  intro:
    'Factory-direct furniture for retailers, hotels and project buyers. ' +
    'Full containers or mixed loads, worldwide shipping.',

  /** Appended to every WhatsApp enquiry so you know where it came from. */
  enquirySource: 'Website enquiry',

  /**
   * Gate for /admin. This only hides the panel from casual visitors — it is
   * checked in the browser, so anyone who reads the source can see it. Change
   * it before sharing the site, and do not use it to protect real secrets.
   */
  adminPassword: 'atelier-admin',
};
