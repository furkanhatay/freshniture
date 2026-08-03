import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  ChevronDown, CloseIcon, InstagramIcon, MailIcon, MenuIcon, WhatsAppIcon,
} from './Icons';
import { useCatalog } from '../store/CatalogContext';
import { useSiteSettings } from '../store/SiteSettingsContext';

const NAV = [
  { label: 'Home', to: '/' },
  { label: 'Collections', to: '/collections', drop: true },
  { label: 'Gallery', to: '/gallery' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

export function Header() {
  const { categories } = useCatalog();
  const { site, waLink } = useSiteSettings();
  const [dropOpen, setDropOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const dropRef = useRef(null);
  const { pathname } = useLocation();

  useEffect(() => {
    setDropOpen(false);
    setDrawerOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setDropOpen(false);
    const onClick = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, []);

  const enquiry = waLink(`Hello ${site.brand}, I would like to receive your wholesale catalogue and price list.`);

  return (
    <header className="site-header">
      <div className="header-top">
        <div className="shell">
          <span>{site.intro}</span>
          <div className="ht-right">
            <a href={`mailto:${site.email}`}>{site.email}</a>
            <span>{site.phoneDisplay}</span>
            <a href={site.instagramUrl} target="_blank" rel="noreferrer" aria-label="Instagram">
              <InstagramIcon size={15} />
            </a>
          </div>
        </div>
      </div>

      <div className="shell header-main">
        <Link className="brand" to="/">
          {site.brand}
          <small>{site.tagline}</small>
        </Link>

        <nav className="main-nav" aria-label="Main">
          <ul>
            {NAV.map((item) => (
              <li key={item.label} className={item.drop ? 'has-drop' : undefined} ref={item.drop ? dropRef : undefined}>
                {item.drop ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setDropOpen((o) => !o)}
                      aria-expanded={dropOpen}
                      style={{
                        border: 0,
                        background: 'none',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        font: 'inherit',
                        fontSize: 12.5,
                        fontWeight: 600,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: dropOpen ? 'var(--accent)' : 'var(--ink-2)',
                        padding: '6px 0',
                      }}
                    >
                      {item.label}
                      <ChevronDown size={14} />
                    </button>
                    {dropOpen && (
                      <div className="drop-panel">
                        {categories.map((c) => (
                          <Link key={c.id} to={`/c/${c.id}`}>{c.name}</Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <NavLink to={item.to} className={({ isActive }) => (isActive ? 'active' : undefined)} end={item.to === '/'}>
                    {item.label}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-cta">
          <a className="btn btn-wa btn-sm" href={enquiry} target="_blank" rel="noreferrer">
            <WhatsAppIcon size={16} />
            Enquire
          </a>
        </div>

        <button
          type="button"
          className="nav-toggle"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open menu"
        >
          <MenuIcon />
        </button>
      </div>

      {drawerOpen && (
        <>
          <div className="drawer-backdrop" onClick={() => setDrawerOpen(false)} />
          <aside className="drawer" role="dialog" aria-label="Menu">
            <div className="drawer-head">
              <strong style={{ letterSpacing: '0.16em' }}>MENU</strong>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close menu"
                style={{ border: 0, background: 'none', cursor: 'pointer' }}
              >
                <CloseIcon />
              </button>
            </div>
            <div className="drawer-body">
              <Link to="/">Home</Link>
              {categories.map((c) => (
                <Link key={c.id} to={`/c/${c.id}`}>{c.name}</Link>
              ))}
              <Link to="/gallery">Gallery</Link>
              <Link to="/about">About</Link>
              <Link to="/contact">Contact</Link>
              <a href={`mailto:${site.email}`}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <MailIcon size={16} /> {site.email}
                </span>
              </a>
            </div>
            <div className="drawer-foot">
              <a className="btn btn-wa btn-block" href={enquiry} target="_blank" rel="noreferrer">
                <WhatsAppIcon size={17} />
                WhatsApp enquiry
              </a>
            </div>
          </aside>
        </>
      )}
    </header>
  );
}
