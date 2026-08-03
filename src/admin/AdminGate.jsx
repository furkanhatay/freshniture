import { useState } from 'react';
import { Link } from 'react-router-dom';
import { site } from '../config/site';

const SESSION_KEY = 'atelier:admin-auth';

export function isAdminUnlocked() {
  try {
    return window.sessionStorage.getItem(SESSION_KEY) === 'true';
  } catch {
    return false;
  }
}

function setAdminUnlocked(value) {
  try {
    if (value) window.sessionStorage.setItem(SESSION_KEY, 'true');
    else window.sessionStorage.removeItem(SESSION_KEY);
  } catch {
    /* private mode — the gate just won't persist across reloads */
  }
}

/**
 * Passcode gate for /admin. This is a client-side check only — the password
 * lives in `config/site.js` and ships in the JS bundle, so it keeps out
 * casual visitors, not a determined one. Real access control needs a backend.
 */
export function AdminGate({ children, onUnlock }) {
  const [unlocked, setUnlocked] = useState(isAdminUnlocked());
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (unlocked) return children;

  const submit = (e) => {
    e.preventDefault();
    if (password === site.adminPassword) {
      setAdminUnlocked(true);
      setUnlocked(true);
      onUnlock?.();
    } else {
      setError('Incorrect password.');
    }
  };

  return (
    <div className="admin-gate">
      <form className="admin-gate-card" onSubmit={submit}>
        <h1>Admin</h1>
        <p>Enter the admin password to manage collections and gallery items.</p>

        <div className="field">
          <label htmlFor="admin-password">Password</label>
          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(''); }}
            autoFocus
            autoComplete="current-password"
          />
          {error && <div className="error-text">{error}</div>}
        </div>

        <button className="btn btn-dark btn-block" type="submit">Enter</button>
        <Link className="linkish" to="/" style={{ display: 'block', textAlign: 'center', marginTop: 18 }}>
          Back to site
        </Link>
      </form>
    </div>
  );
}

export function adminLogout() {
  setAdminUnlocked(false);
}
