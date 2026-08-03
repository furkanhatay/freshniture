import { useState } from 'react';
import { ImageModal } from './ImageModal';
import { useCatalog } from '../store/CatalogContext';

/**
 * Uniform image grid. Clicking any image opens the detail modal with the
 * specifications and the WhatsApp enquiry box.
 */
export function Gallery({ items, initialCount = items.length, wide = false }) {
  const { categoryById } = useCatalog();
  const [openIndex, setOpenIndex] = useState(null);
  const [shown, setShown] = useState(initialCount);

  const visible = items.slice(0, shown);

  return (
    <>
      <div className={`gallery${wide ? ' cols-2' : ''}`}>
        {visible.map((item, i) => (
          <button
            type="button"
            className="gallery-item"
            key={item.id}
            onClick={() => setOpenIndex(i)}
            aria-label={`View details for ${item.name}`}
          >
            <img src={item.images[0]} alt="" loading="lazy" />
            <span className="gi-code">{item.code}</span>
            <span className="gi-overlay">
              <span className="gi-text">
                <strong>{item.name}</strong>
                <span>{categoryById[item.category]?.name}</span>
              </span>
            </span>
          </button>
        ))}
      </div>

      {shown < items.length && (
        <div className="load-more">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => setShown((n) => Math.min(n + 12, items.length))}
          >
            Load more ({items.length - shown} remaining)
          </button>
        </div>
      )}

      {openIndex !== null && (
        <ImageModal
          items={visible}
          index={openIndex}
          onIndexChange={setOpenIndex}
          onClose={() => setOpenIndex(null)}
        />
      )}
    </>
  );
}
