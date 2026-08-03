import { Link } from 'react-router-dom';
import { Banner } from '../components/Banner';
import { CategoryRow } from '../components/CategoryRow';
import { Gallery } from '../components/Gallery';
import { InstagramSection } from '../components/InstagramSection';
import { SectionTitle } from '../components/SectionTitle';
import { WhatsAppIcon } from '../components/Icons';
import { advantages } from '../data/catalog';
import { useCatalog } from '../store/CatalogContext';
import { useSiteSettings } from '../store/SiteSettingsContext';

export function HomePage() {
  const { categories, galleryItems } = useCatalog();
  const { site, waLink } = useSiteSettings();
  return (
    <div className="page">
      <Banner />

      <section className="section">
        <div className="shell">
          <SectionTitle
            eyebrow="Our collections"
            title="Shop by collection"
            copy="Complete programs produced in our own facility, ready for container orders."
            action={<Link className="linkish" to="/collections">View all collections</Link>}
          />
          <CategoryRow categories={categories} />
        </div>
      </section>

      <section className="section soft tight">
        <div className="shell">
          <div className="advantages">
            {advantages.map((a, i) => (
              <div className="advantage" key={a.title}>
                <div className="ad-num">{String(i + 1).padStart(2, '0')}</div>
                <h3>{a.title}</h3>
                <p>{a.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <SectionTitle
            eyebrow="Gallery"
            title="Selected pieces"
            copy="Tap any image for full specifications, packing details and a direct WhatsApp enquiry."
            action={<Link className="linkish" to="/gallery">See full gallery</Link>}
          />
          <Gallery items={galleryItems} initialCount={12} />
        </div>
      </section>

      <InstagramSection />

      <section className="cta-band">
        <h2>Request the {new Date().getFullYear()} catalogue</h2>
        <p>
          Send us your market and the categories you work with, and we will reply with the
          catalogue, FOB price list and current stock availability.
        </p>
        <div className="cb-actions">
          <a
            className="btn btn-wa"
            href={waLink(`Hello ${site.brand}, please send me the catalogue and price list.`)}
            target="_blank"
            rel="noreferrer"
          >
            <WhatsAppIcon size={17} />
            WhatsApp us
          </a>
          <a className="btn btn-light" href={`mailto:${site.email}`}>Send an email</a>
        </div>
      </section>
    </div>
  );
}
