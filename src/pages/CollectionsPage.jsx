import { CategoryCircleGrid } from '../components/CategoryRow';
import { SectionTitle } from '../components/SectionTitle';
import { useCatalog } from '../store/CatalogContext';

export function CollectionsPage() {
  const { categories } = useCatalog();
  return (
    <div className="page">
      <section className="section">
        <div className="shell">
          <SectionTitle
            eyebrow="Catalogue"
            title="All collections"
            copy="Each collection is available as a full set or as individual pieces."
            center
          />
          <CategoryCircleGrid categories={categories} showBlurb />
        </div>
      </section>
    </div>
  );
}
