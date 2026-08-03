import { useState } from 'react';
import { CloseIcon } from '../components/Icons';

/** Pulls the three numbers back out of "120 W x 60 D x 75 H cm" for editing. */
function parseDimensions(dimensions) {
  const match = /^(\d+)\s*W\s*x\s*(\d+)\s*D\s*x\s*(\d+)\s*H/i.exec(dimensions || '');
  return match
    ? { width: match[1], depth: match[2], height: match[3] }
    : { width: '', depth: '', height: '' };
}

const emptyForm = (item, defaultCategory) => ({
  name: item?.name || '',
  category: item?.category || defaultCategory || '',
  code: item?.code || '',
  images: item?.images?.join('\n') || '',
  material: item?.material || '',
  finish: item?.finish || '',
  fabric: item?.fabric || '',
  ...parseDimensions(item?.dimensions),
  pieces: item?.pieces ?? 1,
  seats: item?.seats ?? '',
  moq: item?.moq || '',
  leadTime: item?.leadTime || '',
  packing: item?.packing || '',
  cbm: item?.cbm || '',
  per40hq: item?.per40hq ?? '',
  certifications: item?.certifications?.join(', ') || '',
  customisable: item?.customisable ?? true,
  colourways: item?.colourways ?? '',
  description: item?.description || '',
});

/**
 * Add/edit panel for a gallery item — this is the product that opens in the
 * detail modal on the public site. `onSave` may throw (missing name, no
 * images, …); the error is shown inline and the form stays open.
 */
export function ItemFormModal({ item, categories, defaultCategory, onClose, onSave }) {
  const [form, setForm] = useState(() => emptyForm(item, defaultCategory));
  const [error, setError] = useState('');
  const isEdit = Boolean(item);

  const set = (key) => (e) => {
    const { value, type, checked } = e.target;
    setForm((f) => ({ ...f, [key]: type === 'checkbox' ? checked : value }));
  };

  const submit = (e) => {
    e.preventDefault();
    try {
      onSave({
        ...form,
        images: form.images.split('\n').map((s) => s.trim()).filter(Boolean),
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    }
  };

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()} role="presentation">
      <div className="admin-form-modal" role="dialog" aria-modal="true" aria-label={isEdit ? 'Edit gallery item' : 'Add gallery item'}>
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
          <CloseIcon />
        </button>

        <h2 style={{ fontSize: 24, marginBottom: 4 }}>{isEdit ? 'Edit gallery item' : 'Add gallery item'}</h2>
        <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 20 }}>
          This is what opens when a visitor clicks an image in the gallery.
        </p>

        <form onSubmit={submit}>
          <div className="field-row">
            <div className="field">
              <label htmlFor="it-name">Product name</label>
              <input id="it-name" value={form.name} onChange={set('name')} placeholder="e.g. Verona Marble Console" required />
            </div>
            <div className="field">
              <label htmlFor="it-category">Category</label>
              <select id="it-category" value={form.category} onChange={set('category')} required>
                <option value="" disabled>Select…</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="field">
            <label htmlFor="it-code">Product code</label>
            <input id="it-code" value={form.code} onChange={set('code')} placeholder="Leave blank to auto-generate" />
          </div>

          <div className="field">
            <label htmlFor="it-images">Image URLs</label>
            <textarea
              id="it-images"
              value={form.images}
              onChange={set('images')}
              placeholder={'One image URL per line — the first is used as the gallery thumbnail.\nhttps://…\nhttps://…'}
              style={{ minHeight: 90 }}
              required
            />
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="it-material">Material</label>
              <input id="it-material" value={form.material} onChange={set('material')} placeholder="e.g. Solid oak, oiled finish" />
            </div>
            <div className="field">
              <label htmlFor="it-finish">Finish</label>
              <input id="it-finish" value={form.finish} onChange={set('finish')} placeholder="e.g. Walnut" />
            </div>
          </div>

          <div className="field">
            <label htmlFor="it-fabric">Upholstery / fabric (optional)</label>
            <input id="it-fabric" value={form.fabric} onChange={set('fabric')} placeholder="Leave blank if not upholstered" />
          </div>

          <div className="field">
            <label>Dimensions (cm)</label>
            <div className="field-row field-row-3">
              <input aria-label="Width" type="number" min="0" value={form.width} onChange={set('width')} placeholder="Width" />
              <input aria-label="Depth" type="number" min="0" value={form.depth} onChange={set('depth')} placeholder="Depth" />
              <input aria-label="Height" type="number" min="0" value={form.height} onChange={set('height')} placeholder="Height" />
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="it-pieces">Pieces in set</label>
              <input id="it-pieces" type="number" min="1" value={form.pieces} onChange={set('pieces')} />
            </div>
            <div className="field">
              <label htmlFor="it-seats">Seating capacity (optional)</label>
              <input id="it-seats" type="number" min="0" value={form.seats} onChange={set('seats')} placeholder="Leave blank if not applicable" />
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="it-moq">Minimum order</label>
              <input id="it-moq" value={form.moq} onChange={set('moq')} placeholder="e.g. 20 sets" />
            </div>
            <div className="field">
              <label htmlFor="it-lead">Production time</label>
              <input id="it-lead" value={form.leadTime} onChange={set('leadTime')} placeholder="e.g. 35 days" />
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="it-cbm">Volume (m³ per unit)</label>
              <input id="it-cbm" value={form.cbm} onChange={set('cbm')} placeholder="e.g. 1.20" />
            </div>
            <div className="field">
              <label htmlFor="it-per40">Units per 40' HQ</label>
              <input id="it-per40" type="number" min="0" value={form.per40hq} onChange={set('per40hq')} />
            </div>
          </div>

          <div className="field">
            <label htmlFor="it-packing">Packing</label>
            <input id="it-packing" value={form.packing} onChange={set('packing')} placeholder="e.g. Export carton with EPE foam" />
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="it-certs">Certifications</label>
              <input id="it-certs" value={form.certifications} onChange={set('certifications')} placeholder="Comma-separated, e.g. ISO 9001, FSC" />
            </div>
            <div className="field">
              <label htmlFor="it-colours">Colourways</label>
              <input id="it-colours" type="number" min="1" value={form.colourways} onChange={set('colourways')} />
            </div>
          </div>

          <label className="check" style={{ marginBottom: 14 }}>
            <input type="checkbox" checked={form.customisable} onChange={set('customisable')} />
            Available as OEM / custom sizes
          </label>

          <div className="field">
            <label htmlFor="it-desc">Description</label>
            <textarea
              id="it-desc"
              value={form.description}
              onChange={set('description')}
              placeholder="Shown above the specification table in the detail panel."
              style={{ minHeight: 84 }}
            />
          </div>

          {error && <div className="error-text" style={{ marginBottom: 14 }}>{error}</div>}

          <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-dark" style={{ flex: 1 }}>
              {isEdit ? 'Save changes' : 'Add item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
