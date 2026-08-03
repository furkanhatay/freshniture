import { useEffect, useRef, useState } from 'react';
import {
  ChevronLeft, ChevronRight, CloseIcon, MailIcon, PhoneIcon, WhatsAppIcon,
} from './Icons';
import { useCatalog } from '../store/CatalogContext';
import { useSiteSettings } from '../store/SiteSettingsContext';

/** Builds the message that gets pre-filled in WhatsApp. */
function buildMessage(item, form, categoryName, site) {
  const lines = [
    `Hello ${site.brand},`,
    '',
    `I am interested in: ${item.name} (${item.code})`,
    `Category: ${categoryName}`,
  ];
  if (form.quantity.trim()) lines.push(`Quantity needed: ${form.quantity.trim()}`);
  if (form.country.trim()) lines.push(`Destination: ${form.country.trim()}`);
  if (form.company.trim()) lines.push(`Company: ${form.company.trim()}`);
  if (form.name.trim()) lines.push(`Contact: ${form.name.trim()}`);
  if (form.message.trim()) {
    lines.push('', form.message.trim());
  }
  lines.push('', `(${site.enquirySource})`);
  return lines.join('\n');
}

const EMPTY_FORM = { name: '', company: '', quantity: '', country: '', message: '' };

function WhatsAppBox({ item, categoryName }) {
  const { site, waLink } = useSiteSettings();
  const [form, setForm] = useState(EMPTY_FORM);

  // Starting a new product means starting a new enquiry.
  useEffect(() => setForm(EMPTY_FORM), [item.id]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const href = waLink(buildMessage(item, form, categoryName, site));

  return (
    <div className="wa-box">
      <div className="wa-head">
        <span className="wa-icon"><WhatsAppIcon size={22} /></span>
        <h3>Enquire about this product</h3>
      </div>
      <p className="wa-sub">
        Fill in what you need and we will open WhatsApp with your message ready to send.
        Nothing is submitted from this page.
      </p>

      <div className="wa-row">
        <div className="field">
          <label htmlFor="wa-name">Your name</label>
          <input id="wa-name" value={form.name} onChange={set('name')} autoComplete="name" />
        </div>
        <div className="field">
          <label htmlFor="wa-company">Company</label>
          <input id="wa-company" value={form.company} onChange={set('company')} autoComplete="organization" />
        </div>
      </div>

      <div className="wa-row">
        <div className="field">
          <label htmlFor="wa-qty">Quantity</label>
          <input id="wa-qty" value={form.quantity} onChange={set('quantity')} placeholder={`e.g. ${item.moq}`} />
        </div>
        <div className="field">
          <label htmlFor="wa-country">Destination country</label>
          <input id="wa-country" value={form.country} onChange={set('country')} autoComplete="country-name" />
        </div>
      </div>

      <div className="field">
        <label htmlFor="wa-message">Message</label>
        <textarea
          id="wa-message"
          value={form.message}
          onChange={set('message')}
          placeholder="Finishes, fabrics, target price, delivery terms…"
        />
      </div>

      <a className="btn btn-wa btn-block" href={href} target="_blank" rel="noreferrer">
        <WhatsAppIcon size={18} />
        Send on WhatsApp
      </a>

      <div className="wa-alt">
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
          <MailIcon size={15} />
          <a href={`mailto:${site.email}?subject=${encodeURIComponent(`Enquiry: ${item.name} (${item.code})`)}`}>
            {site.email}
          </a>
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
          <PhoneIcon size={15} />
          {site.phoneDisplay}
        </span>
      </div>
    </div>
  );
}

export function ImageModal({ items, index, onIndexChange, onClose }) {
  const { categoryById } = useCatalog();
  const item = items[index];
  const categoryName = categoryById[item.category]?.name || item.category;
  const [imageIndex, setImageIndex] = useState(0);
  const closeRef = useRef(null);
  const infoRef = useRef(null);

  useEffect(() => {
    setImageIndex(0);
    infoRef.current?.scrollTo({ top: 0 });
  }, [item.id]);

  // Trap the page behind the modal and wire up keyboard controls.
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onIndexChange((index + 1) % items.length);
      if (e.key === 'ArrowLeft') onIndexChange((index - 1 + items.length) % items.length);
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKey);
    };
  }, [index, items.length, onClose, onIndexChange]);

  const stepImage = (d) =>
    setImageIndex((i) => (i + d + item.images.length) % item.images.length);

  const specs = [
    ['Product code', item.code],
    ['Category', categoryName],
    ['Material', item.material],
    ['Finish', item.finish],
    item.fabric && ['Upholstery', item.fabric],
    ['Dimensions', item.dimensions],
    item.pieces > 1 && ['Pieces in set', `${item.pieces} pcs`],
    item.seats && ['Seating capacity', `${item.seats} people`],
    ['Minimum order', item.moq],
    ['Production time', item.leadTime],
    ['Volume', `${item.cbm} m³ per unit`],
    ['Loading', `approx. ${item.per40hq} units per 40' HQ`],
    ['Packing', item.packing],
  ].filter(Boolean);

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="presentation"
    >
      <div className="modal" role="dialog" aria-modal="true" aria-label={item.name}>
        <button type="button" className="modal-close" onClick={onClose} ref={closeRef} aria-label="Close">
          <CloseIcon />
        </button>

        <div className="modal-media">
          <div className="modal-stage">
            <img src={item.images[imageIndex]} alt={`${item.name} — view ${imageIndex + 1}`} />
            {item.images.length > 1 && (
              <>
                <button type="button" className="ms-nav prev" onClick={() => stepImage(-1)} aria-label="Previous image">
                  <ChevronLeft />
                </button>
                <button type="button" className="ms-nav next" onClick={() => stepImage(1)} aria-label="Next image">
                  <ChevronRight />
                </button>
                <span className="ms-counter">{imageIndex + 1} / {item.images.length}</span>
              </>
            )}
          </div>

          {item.images.length > 1 && (
            <div className="modal-thumbs">
              {item.images.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  className={i === imageIndex ? 'on' : ''}
                  onClick={() => setImageIndex(i)}
                  aria-label={`View image ${i + 1}`}
                >
                  <img src={src} alt="" loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="modal-info" ref={infoRef}>
          <div className="mi-cat">{categoryName}</div>
          <h2>{item.name}</h2>
          <div className="mi-code">Code {item.code}</div>
          <p className="mi-desc">{item.description}</p>

          <table className="spec-table">
            <tbody>
              {specs.map(([label, value]) => (
                <tr key={label}>
                  <th scope="row">{label}</th>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="tag-row">
            {item.customisable && <span className="tag">OEM / custom sizes</span>}
            <span className="tag">{item.colourways} colourways</span>
            {item.certifications.map((c) => <span className="tag" key={c}>{c}</span>)}
          </div>

          <WhatsAppBox item={item} categoryName={categoryName} />

          {items.length > 1 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginTop: 22 }}>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => onIndexChange((index - 1 + items.length) % items.length)}
              >
                <ChevronLeft size={15} /> Previous
              </button>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => onIndexChange((index + 1) % items.length)}
              >
                Next <ChevronRight size={15} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
