import {
  createContext, useCallback, useContext, useMemo,
} from 'react';
import {
  categories as baseCategories, items as baseItems, slugify,
} from '../data/catalog';
import { usePersistentState } from '../lib/usePersistentState';

const CatalogContext = createContext(null);

/** Appends -2, -3, … until `id` is not already taken. */
function uniqueId(id, taken) {
  if (!taken.has(id)) return id;
  let n = 2;
  while (taken.has(`${id}-${n}`)) n += 1;
  return `${id}-${n}`;
}

/**
 * Live catalogue state — seeded from the demo data in `data/catalog.js`, then
 * persisted to localStorage so admin edits survive reloads. The demo data itself
 * is never mutated; it is only the starting point (and the "reset" target).
 */
export function CatalogProvider({ children }) {
  const [categories, setCategories] = usePersistentState('atelier:categories', baseCategories);
  const [items, setItems] = usePersistentState('atelier:items', baseItems);

  const categoryById = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.id, c])),
    [categories],
  );
  const itemById = useMemo(
    () => Object.fromEntries(items.map((i) => [i.id, i])),
    [items],
  );

  const itemsInCategory = useCallback(
    (categoryId) => items.filter((i) => i.category === categoryId),
    [items],
  );

  const itemCountByCategory = useMemo(() => {
    const counts = {};
    items.forEach((i) => { counts[i.category] = (counts[i.category] || 0) + 1; });
    return counts;
  }, [items]);

  const galleryItems = useMemo(
    () => categories.flatMap((c) => itemsInCategory(c.id).slice(0, 2)).slice(0, 18),
    [categories, itemsInCategory],
  );

  const addCategory = useCallback(({ name, blurb, image }) => {
    const trimmedName = name.trim();
    if (!trimmedName) throw new Error('Category name is required.');
    if (!image?.trim()) throw new Error('Category image URL is required.');

    const taken = new Set(categories.map((c) => c.id));
    const id = uniqueId(slugify(trimmedName) || 'category', taken);
    const category = { id, name: trimmedName, blurb: blurb?.trim() || '', image: image.trim() };
    setCategories((prev) => [...prev, category]);
    return category;
  }, [categories, setCategories]);

  const updateCategory = useCallback((id, patch) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }, [setCategories]);

  const deleteCategory = useCallback((id) => {
    const count = itemsInCategory(id).length;
    if (count > 0) {
      const name = categoryById[id]?.name || id;
      throw new Error(
        `"${name}" still has ${count} gallery item${count === 1 ? '' : 's'}. `
        + 'Move or delete them first.',
      );
    }
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }, [categoryById, itemsInCategory, setCategories]);

  const addItem = useCallback((data) => {
    const name = data.name.trim();
    if (!name) throw new Error('Product name is required.');
    if (!data.category) throw new Error('Choose a category.');
    const images = (data.images || []).map((s) => s.trim()).filter(Boolean);
    if (images.length === 0) throw new Error('At least one image URL is required.');

    const taken = new Set(items.map((i) => i.id));
    const id = uniqueId(slugify(name) || 'item', taken);

    const code = data.code?.trim()
      || `${data.category.slice(0, 3).toUpperCase()}-${1000 + items.length + Math.floor(Math.random() * 900)}`;

    const dims = [data.width, data.depth, data.height].map((n) => Number(n) || 0);
    const dimensions = `${dims[0]} W x ${dims[1]} D x ${dims[2]} H cm`;

    const item = {
      id,
      name,
      category: data.category,
      code,
      images,
      material: data.material?.trim() || '',
      finish: data.finish?.trim() || '',
      fabric: data.fabric?.trim() || null,
      dimensions,
      pieces: Number(data.pieces) || 1,
      seats: data.seats ? Number(data.seats) : null,
      moq: data.moq?.trim() || '',
      leadTime: data.leadTime?.trim() || '',
      packing: data.packing?.trim() || '',
      cbm: data.cbm?.trim() || '',
      per40hq: Number(data.per40hq) || 0,
      certifications: (data.certifications || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      customisable: Boolean(data.customisable),
      colourways: Number(data.colourways) || 1,
      description: data.description?.trim()
        || `${name} is produced in our own facility and supplied factory-direct.`,
    };

    setItems((prev) => [...prev, item]);
    return item;
  }, [items, setItems]);

  const updateItem = useCallback((id, patch) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  }, [setItems]);

  const deleteItem = useCallback((id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, [setItems]);

  const resetToDemo = useCallback(() => {
    setCategories(baseCategories);
    setItems(baseItems);
  }, [setCategories, setItems]);

  const value = useMemo(() => ({
    categories,
    items,
    categoryById,
    itemById,
    itemsInCategory,
    itemCountByCategory,
    galleryItems,
    addCategory,
    updateCategory,
    deleteCategory,
    addItem,
    updateItem,
    deleteItem,
    resetToDemo,
  }), [
    categories, items, categoryById, itemById, itemsInCategory, itemCountByCategory,
    galleryItems, addCategory, updateCategory, deleteCategory, addItem, updateItem,
    deleteItem, resetToDemo,
  ]);

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error('useCatalog must be used inside <CatalogProvider>');
  return ctx;
}
