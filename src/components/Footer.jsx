import { Link } from 'react-router-dom';
import {
  FacebookIcon, InstagramIcon, LinkedInIcon, MailIcon, PhoneIcon, PinIcon, WhatsAppIcon,
} from './Icons';
import { useCatalog } from '../store/CatalogContext';
import { useSiteSettings } from '../store/SiteSettingsContext';

export function Footer() {
  const { categories } = useCatalog();
  const { site, waLink } = useSiteSettings();
  return (
    <footer className="site-footer">
      <div className="shell">
        <div className="footer-grid">
          <div>
            <div className="brand">
              {site.brand}
              <small>{site.tagline}</small>
            </div>
            <p>{site.intro}</p>
            <div className="footer-social" style={{ marginTop: 20 }}>
              <a href={site.instagramUrl} target="_blank" rel="noreferrer" aria-label="Instagram">
                <InstagramIcon />
              </a>
              <a href="#facebook" aria-label="Facebook"><FacebookIcon /></a>
              <a href="#linkedin" aria-label="LinkedIn"><LinkedInIcon /></a>
              <a
                href={waLink(`Hello ${site.brand}, I would like more information.`)}
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
              >
                <WhatsAppIcon size={17} />
              </a>
            </div>
          </div>

          <div>
            <h4>Collections</h4>
            <ul>
              {categories.slice(0, 6).map((c) => (
                <li key={c.id}><Link to={`/c/${c.id}`}>{c.name}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4>Company</h4>
            <ul>
              <li><Link to="/about">About us</Link></li>
              <li><Link to="/gallery">Gallery</Link></li>
              <li><Link to="/collections">All collections</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><a href="#terms">Terms of sale</a></li>
            </ul>
          </div>

          <div>
            <h4>Get in touch</h4>
            <address>
              <span style={{ display: 'flex', gap: 9, marginBottom: 10 }}>
                <PinIcon size={16} /> {site.address}
              </span>
              <span style={{ display: 'flex', gap: 9, marginBottom: 10 }}>
                <PhoneIcon size={16} />
                <a href={`tel:${site.whatsapp}`}>{site.phoneDisplay}</a>
              </span>
              <span style={{ display: 'flex', gap: 9 }}>
                <MailIcon size={16} />
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </span>
            </address>
          </div>
        </div>

        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} {site.brand}. All rights reserved.</span>
          <span style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            Wholesale and project sales only — no retail.
            <Link to="/admin" style={{ opacity: 0.6 }}>Admin</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
