import { useState } from 'react';
import { SectionTitle } from '../components/SectionTitle';
import { MailIcon, PhoneIcon, PinIcon, WhatsAppIcon } from '../components/Icons';
import { useCatalog } from '../store/CatalogContext';
import { useSiteSettings } from '../store/SiteSettingsContext';

const EMPTY = { name: '', company: '', country: '', category: '', message: '' };

export function ContactPage() {
  const { categories } = useCatalog();
  const { site, waLink } = useSiteSettings();
  const [form, setForm] = useState(EMPTY);
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const message = [
    `Hello ${site.brand},`,
    '',
    form.name.trim() && `Name: ${form.name.trim()}`,
    form.company.trim() && `Company: ${form.company.trim()}`,
    form.country.trim() && `Country: ${form.country.trim()}`,
    form.category && `Interested in: ${form.category}`,
    form.message.trim() && `\n${form.message.trim()}`,
    '',
    `(${site.enquirySource})`,
  ]
    .filter(Boolean)
    .join('\n');

  return (
    <div className="page">
      <section className="section">
        <div className="shell">
          <SectionTitle
            eyebrow="Contact"
            title="Talk to our export team"
            copy="We reply to enquiries within one business day, in English."
            center
          />

          <div className="contact-grid">
            <div className="wa-box" style={{ marginTop: 0 }}>
              <div className="wa-head">
                <span className="wa-icon"><WhatsAppIcon size={22} /></span>
                <h3>Send an enquiry</h3>
              </div>
              <p className="wa-sub">
                Fill this in and we will open WhatsApp with your message ready to send.
                Nothing is submitted from this page.
              </p>

              <div className="wa-row">
                <div className="field">
                  <label htmlFor="c-name">Your name</label>
                  <input id="c-name" value={form.name} onChange={set('name')} autoComplete="name" />
                </div>
                <div className="field">
                  <label htmlFor="c-company">Company</label>
                  <input id="c-company" value={form.company} onChange={set('company')} autoComplete="organization" />
                </div>
              </div>

              <div className="wa-row">
                <div className="field">
                  <label htmlFor="c-country">Country</label>
                  <input id="c-country" value={form.country} onChange={set('country')} autoComplete="country-name" />
                </div>
                <div className="field">
                  <label htmlFor="c-category">Collection of interest</label>
                  <select id="c-category" value={form.category} onChange={set('category')}>
                    <option value="">Select…</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="field">
                <label htmlFor="c-message">Message</label>
                <textarea
                  id="c-message"
                  value={form.message}
                  onChange={set('message')}
                  placeholder="Quantities, target market, delivery terms…"
                />
              </div>

              <a className="btn btn-wa btn-block" href={waLink(message)} target="_blank" rel="noreferrer">
                <WhatsAppIcon size={18} />
                Send on WhatsApp
              </a>
            </div>

            <div>
              <h3 style={{ marginBottom: 16 }}>Direct contact</h3>
              <address style={{ fontStyle: 'normal', lineHeight: 1.9, color: 'var(--muted)' }}>
                <span style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
                  <PinIcon size={17} /> {site.address}
                </span>
                <span style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
                  <PhoneIcon size={17} />
                  <a href={`tel:${site.whatsapp}`} style={{ color: 'var(--accent)' }}>
                    {site.phoneDisplay}
                  </a>
                </span>
                <span style={{ display: 'flex', gap: 10 }}>
                  <MailIcon size={17} />
                  <a href={`mailto:${site.email}`} style={{ color: 'var(--accent)' }}>
                    {site.email}
                  </a>
                </span>
              </address>

              <h3 style={{ margin: '30px 0 12px' }}>Office hours</h3>
              <p style={{ color: 'var(--muted)' }}>
                {site.officeHours.split('\n').map((line, i, arr) => (
                  <span key={line}>
                    {line}
                    {i < arr.length - 1 && <br />}
                  </span>
                ))}
              </p>

              <h3 style={{ margin: '30px 0 12px' }}>Visiting</h3>
              <p style={{ color: 'var(--muted)' }}>{site.visitingNote}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
