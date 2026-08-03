import { Link, useParams } from 'react-router-dom';
import { Gallery } from '../components/Gallery';
import { CategoryRow } from '../components/CategoryRow';
import { SectionTitle } from '../components/SectionTitle';
import { InstagramSection } from '../components/InstagramSection';
import { WhatsAppIcon } from '../components/Icons';
import { useCatalog } from '../store/CatalogContext';
import { useSiteSettings } from '../store/SiteSettingsContext';
import { NotFoundPage } from './NotFoundPage';

export function CategoryPage() {
  const { categoryId } = useParams();
  const { categories, categoryById, itemsInCategory } = useCatalog();
  const { site, waLink } = useSiteSettings();
  const category = categoryById[categoryId];

  if (!category) return <NotFoundPage />;

  const items = itemsInCategory(categoryId);

  return (
    <div className="page">
      <section className="cat-hero">
        <img src={category.image} alt="" />
        <div className="shell ch-body">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link to="/collections">Collections</Link>
            <span aria-hidden="true">/</span>
            <span>{category.name}</span>
          </nav>
          <h1>{category.name}</h1>
          <p>{category.blurb}</p>
        </div>
      </section>

      <section className="section tight">
        <div className="shell">
          <CategoryRow categories={categories} activeId={categoryId} />
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="shell">
          <SectionTitle
            eyebrow={`${items.length} models`}
            title={`${category.name} gallery`}
            copy="Click any image to see specifications, packing data and send a WhatsApp enquiry."
            action={
              <a
                className="btn btn-wa btn-sm"
                href={waLink(`Hello ${site.brand}, I would like the price list for ${category.name}.`)}
                target="_blank"
                rel="noreferrer"
              >
                <WhatsAppIcon size={16} />
                Ask for prices
              </a>
            }
          />
          <Gallery items={items} initialCount={12} />
        </div>
      </section>

      <InstagramSection />

      <section className="cta-band">
        <h2>Need this collection quoted?</h2>
        <p>
          Tell us the models, quantities and destination port. We will come back with an FOB
          offer, production time and a loading plan.
        </p>
        <div className="cb-actions">
          <a
            className="btn btn-wa"
            href={waLink(`Hello ${site.brand}, I would like a quotation for ${category.name}.`)}
            target="_blank"
            rel="noreferrer"
          >
            <WhatsAppIcon size={17} />
            Request a quotation
          </a>
          <Link className="btn btn-light" to="/collections">Browse all collections</Link>
        </div>
      </section>
    </div>
  );
}
