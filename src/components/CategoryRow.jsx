import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from './Icons';

/**
 * Lilac circle tile with the category name underneath.
 *
 * `cutout` is for transparent-PNG product shots — they float inside the disc
 * instead of filling it. Demo images are photographs, so it is off by default.
 */
export function CategoryCircle({ category, active = false, cutout = false, showBlurb = false }) {
  return (
    <Link
      className={`category-circle${active ? ' active' : ''}`}
      to={`/c/${category.id}`}
      aria-current={active ? 'page' : undefined}
    >
      <span className={`cc-media${cutout ? ' cutout' : ''}`}>
        <img src={category.image} alt="" loading="lazy" />
      </span>
      <span className="cc-label">{category.name}</span>
      {showBlurb && <span className="cc-blurb">{category.blurb}</span>}
    </Link>
  );
}

/** Grid of circle tiles that wraps — used on the collections and category pages. */
export function CategoryCircleGrid({ categories, activeId, showBlurb = false }) {
  return (
    <div className="category-grid">
      {categories.map((c) => (
        <CategoryCircle
          category={c}
          key={c.id}
          active={c.id === activeId}
          showBlurb={showBlurb}
        />
      ))}
    </div>
  );
}

/** Single horizontal row of circle tiles with arrows that disable at each end. */
export function CategoryRow({ categories, activeId }) {
  const ref = useRef(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setEdges({
      start: el.scrollLeft <= 4,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
    });
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure]);

  const scrollBy = (dir) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.round(el.clientWidth * 0.8), behavior: 'smooth' });
  };

  return (
    <>
      <div className="category-row" ref={ref} onScroll={measure}>
        {categories.map((c) => (
          <CategoryCircle category={c} key={c.id} active={c.id === activeId} />
        ))}
      </div>

      <div className="row-nav" style={{ justifyContent: 'flex-end', marginTop: 20 }}>
        <button type="button" onClick={() => scrollBy(-1)} disabled={edges.start} aria-label="Scroll left">
          <ChevronLeft />
        </button>
        <button type="button" onClick={() => scrollBy(1)} disabled={edges.end} aria-label="Scroll right">
          <ChevronRight />
        </button>
      </div>
    </>
  );
}
