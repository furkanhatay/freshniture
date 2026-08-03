import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="page">
      <section className="section">
        <div className="shell" style={{ textAlign: 'center', padding: '60px 0' }}>
          <h1 style={{ marginBottom: 14 }}>Page not found</h1>
          <p style={{ color: 'var(--muted)', marginBottom: 28 }}>
            That collection may have been renamed or is no longer in production.
          </p>
          <Link className="btn btn-dark" to="/">Back to home</Link>
        </div>
      </section>
    </div>
  );
}
