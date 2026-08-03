import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, WhatsAppIcon } from './Icons';
import { useSiteSettings } from '../store/SiteSettingsContext';

const INTERVAL = 7000;

export function Banner() {
  const { site, waLink, heroSlides } = useSiteSettings();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return undefined;
    const t = setInterval(() => setIndex((i) => (i + 1) % heroSlides.length), INTERVAL);
    return () => clearInterval(t);
  }, [paused]);

  const go = (d) => setIndex((i) => (i + d + heroSlides.length) % heroSlides.length);
  // Defensive: heroSlides can shrink (a slide deleted in admin) while this stays mounted.
  const slide = heroSlides[index] || heroSlides[0];

  return (
    <section
      className="banner"
      aria-roledescription="carousel"
      aria-label="Featured collections"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="banner-slide">
        <img src={slide.image} alt="" />
        <div className="shell">
          <div className="banner-content">
            <div className="eyebrow">{slide.eyebrow}</div>
            <h1>{slide.title}</h1>
            <p>{slide.copy}</p>
            <div className="banner-actions">
              <Link className="btn btn-light" to={slide.to}>{slide.cta}</Link>
              <a
                className="btn btn-wa"
                href={waLink(`Hello ${site.brand}, please send me your latest catalogue.`)}
                target="_blank"
                rel="noreferrer"
              >
                <WhatsAppIcon size={16} />
                Request catalogue
              </a>
            </div>
          </div>
        </div>

        <button type="button" className="banner-nav prev" onClick={() => go(-1)} aria-label="Previous slide">
          <ChevronLeft />
        </button>
        <button type="button" className="banner-nav next" onClick={() => go(1)} aria-label="Next slide">
          <ChevronRight />
        </button>

        <div className="banner-dots shell">
          {heroSlides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              className={i === index ? 'on' : ''}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
