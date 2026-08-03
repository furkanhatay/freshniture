import { useState } from 'react';
import { Gallery } from '../components/Gallery';
import { SectionTitle } from '../components/SectionTitle';
import { useCatalog } from '../store/CatalogContext';

export function GalleryPage() {
  const { categories, items, itemsInCategory } = useCatalog();
  const [filter, setFilter] = useState('all');
  const visible = filter === 'all' ? items : itemsInCategory(filter);

  return (
    <div className="page">
      <section className="section">
        <div className="shell">
          <SectionTitle
            eyebrow="Gallery"
            title="Full product gallery"
            copy="Every model we currently produce. Click an image for specifications and a WhatsApp enquiry."
            center
          />

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 8,
              justifyContent: 'center',
              marginBottom: 34,
            }}
          >
            {[{ id: 'all', name: 'All' }, ...categories].map((c) => (
              <button
                key={c.id}
                type="button"
                className={`btn btn-sm ${filter === c.id ? 'btn-dark' : 'btn-outline'}`}
                onClick={() => setFilter(c.id)}
              >
                {c.name}
              </button>
            ))}
          </div>

          <Gallery items={visible} initialCount={18} />
        </div>
      </section>
    </div>
  );
}
