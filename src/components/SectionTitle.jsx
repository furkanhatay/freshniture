export function SectionTitle({ eyebrow, title, copy, center = false, action }) {
  return (
    <header className={`section-title${center ? ' center' : ''}`}>
      <div>
        {eyebrow && <div className="st-eyebrow">{eyebrow}</div>}
        <h2>{title}</h2>
        {copy && <p>{copy}</p>}
      </div>
      {action}
    </header>
  );
}
