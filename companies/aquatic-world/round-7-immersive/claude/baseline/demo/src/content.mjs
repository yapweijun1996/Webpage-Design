// Single source of truth for brand, navigation, routes, category copy and image mapping.
// All copy is illustrative demo content for a fictional brand; no business facts are claimed.

export const brand = {
  name: "Aquatic World",
  tagline: "Nature connects us all",
  disclosure:
    "Aquatic World is an illustrative design concept. Imagery is AI-generated, copy is proposed demo content, and no enquiry is ever sent.",
};

// Global navigation: label, route and the section key used for current-context matching.
export const nav = [
  { key: "home", label: "Home", href: "/" },
  { key: "collections", label: "Collections", href: "/collections/" },
  { key: "story", label: "Our Story", href: "/our-story/" },
  { key: "quality", label: "Quality", href: "/quality/" },
  { key: "contact", label: "Contact", href: "/contact/" },
];

export const cta = { label: "Discuss a project", href: "/contact/#enquiry" };

// Image registry. `src` is the derivative stem in assets/img; widths match scripts/images.mjs.
export const images = {
  hero: { stem: "hero-angelfish", widths: [800, 1280, 1882], ratio: [1882, 836], alt: "A striped angelfish with long trailing fins glides over driftwood and dense green plants." },
  heroFish: { stem: "hero-angelfish-fish", widths: [640, 1000], ratio: [1000, 836], alt: "A striped angelfish with long trailing fins glides over driftwood and dense green plants." },
  waterfront: { stem: "heritage-waterfront", widths: [640, 1024, 1586], ratio: [1586, 992], alt: "A green waterfront at golden hour, with a city skyline beyond calm water." },
  fish: { stem: "collection-ornamental-fish", widths: [640, 960, 1448], ratio: [1448, 1086], alt: "A blue-bodied fish with sweeping red fins against dark water." },
  plants: { stem: "collection-aquatic-plants", widths: [640, 960, 1448], ratio: [1448, 1086], alt: "A planted aquascape: long green leaves, fine stems and moss growing over driftwood." },
  driftwood: { stem: "collection-driftwood", widths: [640, 960, 1448], ratio: [1448, 1086], alt: "A large branching piece of driftwood rising from dark gravel under water." },
  betta: { stem: "highlight-red-betta", widths: [640, 960, 1448], ratio: [1448, 1086], alt: "A red long-finned fish with fully spread fins against a dark background." },
  angelfish: { stem: "highlight-angelfish", widths: [640, 960, 1448], ratio: [1448, 1086], alt: "A silver and black striped angelfish in profile among green plants." },
  redPlants: { stem: "highlight-red-plants", widths: [640, 960, 1448], ratio: [1448, 1086], alt: "Red and bronze leaves rising from a cluster of green aquatic plants." },
  school: { stem: "enquiry-underwater-school", widths: [800, 1280, 1920], ratio: [1983, 793], alt: "A shaft of light falls into deep blue water framed by plants, wood and small silver fish." },
};

export const categories = [
  {
    slug: "ornamental-fish",
    name: "Ornamental Fish",
    short: "Ornamental fish",
    number: "01",
    image: "fish",
    teaser: "Colour, finnage and movement — the living focal point of a display.",
    summary:
      "Fish bring movement and colour to a composition. This family is presented as studies of form and finnage, with selection framed as questions to discuss rather than a stock list.",
    considered: ["Colour and finnage", "Form and movement", "Community fit"],
    role: "The moving focal point that draws the eye first.",
    look: "Colour depth, fin condition, how the fish carries itself.",
    ask: "Which other inhabitants and what display size are planned?",
    enquiryLabel: "Prepare a fish enquiry",
  },
  {
    slug: "aquatic-plants",
    name: "Aquatic Plants",
    short: "Aquatic plants",
    number: "02",
    image: "plants",
    teaser: "Layers of leaf, texture and colour that turn a tank into a landscape.",
    summary:
      "Plants build depth and atmosphere. This family is organised around how foliage shapes a scape — layer, leaf form, colour and texture — not around a catalogue of species.",
    considered: ["Layer and depth", "Leaf form and texture", "Colour contrast"],
    role: "The landscape: depth, softness and a sense of scale.",
    look: "Leaf shape, density, colour and how growth fills space.",
    ask: "Which layer needs work, and what mood should the scape carry?",
    enquiryLabel: "Prepare a plant enquiry",
  },
  {
    slug: "driftwood",
    name: "Driftwood",
    short: "Driftwood",
    number: "03",
    image: "driftwood",
    teaser: "Natural structure that sets the lines and scale of the whole composition.",
    summary:
      "Driftwood is the structure of a scape. Each piece is discussed by its lines, branching and mass, and by how its surface reads under water and light.",
    considered: ["Line and branching", "Mass and scale", "Surface and tone"],
    role: "The skeleton: lines, scale and the main direction of movement.",
    look: "Silhouette, branching, surface texture and tone.",
    ask: "What are the display dimensions and the intended viewing side?",
    enquiryLabel: "Prepare a hardscape enquiry",
  },
];

export const categoryBySlug = Object.fromEntries(categories.map((c) => [c.slug, c]));

// Page metadata. `section` drives header current context; `crumbs` drives breadcrumbs.
export const pages = {
  home: {
    route: "/",
    section: "home",
    title: "Aquatic World — Ornamental fish, aquatic plants and driftwood",
    description: "An illustrative aquatic brand concept: ornamental fish, aquatic plants and driftwood, curated with care.",
  },
  collections: {
    route: "/collections/",
    section: "collections",
    title: "Collections — Aquatic World",
    description: "Three collection families: ornamental fish, aquatic plants and driftwood.",
  },
  "ornamental-fish": {
    route: "/collections/ornamental-fish/",
    section: "collections",
    category: "ornamental-fish",
    title: "Ornamental Fish — Collections — Aquatic World",
    description: "Ornamental fish studies and the questions that shape a thoughtful selection.",
  },
  "aquatic-plants": {
    route: "/collections/aquatic-plants/",
    section: "collections",
    category: "aquatic-plants",
    title: "Aquatic Plants — Collections — Aquatic World",
    description: "How aquatic plants shape an aquascape: layers, leaf form, colour and texture.",
  },
  driftwood: {
    route: "/collections/driftwood/",
    section: "collections",
    category: "driftwood",
    title: "Driftwood — Collections — Aquatic World",
    description: "How driftwood sets the structure, lines and scale of an aquatic composition.",
  },
  story: {
    route: "/our-story/",
    section: "story",
    title: "Our Story — Aquatic World",
    description: "The perspective behind the Aquatic World concept: nature, people and water.",
  },
  quality: {
    route: "/quality/",
    section: "quality",
    title: "Quality — Aquatic World",
    description: "Proposed principles for a thoughtful selection and handling process.",
  },
  contact: {
    route: "/contact/",
    section: "contact",
    title: "Contact — Prepare an enquiry brief — Aquatic World",
    description: "Prepare an enquiry brief. This demo previews it locally; nothing is sent.",
  },
  notFound: {
    route: "/404.html",
    section: null,
    title: "Page not found — Aquatic World",
    description: "This page is not part of the Aquatic World site.",
  },
};
