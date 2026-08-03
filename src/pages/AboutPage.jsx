import { SectionTitle } from '../components/SectionTitle';
import { advantages, img } from '../data/catalog';
import { useSiteSettings } from '../store/SiteSettingsContext';

const FACTS = [
  ['18,000 m²', 'Production facility'],
  ['240+', 'People on the line'],
  ['40', 'Export markets'],
  ['25–60 days', 'Typical lead time'],
];

export function AboutPage() {
  const { site } = useSiteSettings();
  return (
    <div className="page">
      <section className="cat-hero">
        <img src={img('about-factory', 2000, 900)} alt="" />
        <div className="shell ch-body">
          <h1>About {site.brand}</h1>
          <p>{site.intro}</p>
        </div>
      </section>

      <section className="section">
        <div className="shell" style={{ maxWidth: 760 }}>
          <SectionTitle eyebrow="Who we are" title="A manufacturer, not a trading company" />
          <p style={{ fontSize: 16, color: 'var(--muted)' }}>
            We design, build and finish our furniture in our own facility. That means the
            person quoting your order is in the same building as the people producing it, so
            lead times are real and changes are possible without a chain of intermediaries.
          </p>
          <p style={{ fontSize: 16, color: 'var(--muted)' }}>
            We work with furniture retailers, hotel groups, contractors and project buyers.
            Mixed containers are welcome — most partners start with a trial load before moving
            to a repeating program.
          </p>
          <p style={{ fontSize: 16, color: 'var(--muted)' }}>
            Every order is inspected before packing, and we can arrange third-party inspection
            on request. Export documentation, fumigation certificates and loading photos are
            standard.
          </p>
        </div>
      </section>

      <section className="section soft tight">
        <div className="shell">
          <div className="advantages">
            {FACTS.map(([value, label]) => (
              <div className="advantage" key={label}>
                <div className="ad-num" style={{ fontSize: 34 }}>{value}</div>
                <h3 style={{ color: 'var(--muted)', fontWeight: 500 }}>{label}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <SectionTitle eyebrow="How we work" title="What you can expect" center />
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
    </div>
  );
}
