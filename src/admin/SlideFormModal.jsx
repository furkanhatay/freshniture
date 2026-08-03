import { useState } from 'react';
import { CloseIcon } from '../components/Icons';

const emptyForm = (slide) => ({
  eyebrow: slide?.eyebrow || '',
  title: slide?.title || '',
  copy: slide?.copy || '',
  cta: slide?.cta || 'Shop now',
  to: slide?.to || '/collections',
  image: slide?.image || '',
});

/**
 * Add/edit panel for a home page banner slide. `onSave` may throw (missing
 * title or image) — the modal shows the error inline and stays open.
 */
export function SlideFormModal({ slide, categories, onClose, onSave }) {
  const [form, setForm] = useState(() => emptyForm(slide));
  const [error, setError] = useState('');
  const isEdit = Boolean(slide);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    try {
      onSave(form);
      onClose();
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    }
  };

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()} role="presentation">
      <div className="admin-form-modal" role="dialog" aria-modal="true" aria-label={isEdit ? 'Edit slide' : 'Add slide'}>
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
          <CloseIcon />
        </button>

        <h2 style={{ fontSize: 24, marginBottom: 4 }}>{isEdit ? 'Edit slide' : 'Add slide'}</h2>
        <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 20 }}>
          One panel of the rotating banner at the top of the home page.
        </p>

        <form onSubmit={submit}>
          <div className="field">
            <label htmlFor="sl-eyebrow">Eyebrow</label>
            <input
              id="sl-eyebrow"
              value={form.eyebrow}
              onChange={set('eyebrow')}
              placeholder="e.g. WHOLESALE ONLY"
              style={{ textTransform: 'uppercase' }}
            />
            <div className="hint">Small label above the headline.</div>
          </div>

          <div className="field">
            <label htmlFor="sl-title">Headline</label>
            <input id="sl-title" value={form.title} onChange={set('title')} placeholder="e.g. Solid oak dining programs in stock" required />
          </div>

          <div className="field">
            <label htmlFor="sl-copy">Supporting line</label>
            <textarea
              id="sl-copy"
              value={form.copy}
              onChange={set('copy')}
              placeholder="One sentence under the headline."
              style={{ minHeight: 64 }}
            />
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="sl-cta">Button label</label>
              <input id="sl-cta" value={form.cta} onChange={set('cta')} placeholder="e.g. Shop dining sets" />
            </div>
            <div className="field">
              <label htmlFor="sl-to">Button links to</label>
              {categories?.length > 0 ? (
                <select id="sl-to" value={form.to} onChange={set('to')}>
                  <option value="/collections">All collections</option>
                  <option value="/gallery">Full gallery</option>
                  {categories.map((c) => (
                    <option key={c.id} value={`/c/${c.id}`}>{c.name}</option>
                  ))}
                </select>
              ) : (
                <input id="sl-to" value={form.to} onChange={set('to')} placeholder="/collections" />
              )}
            </div>
          </div>

          <div className="field">
            <label htmlFor="sl-image">Image URL</label>
            <input id="sl-image" value={form.image} onChange={set('image')} placeholder="https://…" required />
            <div className="hint">Wide landscape images work best — around 2000 x 1100.</div>
          </div>

          {form.image && (
            <div style={{ marginBottom: 16, borderRadius: 'var(--radius)', overflow: 'hidden', border: '1px solid var(--line)' }}>
              <img
                src={form.image}
                alt=""
                style={{ width: '100%', height: 140, objectFit: 'cover', display: 'block' }}
                onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }}
                onLoad={(e) => { e.currentTarget.style.visibility = 'visible'; }}
              />
            </div>
          )}

          {error && <div className="error-text" style={{ marginBottom: 14 }}>{error}</div>}

          <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-dark" style={{ flex: 1 }}>
              {isEdit ? 'Save changes' : 'Add slide'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
