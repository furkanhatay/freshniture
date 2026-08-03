/**
 * Demo catalogue.
 *
 * Product names and categories are hand-written; specifications are derived from a
 * seeded generator so the site is stable across reloads. Images come from a
 * placeholder service so it runs with zero setup — to go live, point `img()` at your
 * own CDN and leave everything else as it is:
 *
 *   const img = (seed) => `https://cdn.yourdomain.com/catalog/${seed}.jpg`;
 */

export const img = (seed, w = 900, h = 900) =>
  `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;

/* ------------------------------------------------------------------ *
 * Deterministic pseudo-randomness
 * ------------------------------------------------------------------ */

function makeRng(seed) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pick = (rand, list) => list[Math.floor(rand() * list.length)];
const intBetween = (rand, min, max) => min + Math.floor(rand() * (max - min + 1));

export const slugify = (s) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

/* ------------------------------------------------------------------ *
 * Categories — these are the boxes in the row on the home page
 * ------------------------------------------------------------------ */

export const categories = [
  {
    id: 'living-room-sets',
    name: 'Living Room Sets',
    blurb: 'Complete seating groups: 3+3+1, corner sets and armchairs.',
    image: img('cat-living-room', 800, 1000),
  },
  {
    id: 'dining-sets',
    name: 'Dining Sets',
    blurb: 'Tables with matching chairs, fixed and extendable.',
    image: img('cat-dining', 800, 1000),
  },
  {
    id: 'bedroom-sets',
    name: 'Bedroom Sets',
    blurb: 'Bed, wardrobe, dresser and nightstands as one program.',
    image: img('cat-bedroom', 800, 1000),
  },
  {
    id: 'sofas',
    name: 'Sofas & Armchairs',
    blurb: 'Individual upholstery pieces in your fabric selection.',
    image: img('cat-sofas', 800, 1000),
  },
  {
    id: 'coffee-tables',
    name: 'Coffee & Side Tables',
    blurb: 'Solid wood, marble and glass tops in matching finishes.',
    image: img('cat-coffee', 800, 1000),
  },
  {
    id: 'tv-units',
    name: 'TV Units',
    blurb: 'Media consoles and wall systems for every room size.',
    image: img('cat-tv', 800, 1000),
  },
  {
    id: 'chairs',
    name: 'Chairs',
    blurb: 'Dining, accent and contract chairs, stackable options.',
    image: img('cat-chairs', 800, 1000),
  },
  {
    id: 'outdoor',
    name: 'Outdoor',
    blurb: 'Teak, aluminium and all-weather rattan for terraces.',
    image: img('cat-outdoor', 800, 1000),
  },
  {
    id: 'office',
    name: 'Office & Contract',
    blurb: 'Desks, meeting tables and task seating for projects.',
    image: img('cat-office', 800, 1000),
  },
  {
    id: 'decor',
    name: 'Decor & Lighting',
    blurb: 'Mirrors, consoles and lighting to finish the collection.',
    image: img('cat-decor', 800, 1000),
  },
];

export const categoryById = Object.fromEntries(categories.map((c) => [c.id, c]));

/* ------------------------------------------------------------------ *
 * Product names per category
 * ------------------------------------------------------------------ */

const NAMES = {
  'living-room-sets': [
    'Vienna 3+3+1 Living Room Set', 'Marbella Corner Sofa Set', 'Bosphorus Chesterfield Set',
    'Lumière Modular Living Set', 'Cordoba Fabric Sofa Set', 'Verona Velvet Seating Group',
    'Anatolia Classic Living Set', 'Nordic Oak Living Set',
  ],
  'dining-sets': [
    'Toscana 8-Seat Dining Set', 'Aurora Extendable Dining Set', 'Granada Marble Dining Set',
    'Oakwood 6-Seat Dining Set', 'Milano Round Dining Set', 'Palermo Console Dining Set',
    'Cappadocia Walnut Dining Set', 'Riviera Glass Dining Set',
  ],
  'bedroom-sets': [
    'Serena Bedroom Program', 'Monaco Upholstered Bedroom Set', 'Ardenne Solid Oak Bedroom Set',
    'Lotus Sliding Wardrobe Set', 'Aegean Bedroom Collection', 'Belvedere Classic Bedroom Set',
  ],
  sofas: [
    'Piedmont 3-Seat Sofa', 'Halic Corner Sofa', 'Estella Wing Armchair',
    'Nova Sofa Bed', 'Dune Boucle Loveseat', 'Kestrel Lounge Chair',
    'Selene Tufted Sofa', 'Rialto Daybed',
  ],
  'coffee-tables': [
    'Onyx Marble Coffee Table', 'Nest Oak Coffee Table Set', 'Aurum Brass Side Table',
    'Basalt Stone Coffee Table', 'Linea Glass Coffee Table', 'Rovere Nesting Tables',
  ],
  'tv-units': [
    'Horizon 220 TV Unit', 'Mesa Wall System', 'Fenix Fireplace TV Console',
    'Slate Floating Media Unit', 'Carve Fluted TV Unit',
  ],
  chairs: [
    'Ora Upholstered Dining Chair', 'Wicker Bistro Chair', 'Tamer Stackable Contract Chair',
    'Lyre Cane Back Chair', 'Bruno Leather Dining Chair', 'Pala Bar Stool',
  ],
  outdoor: [
    'Adriatic Teak Dining Set', 'Sirocco Rattan Lounge Set', 'Cala Aluminium Terrace Set',
    'Mistral Sun Lounger', 'Levante Garden Sofa Set',
  ],
  office: [
    'Meridian Executive Desk', 'Forum Meeting Table 12P', 'Axis Task Chair',
    'Vault Filing Credenza', 'Atrium Reception Desk',
  ],
  decor: [
    'Halo Arched Mirror', 'Petra Console Table', 'Ember Pendant Lamp',
    'Corda Floor Lamp', 'Nadir Wall Sconce Set', 'Tessera Decorative Panel',
  ],
};

/* ------------------------------------------------------------------ *
 * Specification pools
 * ------------------------------------------------------------------ */

const MATERIALS = {
  'living-room-sets': ['Kiln-dried beech frame, high-density foam', 'Solid oak frame, pocket-spring seat', 'Hardwood frame, chenille upholstery'],
  'dining-sets': ['Solid oak, natural veneer top', 'Marble top on powder-coated steel base', 'Solid walnut with lacquer finish'],
  'bedroom-sets': ['MDF with oak veneer, soft-close hardware', 'Solid pine with matt lacquer', 'Upholstered headboard, hardwood frame'],
  sofas: ['Beech frame, performance fabric', 'Full-grain leather over hardwood', 'Boucle upholstery, hardwood frame'],
  'coffee-tables': ['Carrara marble on brushed brass', 'Solid oak, oiled finish', 'Tempered glass on steel frame'],
  'tv-units': ['MDF with matt lacquer, soft-close drawers', 'Solid ash with cable management', 'Oak veneer with fluted front'],
  chairs: ['Solid beech, fabric seat', 'Powder-coated steel, PU seat', 'Rattan back, hardwood frame'],
  outdoor: ['Grade-A teak, stainless fittings', 'All-weather PE rattan, aluminium frame', 'Powder-coated aluminium'],
  office: ['Oak veneer with steel base', 'Melamine panel, ABS edge', 'Mesh back, nylon base'],
  decor: ['Brushed brass frame', 'Solid oak with black metal', 'Hand-blown glass, brass fitting'],
};

const FINISHES = [
  'Natural Oak', 'Walnut', 'Wenge', 'Matt White', 'Anthracite',
  'Antique Brass', 'Matt Black', 'Cream', 'Sand Beige', 'Forest Green',
];

const FABRICS = [
  'Performance chenille', 'Easy-clean velvet', 'Linen blend', 'Full-grain leather',
  'Boucle', 'Water-repellent polyester',
];

const PACKING = [
  'Export carton with EPE foam and corner protection',
  'Knock-down flat pack, 5-layer carton',
  'Fully assembled, blanket-wrapped in wooden crate',
  'Double-wall carton with polybag and foam sheet',
];

const CERTS = [
  ['ISO 9001', 'CARB P2', 'FSC-certified panels'],
  ['ISO 9001', 'TSE', 'EN 12520 tested'],
  ['FSC-certified timber', 'REACH-compliant foam'],
];

/* ------------------------------------------------------------------ *
 * Item generation
 * ------------------------------------------------------------------ */

function buildItem(name, category, index) {
  const id = slugify(name);
  const rand = makeRng(`${category}:${id}`);

  const isSet = /set|program|collection|group|system/i.test(name);
  const imageCount = intBetween(rand, 3, 5);

  const width = intBetween(rand, 60, 320);
  const depth = intBetween(rand, 40, 110);
  const height = intBetween(rand, 45, 210);

  return {
    id,
    name,
    category,
    code: `${category.slice(0, 3).toUpperCase()}-${String(1000 + index * 7 + Math.floor(rand() * 9))}`,
    images: Array.from({ length: imageCount }, (_, i) => img(`${id}-${i}`, 1000, 1000)),
    material: pick(rand, MATERIALS[category]),
    finish: pick(rand, FINISHES),
    fabric: ['living-room-sets', 'sofas', 'chairs', 'bedroom-sets'].includes(category)
      ? pick(rand, FABRICS)
      : null,
    dimensions: `${width} W x ${depth} D x ${height} H cm`,
    pieces: isSet ? intBetween(rand, 3, 7) : 1,
    seats: ['living-room-sets', 'dining-sets', 'sofas', 'outdoor'].includes(category)
      ? intBetween(rand, 2, 10)
      : null,
    moq: isSet ? `${intBetween(rand, 5, 30)} sets` : `${intBetween(rand, 20, 120)} pcs`,
    leadTime: `${intBetween(rand, 25, 60)} days`,
    packing: pick(rand, PACKING),
    cbm: (Math.round((0.4 + rand() * 4.2) * 100) / 100).toFixed(2),
    per40hq: intBetween(rand, 18, 220),
    certifications: pick(rand, CERTS),
    customisable: rand() < 0.75,
    colourways: intBetween(rand, 3, 12),
    description:
      `${name} is produced in our own facility and supplied factory-direct. ` +
      `Frames are built to contract standards and every unit is inspected before packing. ` +
      `Dimensions, finishes and fabrics can be adapted for project orders.`,
  };
}

export const items = Object.entries(NAMES).flatMap(([category, names]) =>
  names.map((name, i) => buildItem(name, category, i)),
);

export const itemById = Object.fromEntries(items.map((i) => [i.id, i]));

export function itemsInCategory(categoryId) {
  return items.filter((i) => i.category === categoryId);
}

/** Mixed selection for the home page gallery. */
export const galleryItems = categories
  .flatMap((c) => itemsInCategory(c.id).slice(0, 2))
  .slice(0, 18);

/* ------------------------------------------------------------------ *
 * Banner slides
 * ------------------------------------------------------------------ */

export const heroSlides = [
  {
    id: 'h1',
    eyebrow: 'WHOLESALE ONLY',
    title: 'Furniture collections, built by the container',
    copy: 'Factory-direct production for retailers, hotels and project buyers worldwide.',
    cta: 'Browse collections',
    to: '/c/living-room-sets',
    image: img('banner-showroom', 2000, 1100),
  },
  {
    id: 'h2',
    eyebrow: 'NEW SEASON',
    title: 'Solid oak dining programs in stock',
    copy: 'Ten finishes, 30-day lead time, full containers or mixed loads.',
    cta: 'See dining sets',
    to: '/c/dining-sets',
    image: img('banner-dining', 2000, 1100),
  },
  {
    id: 'h3',
    eyebrow: 'CONTRACT SUPPLY',
    title: 'Hotel and project furniture programs',
    copy: 'Custom sizing, fabrics and finishes with dedicated production slots.',
    cta: 'Talk to our team',
    to: '/c/office',
    image: img('banner-contract', 2000, 1100),
  },
];

/* ------------------------------------------------------------------ *
 * Instagram strip (static demo data — connect a real feed if needed)
 *
 * Uses real catalogue photography (one item per category, a different item
 * than the home page gallery picks) rather than unrelated stock photos, so
 * the strip reads as furniture rather than a random ocean or forest shot.
 * ------------------------------------------------------------------ */

const INSTAGRAM_CAPTIONS = [
  'Fresh off the finishing line',
  'This week’s container load',
  'New colourway now in stock',
  'Frame construction in progress',
  'Ready for a hotel project',
  'Sample finishes for a client review',
  'Behind the scenes in the workshop',
  'Packed and ready for export',
  'Quality check before shipping',
  'New arrival in the showroom',
];

export const instagramPosts = categories.map((c, i) => {
  const catItems = itemsInCategory(c.id);
  const item = catItems[2] || catItems[0];
  return {
    id: `ig-${c.id}`,
    image: item.images[1] || item.images[0],
    caption: `${INSTAGRAM_CAPTIONS[i % INSTAGRAM_CAPTIONS.length]} — ${item.name}`,
  };
});

/* ------------------------------------------------------------------ *
 * Why-us strip
 * ------------------------------------------------------------------ */

export const advantages = [
  { title: 'Own production', copy: '18,000 m² facility with in-house upholstery and finishing.' },
  { title: 'Low MOQ', copy: 'Mixed containers accepted so you can test a range first.' },
  { title: 'OEM & private label', copy: 'Your dimensions, fabrics, finishes and packaging.' },
  { title: 'Worldwide shipping', copy: 'FOB, CIF and door delivery with full export paperwork.' },
];
