import { useState } from 'react';
import { CloseIcon } from '../components/Icons';

const emptyForm = (category) => ({
  name: category?.name || '',
  blurb: category?.blurb || '',
  image: category?.image || '',
});

/**
 * Add/edit panel for a category. `onSave` receives the form values and may
 * throw an Error (e.g. duplicate name, missing image) — the modal shows it
 * inline and stays open so nothing is lost.
 */
export function CategoryFormModal({ category, onClose, onSave }) {
  const [form, setForm] = useState(() => emptyForm(category));
  const [error, setError] = useState('');
  const isEdit = Boolean(category);

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
      <div className="admin-form-modal" role="dialog" aria-modal="true" aria-label={isEdit ? 'Edit category' : 'Add category'}>
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
          <CloseIcon />
        </button>

        <h2 style={{ fontSize: 24, marginBottom: 4 }}>{isEdit ? 'Edit category' : 'Add category'}</h2>
        <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 20 }}>
          This is one of the circle tiles shown on the home page and in the collections menu.
        </p>

        <form onSubmit={submit}>
          <div className="field">
            <label htmlFor="cat-name">Category name</label>
            <input id="cat-name" value={form.name} onChange={set('name')} placeholder="e.g. Bar Cabinets" required />
          </div>

          <div className="field">
            <label htmlFor="cat-blurb">Short description</label>
            <textarea
              id="cat-blurb"
              value={form.blurb}
              onChange={set('blurb')}
              placeholder="One line shown under the category name on the collections page."
              style={{ minHeight: 60 }}
            />
          </div>

          <div className="field">
            <label htmlFor="cat-image">Image URL</label>
            <input
              id="cat-image"
              value={form.image}
              onChange={set('image')}
              placeholder="https://…"
              required
            />
            <div className="hint">Shown inside the lilac circle. Square images work best.</div>
          </div>

          {form.image && (
            <div style={{ marginBottom: 16 }}>
              <img
                src={form.image}
                alt=""
                style={{ width: 84, height: 84, borderRadius: '50%', objectFit: 'cover', background: 'var(--lilac)' }}
                onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }}
                onLoad={(e) => { e.currentTarget.style.visibility = 'visible'; }}
              />
            </div>
          )}

          {error && <div className="error-text" style={{ marginBottom: 14 }}>{error}</div>}

          <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-dark" style={{ flex: 1 }}>
              {isEdit ? 'Save changes' : 'Add category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
