import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { WhatsAppIcon } from './components/Icons';
import { CatalogProvider } from './store/CatalogContext';
import { SiteSettingsProvider, useSiteSettings } from './store/SiteSettingsContext';
import { HomePage } from './pages/HomePage';
import { CategoryPage } from './pages/CategoryPage';
import { CollectionsPage } from './pages/CollectionsPage';
import { GalleryPage } from './pages/GalleryPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AdminPage } from './pages/AdminPage';
import { NotFoundPage } from './pages/NotFoundPage';

/** Route changes should land at the top, like a real page load. */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo({ top: 0, behavior: 'auto' }), [pathname]);
  return null;
}

function AppShell() {
  const { pathname } = useLocation();
  const { site, waLink } = useSiteSettings();
  const isAdmin = pathname.startsWith('/admin');

  return (
    <>
      <ScrollToTop />
      <a className="skip-link" href="#main">Skip to main content</a>
      {!isAdmin && <Header />}

      <main id="main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/c/:categoryId" element={<CategoryPage />} />
          <Route path="/collections" element={<CollectionsPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {!isAdmin && <Footer />}

      {!isAdmin && (
        <a
          className="wa-float"
          href={waLink(`Hello ${site.brand}, I would like more information.`)}
          target="_blank"
          rel="noreferrer"
          aria-label="Contact us on WhatsApp"
        >
          <WhatsAppIcon size={28} />
        </a>
      )}
    </>
  );
}

export default function App() {
  return (
    <SiteSettingsProvider>
      <CatalogProvider>
        <AppShell />
      </CatalogProvider>
    </SiteSettingsProvider>
  );
}
