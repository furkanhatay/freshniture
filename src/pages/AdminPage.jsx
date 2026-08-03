import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminGate, adminLogout } from '../admin/AdminGate';
import { CategoryFormModal } from '../admin/CategoryFormModal';
import { ItemFormModal } from '../admin/ItemFormModal';
import { SlideFormModal } from '../admin/SlideFormModal';
import { ChevronDown, ChevronUp } from '../components/Icons';
import { useCatalog } from '../store/CatalogContext';
import { useSiteSettings, DEFAULT_SETTINGS } from '../store/SiteSettingsContext';

function CategoriesTab({ catalog }) {
  const {
    categories, itemCountByCategory, addCategory, updateCategory, deleteCategory,
  } = catalog;
  const [editing, setEditing] = useState(null); // null = closed, {} = add, category = edit
  const [error, setError] = useState('');

  const remove = (category) => {
    if (!window.confirm(`Delete "${category.name}"? This cannot be undone.`)) return;
    try {
      deleteCategory(category.id);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <div className="admin-toolbar">
        <span style={{ fontSize: 13.5, color: 'var(--muted)' }}>
          {categories.length} {categories.length === 1 ? 'category' : 'categories'}
        </span>
        <button type="button" className="btn btn-dark btn-sm" onClick={() => setEditing({})}>
          + Add category
        </button>
      </div>

      {error && <div className="error-text" style={{ marginBottom: 14 }}>{error}</div>}

      {categories.length === 0 ? (
        <div className="admin-empty">No categories yet. Add your first one to get started.</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Items</th>
                <th>ID</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div className="admin-cell-media">
                      <img className="admin-thumb round" src={c.image} alt="" loading="lazy" />
                      <div>
                        <strong>{c.name}</strong>
                        <span>{c.blurb}</span>
                      </div>
                    </div>
                  </td>
                  <td>{itemCountByCategory[c.id] || 0}</td>
                  <td style={{ color: 'var(--muted-2)', fontSize: 12.5 }}>{c.id}</td>
                  <td>
                    <div className="admin-row-actions">
                      <button type="button" onClick={() => setEditing(c)}>Edit</button>
                      <button type="button" className="danger" onClick={() => remove(c)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <CategoryFormModal
          category={editing.id ? editing : null}
          onClose={() => setEditing(null)}
          onSave={(data) => {
            if (editing.id) updateCategory(editing.id, data);
            else addCategory(data);
          }}
        />
      )}
    </>
  );
}

function ItemsTab({ catalog }) {
  const {
    categories, categoryById, items, addItem, updateItem, deleteItem,
  } = catalog;
  const [editing, setEditing] = useState(null); // null = closed, {} = add, item = edit
  const [filter, setFilter] = useState('all');

  const visible = filter === 'all' ? items : items.filter((i) => i.category === filter);

  const remove = (item) => {
    if (!window.confirm(`Delete "${item.name}"? This cannot be undone.`)) return;
    deleteItem(item.id);
  };

  return (
    <>
      <div className="admin-toolbar">
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="select" aria-label="Filter by category">
          <option value="all">All categories ({items.length})</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <button
          type="button"
          className="btn btn-dark btn-sm"
          onClick={() => setEditing({})}
          disabled={categories.length === 0}
        >
          + Add gallery item
        </button>
      </div>

      {categories.length === 0 && (
        <div className="admin-empty">Add a category first, then you can add items to it.</div>
      )}

      {categories.length > 0 && visible.length === 0 && (
        <div className="admin-empty">No gallery items in this category yet.</div>
      )}

      {visible.length > 0 && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Category</th>
                <th>Code</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {visible.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="admin-cell-media">
                      <img className="admin-thumb" src={item.images[0]} alt="" loading="lazy" />
                      <div>
                        <strong>{item.name}</strong>
                        <span>{item.material}</span>
                      </div>
                    </div>
                  </td>
                  <td>{categoryById[item.category]?.name || item.category}</td>
                  <td style={{ color: 'var(--muted-2)', fontSize: 12.5 }}>{item.code}</td>
                  <td>
                    <div className="admin-row-actions">
                      <button type="button" onClick={() => setEditing(item)}>Edit</button>
                      <button type="button" className="danger" onClick={() => remove(item)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <ItemFormModal
          item={editing.id ? editing : null}
          categories={categories}
          defaultCategory={filter !== 'all' ? filter : categories[0]?.id}
          onClose={() => setEditing(null)}
          onSave={(data) => {
            if (editing.id) updateItem(editing.id, data);
            else addItem(data);
          }}
        />
      )}
    </>
  );
}

function SlidesTab({ settings, categories }) {
  const {
    heroSlides, addSlide, updateSlide, deleteSlide, moveSlide, resetSlides,
  } = settings;
  const [editing, setEditing] = useState(null); // null = closed, {} = add, slide = edit
  const [error, setError] = useState('');

  const remove = (slide) => {
    if (!window.confirm(`Delete the "${slide.title}" slide?`)) return;
    try {
      deleteSlide(slide.id);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const doReset = () => {
    if (window.confirm('Reset the home page slider back to the demo slides? Your changes will be lost.')) {
      resetSlides();
    }
  };

  return (
    <>
      <div className="admin-toolbar">
        <span style={{ fontSize: 13.5, color: 'var(--muted)' }}>
          {heroSlides.length} {heroSlides.length === 1 ? 'slide' : 'slides'}
        </span>
        <div style={{ display: 'flex', gap: 10 }}>
          <button type="button" className="btn btn-outline btn-sm" onClick={doReset}>Reset slides</button>
          <button type="button" className="btn btn-dark btn-sm" onClick={() => setEditing({})}>+ Add slide</button>
        </div>
      </div>

      {error && <div className="error-text" style={{ marginBottom: 14 }}>{error}</div>}

      <p style={{ color: 'var(--muted)', fontSize: 13.5, marginBottom: 18 }}>
        These rotate automatically on the home page banner, in this order. The first slide
        shows first.
      </p>

      <div className="admin-slide-list">
        {heroSlides.map((s, i) => (
          <div className="admin-slide-card" key={s.id}>
            <img src={s.image} alt="" loading="lazy" />
            <div>
              {s.eyebrow && <div className="asc-eyebrow">{s.eyebrow}</div>}
              <h4>{s.title}</h4>
              <p>&ldquo;{s.cta}&rdquo; &rarr; {s.to}</p>
            </div>
            <div className="admin-slide-controls">
              <button
                type="button"
                onClick={() => moveSlide(s.id, -1)}
                disabled={i === 0}
                aria-label="Move slide up"
              >
                <ChevronUp size={15} />
              </button>
              <button
                type="button"
                onClick={() => moveSlide(s.id, 1)}
                disabled={i === heroSlides.length - 1}
                aria-label="Move slide down"
              >
                <ChevronDown size={15} />
              </button>
              <span className="sep" />
              <div className="admin-row-actions">
                <button type="button" onClick={() => setEditing(s)}>Edit</button>
                <button type="button" className="danger" onClick={() => remove(s)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <SlideFormModal
          slide={editing.id ? editing : null}
          categories={categories}
          onClose={() => setEditing(null)}
          onSave={(data) => {
            if (editing.id) updateSlide(editing.id, data);
            else addSlide(data);
          }}
        />
      )}
    </>
  );
}

function SettingsTab({ settings }) {
  const { site, updateSettings, resetSettings } = settings;
  const [form, setForm] = useState(() => ({ ...site }));
  const [saved, setSaved] = useState(false);

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setSaved(false);
  };

  const submit = (e) => {
    e.preventDefault();
    updateSettings(form);
    setSaved(true);
  };

  const doReset = () => {
    if (window.confirm('Reset all site settings back to the defaults? Your changes will be lost.')) {
      resetSettings();
      setForm({ ...DEFAULT_SETTINGS });
      setSaved(false);
    }
  };

  return (
    <form className="admin-settings-form" onSubmit={submit}>
      <div className="admin-settings-section">
        <h3>Brand</h3>
        <p className="ass-note">Shown in the header, footer and page titles across the site.</p>
        <div className="field-row">
          <div className="field">
            <label htmlFor="st-brand">Brand name</label>
            <input id="st-brand" value={form.brand} onChange={set('brand')} required />
          </div>
          <div className="field">
            <label htmlFor="st-tagline">Tagline</label>
            <input id="st-tagline" value={form.tagline} onChange={set('tagline')} />
          </div>
        </div>
        <div className="field">
          <label htmlFor="st-intro">Intro line</label>
          <textarea
            id="st-intro"
            value={form.intro}
            onChange={set('intro')}
            style={{ minHeight: 60 }}
          />
          <div className="hint">Shown in the top bar and in the footer.</div>
        </div>
      </div>

      <div className="admin-settings-section">
        <h3>WhatsApp &amp; contact</h3>
        <p className="ass-note">Every enquiry button on the site links to this number.</p>
        <div className="field-row">
          <div className="field">
            <label htmlFor="st-wa">WhatsApp number</label>
            <input id="st-wa" value={form.whatsapp} onChange={set('whatsapp')} required />
            <div className="hint">Country code first, digits only — no + or spaces, e.g. 905551112233</div>
          </div>
          <div className="field">
            <label htmlFor="st-phone">Phone number shown to visitors</label>
            <input id="st-phone" value={form.phoneDisplay} onChange={set('phoneDisplay')} placeholder="e.g. +90 555 111 22 33" />
          </div>
        </div>
        <div className="field-row">
          <div className="field">
            <label htmlFor="st-email">Email</label>
            <input id="st-email" type="email" value={form.email} onChange={set('email')} required />
          </div>
          <div className="field">
            <label htmlFor="st-signature">Enquiry signature</label>
            <input id="st-signature" value={form.enquirySource} onChange={set('enquirySource')} />
            <div className="hint">Appended to every WhatsApp message, so you know it came from the site.</div>
          </div>
        </div>
        <div className="field">
          <label htmlFor="st-address">Address</label>
          <textarea
            id="st-address"
            value={form.address}
            onChange={set('address')}
            style={{ minHeight: 60 }}
          />
        </div>
      </div>

      <div className="admin-settings-section">
        <h3>Instagram</h3>
        <div className="field-row">
          <div className="field">
            <label htmlFor="st-ig-handle">Handle</label>
            <input
              id="st-ig-handle"
              value={form.instagram}
              onChange={set('instagram')}
              placeholder="yourhandle (without @)"
            />
          </div>
          <div className="field">
            <label htmlFor="st-ig-url">Profile URL</label>
            <input id="st-ig-url" value={form.instagramUrl} onChange={set('instagramUrl')} placeholder="https://instagram.com/…" />
          </div>
        </div>
        <div className="field">
          <label htmlFor="st-ig-feed">Live feed URL (optional)</label>
          <input
            id="st-ig-feed"
            value={form.instagramFeedUrl}
            onChange={set('instagramFeedUrl')}
            placeholder="https://feeds.behold.so/…"
          />
          <div className="hint">
            Paste your Behold.so feed URL here to show real Instagram photos on the site.
            Leave blank to keep the demo photos.
          </div>
        </div>
      </div>

      <div className="admin-settings-section">
        <h3>Contact page</h3>
        <p className="ass-note">The office hours and visiting note shown on the Contact page.</p>
        <div className="field">
          <label htmlFor="st-hours">Office hours</label>
          <textarea
            id="st-hours"
            value={form.officeHours}
            onChange={set('officeHours')}
            style={{ minHeight: 64 }}
          />
          <div className="hint">One line per row, e.g. &ldquo;Monday to Friday, 08:30–18:00&rdquo;.</div>
        </div>
        <div className="field">
          <label htmlFor="st-visiting">Visiting note</label>
          <textarea
            id="st-visiting"
            value={form.visitingNote}
            onChange={set('visitingNote')}
            style={{ minHeight: 64 }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <button type="submit" className="btn btn-dark">Save changes</button>
        <button type="button" className="btn btn-outline" onClick={doReset}>Reset to defaults</button>
        {saved && <span style={{ color: 'var(--whatsapp-dark)', fontSize: 13, fontWeight: 600 }}>Saved</span>}
      </div>
    </form>
  );
}

const TABS = [
  { id: 'categories', label: 'Categories' },
  { id: 'items', label: 'Gallery items' },
  { id: 'slides', label: 'Home slider' },
  { id: 'settings', label: 'Settings' },
];

function AdminDashboard() {
  const catalog = useCatalog();
  const settings = useSiteSettings();
  const [tab, setTab] = useState('categories');

  const doResetCatalog = () => {
    if (window.confirm('Reset categories and gallery items back to the demo data? Your changes will be lost.')) {
      catalog.resetToDemo();
    }
  };

  const doLogout = () => {
    adminLogout();
    window.location.reload();
  };

  return (
    <div className="admin-shell">
      <div className="admin-header">
        <div>
          <h1>{settings.site.brand} admin</h1>
          <p>Changes save automatically in this browser and appear on the site immediately.</p>
        </div>
        <div className="admin-header-actions">
          <Link className="btn btn-outline btn-sm" to="/">View site</Link>
          {(tab === 'categories' || tab === 'items') && (
            <button type="button" className="btn btn-outline btn-sm" onClick={doResetCatalog}>
              Reset demo data
            </button>
          )}
          <button type="button" className="btn btn-outline btn-sm" onClick={doLogout}>Log out</button>
        </div>
      </div>

      <nav className="admin-tabs">
        {TABS.map((t) => (
          <button key={t.id} type="button" className={tab === t.id ? 'on' : ''} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </nav>

      {tab === 'categories' && <CategoriesTab catalog={catalog} />}
      {tab === 'items' && <ItemsTab catalog={catalog} />}
      {tab === 'slides' && <SlidesTab settings={settings} categories={catalog.categories} />}
      {tab === 'settings' && <SettingsTab settings={settings} />}
    </div>
  );
}

export function AdminPage() {
  return (
    <AdminGate>
      <AdminDashboard />
    </AdminGate>
  );
}
