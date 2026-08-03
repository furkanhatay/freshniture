import {
  createContext, useCallback, useContext, useMemo,
} from 'react';
import { site as baseSite } from '../config/site';
import { heroSlides as baseHeroSlides, img, slugify } from '../data/catalog';
import { usePersistentState } from '../lib/usePersistentState';

const SiteSettingsContext = createContext(null);

// The admin password is a secret gate, not public site content — it is read
// straight from config/site.js everywhere (see AdminGate) and never enters
// this editable, persisted settings object.
const { adminPassword: _adminPassword, ...publicSite } = baseSite;

export const DEFAULT_SETTINGS = {
  ...publicSite,
  officeHours: 'Monday to Friday, 08:30 – 18:00 (GMT+3)\nSaturday, 09:00 – 14:00',
  visitingNote:
    'Our showroom is open to trade visitors by appointment. Let us know your dates '
    + 'and we will arrange transfer from the airport.',
  /**
   * Optional Behold.so (or similar) JSON feed URL for a live Instagram feed.
   * Left blank, the site falls back to the demo posts in data/catalog.js.
   */
  instagramFeedUrl: '',
};

const emptySlide = () => ({
  eyebrow: 'NEW COLLECTION',
  title: '',
  copy: '',
  cta: 'Shop now',
  to: '/collections',
  image: img(`slide-${Date.now()}`, 2000, 1100),
});

export function SiteSettingsProvider({ children }) {
  const [settings, setSettings] = usePersistentState('atelier:settings', DEFAULT_SETTINGS);
  const [heroSlides, setHeroSlides] = usePersistentState('atelier:heroSlides', baseHeroSlides);

  const updateSettings = useCallback((patch) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  }, [setSettings]);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, [setSettings]);

  /** wa.me link built from the *current* WhatsApp number — replaces the static helper. */
  const waLink = useCallback(
    (message) => `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(message)}`,
    [settings.whatsapp],
  );

  const addSlide = useCallback((data) => {
    if (!data.title?.trim()) throw new Error('Slide title is required.');
    if (!data.image?.trim()) throw new Error('Slide image URL is required.');

    const taken = new Set(heroSlides.map((s) => s.id));
    let id = slugify(data.title) || 'slide';
    if (taken.has(id)) {
      let n = 2;
      while (taken.has(`${id}-${n}`)) n += 1;
      id = `${id}-${n}`;
    }

    const slide = { ...emptySlide(), ...data, id };
    setHeroSlides((prev) => [...prev, slide]);
    return slide;
  }, [heroSlides, setHeroSlides]);

  const updateSlide = useCallback((id, patch) => {
    setHeroSlides((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }, [setHeroSlides]);

  const deleteSlide = useCallback((id) => {
    if (heroSlides.length <= 1) {
      throw new Error('Keep at least one slide — the banner needs one to show.');
    }
    setHeroSlides((prev) => prev.filter((s) => s.id !== id));
  }, [heroSlides.length, setHeroSlides]);

  const moveSlide = useCallback((id, direction) => {
    setHeroSlides((prev) => {
      const index = prev.findIndex((s) => s.id === id);
      const target = index + direction;
      if (index === -1 || target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }, [setHeroSlides]);

  const resetSlides = useCallback(() => {
    setHeroSlides(baseHeroSlides);
  }, [setHeroSlides]);

  const value = useMemo(() => ({
    site: settings,
    updateSettings,
    resetSettings,
    waLink,
    heroSlides,
    addSlide,
    updateSlide,
    deleteSlide,
    moveSlide,
    resetSlides,
  }), [
    settings, updateSettings, resetSettings, waLink,
    heroSlides, addSlide, updateSlide, deleteSlide, moveSlide, resetSlides,
  ]);

  return <SiteSettingsContext.Provider value={value}>{children}</SiteSettingsContext.Provider>;
}

export function useSiteSettings() {
  const ctx = useContext(SiteSettingsContext);
  if (!ctx) throw new Error('useSiteSettings must be used inside <SiteSettingsProvider>');
  return ctx;
}
