export type DisciplineId =
  | 'framework'
  | 'voice'
  | 'logo'
  | 'typography'
  | 'iconography'
  | 'color'
  | 'imagery'
  | 'motion';

export interface ColorSwatch {
  name: string;
  role: string;
  hex: string;
  rgb: string;
  onText: string;
}

export interface DisciplineMeta {
  id: DisciplineId;
  index: string;
  title: string;
  tagline: string;
  summary: string;
  bg: string;
  hoverBg: string;
  textColor: string;
  accentColor: string;
  principles: { title: string; body: string }[];
}

export const BRAND_SWATCHES: ColorSwatch[] = [
  { name: 'Cobalt Core', role: 'Primary brand anchor', hex: '#0061FF', rgb: '0, 97, 255', onText: '#FFFFFF' },
  { name: 'Deep Navy', role: 'Structural framework', hex: '#23304C', rgb: '35, 48, 76', onText: '#FFFFFF' },
  { name: 'Marigold', role: 'Voice & editorial highlight', hex: '#F7CE46', rgb: '247, 206, 70', onText: '#241B04' },
  { name: 'Sky Cyan', role: 'Logo & spatial clarity', hex: '#3AC5F4', rgb: '58, 197, 244', onText: '#082436' },
  { name: 'Vermilion', role: 'Typographic emphasis', hex: '#FA551E', rgb: '250, 85, 30', onText: '#1A0E09' },
  { name: 'Electric Lime', role: 'Iconography & utility', hex: '#B4DC19', rgb: '180, 220, 25', onText: '#1E2E04' },
  { name: 'Tangerine', role: 'Secondary warmth', hex: '#FF8C19', rgb: '255, 140, 25', onText: '#1E1002' },
  { name: 'Royal Plum', role: 'Imagery & depth', hex: '#7B1F48', rgb: '123, 31, 72', onText: '#FFFFFF' },
  { name: 'Soft Lavender', role: 'Motion & transitions', hex: '#C5A2F6', rgb: '197, 162, 246', onText: '#1F0F38' },
  { name: 'Obsidian Ink', role: 'Canvas contrast & type', hex: '#161618', rgb: '22, 22, 24', onText: '#FFFFFF' },
];

export const DISCIPLINES: DisciplineMeta[] = [
  {
    id: 'framework',
    index: '01',
    title: 'Framework',
    tagline: 'Structural clarity built on modular geometry.',
    summary:
      'Our visual architecture starts with an underlying grid. Every layout, card, and component snaps to deliberate proportional intervals so complex products feel effortless to navigate.',
    bg: '#23304C',
    hoverBg: '#1B263D',
    textColor: '#FFFFFF',
    accentColor: '#7FA7FF',
    principles: [
      {
        title: 'Pinwheel Balance',
        body: 'Asymmetric surfaces anchor around a stable focal core, creating kinetic energy without sacrificing alignment.',
      },
      {
        title: '8px Modular Rhythm',
        body: 'All margins, gutters, and component clearances derive from an 8-point geometric scale.',
      },
      {
        title: 'Hairline Seamwork',
        body: 'Crisp white gutters and 1px architectural grid lines replace heavy drop shadows to separate content planes.',
      },
    ],
  },
  {
    id: 'voice',
    index: '02',
    title: 'Voice & Tone',
    tagline: 'Human, clear, and quietly confident.',
    summary:
      'We write like thoughtful collaborators rather than corporate software. Our voice remains steady across every touchpoint while our tone adapts to the emotional stakes of the moment.',
    bg: '#F7CE46',
    hoverBg: '#F4C427',
    textColor: '#241B04',
    accentColor: '#6E5208',
    principles: [
      {
        title: 'Lead with Utility',
        body: 'Tell people what changes for them in plain, active verbs before introducing technical context.',
      },
      {
        title: 'Trim the Hype',
        body: 'Eliminate hollow superlatives and exclamation marks. Let precision carry enthusiasm.',
      },
      {
        title: 'Contextual Warmth',
        body: 'Shift from concise and direct in error recovery to inviting and expressive in onboarding.',
      },
    ],
  },
  {
    id: 'logo',
    index: '03',
    title: 'Logo',
    tagline: 'Five facets forming one unified space.',
    summary:
      'The Facet mark represents modular perspectives coming together. Treated with generous clearspace and strict geometric integrity, it anchors everything from tiny favicons to architectural signage.',
    bg: '#3AC5F4',
    hoverBg: '#23B8EB',
    textColor: '#082436',
    accentColor: '#0B3A54',
    principles: [
      {
        title: 'Clearspace Rule',
        body: 'Maintain at least 1x the height of a single diamond facet on all four sides of the mark.',
      },
      {
        title: 'Minimum Reproduction',
        body: 'Never render the standalone mark below 18px digitally or 6mm in physical print applications.',
      },
      {
        title: 'High-Contrast Lockups',
        body: 'Use Cobalt Core on crisp white, or pure white on Cobalt Core and Obsidian Ink backgrounds.',
      },
    ],
  },
  {
    id: 'typography',
    index: '04',
    title: 'Typography',
    tagline: 'Geometric warmth paired with technical rigor.',
    summary:
      'Our type system pairs Plus Jakarta Sans for expressive, high-clarity headlines and UI prose with JetBrains Mono for specifications, ratios, and tabular measurements.',
    bg: '#FA551E',
    hoverBg: '#EE460F',
    textColor: '#1A0E09',
    accentColor: '#3A1104',
    principles: [
      {
        title: 'Tight Display Tracking',
        body: 'Set large headlines with -0.025em tracking and 1.08 line-height so statements read as cohesive blocks.',
      },
      {
        title: 'Measured Body Prose',
        body: 'Keep paragraphs between 55 and 72 characters wide with generous 1.6 line-height for effortless scanning.',
      },
      {
        title: 'Tabular Alignment',
        body: 'Enable tabular-nums whenever displaying coordinates, color values, dimensions, or release indices.',
      },
    ],
  },
  {
    id: 'iconography',
    index: '05',
    title: 'Iconography',
    tagline: 'Precision 2px geometry that reads at a glance.',
    summary:
      'Built on a strict 24x24 pixel grid with uniform 2px strokes and crisp 45-degree terminals, our icons communicate actions immediately without visual ornament.',
    bg: '#B4DC19',
    hoverBg: '#A6CE0D',
    textColor: '#1E2E04',
    accentColor: '#2E4A06',
    principles: [
      {
        title: '2px Keyline Grid',
        body: 'Every icon sits inside a 2px live-area inset on a 24px artboard for consistent optical weight.',
      },
      {
        title: 'Affordance Over Decoration',
        body: 'Icons always signal interactive actions or concrete object types—never filler beside static headings.',
      },
      {
        title: 'Geometric Continuity',
        body: 'Rounded outer corners pair with crisp interior intersections to echo the Facet mark.',
      },
    ],
  },
  {
    id: 'color',
    index: '06',
    title: 'Color',
    tagline: 'Confident neutrals punctuated by expressive color fields.',
    summary:
      'White canvas and deep obsidian ink establish calm reading clarity, while Cobalt Core and our eight expressive accent fields distinguish disciplines and interactive states.',
    bg: '#FF8C19',
    hoverBg: '#F47D07',
    textColor: '#1E1002',
    accentColor: '#5C2900',
    principles: [
      {
        title: 'Cobalt as Anchor',
        body: 'Cobalt Core (#0061FF) is reserved strictly for brand presence, primary actions, and focal orientation.',
      },
      {
        title: 'WCAG AA Verified',
        body: 'Every foreground-to-surface pairing maintains at least 4.5:1 contrast for body copy and 3:1 for display.',
      },
      {
        title: 'Unapologetic Blocking',
        body: 'When using expressive palette colors, apply them as clean, full-bleed tonal blocks rather than muddy gradients.',
      },
    ],
  },
  {
    id: 'imagery',
    index: '07',
    title: 'Imagery',
    tagline: 'Atmospheric depth with tactile restraint.',
    summary:
      'From architectural silhouettes to duotone editorial washes, our imagery balances warm human presence with clean negative space so headlines always breathe.',
    bg: '#161618',
    hoverBg: '#7B1F48',
    textColor: '#FFFFFF',
    accentColor: '#E5A4C0',
    principles: [
      {
        title: 'Negative Space Priority',
        body: 'Frame subjects off-center with uncluttered sky or tonal backdrops so overlaid typography stays legible.',
      },
      {
        title: 'Duotone Tonal Discipline',
        body: 'Pair deep obsidian or plum shadows with warm highlight washes rather than oversaturated neon filters.',
      },
      {
        title: 'Authentic Craft',
        body: 'Favor natural side lighting, crisp architectural geometry, and tactile material textures.',
      },
    ],
  },
  {
    id: 'motion',
    index: '08',
    title: 'Motion',
    tagline: 'Choreographed physics with zero wasted frames.',
    summary:
      'Motion guides spatial orientation. Whether zooming out from a single statement into the full mosaic or settling a drawer into place, every curve decelerates with intention.',
    bg: '#C5A2F6',
    hoverBg: '#B68DF2',
    textColor: '#1F0F38',
    accentColor: '#3E1D6D',
    principles: [
      {
        title: 'Expo Deceleration',
        body: 'Routine UI feedback settles within 180ms using cubic-bezier(0.16, 1, 0.3, 1) so interfaces feel instant.',
      },
      {
        title: 'Compositor Only',
        body: 'Animate strictly transform and opacity properties—never trigger layout reflows during scroll.',
      },
      {
        title: 'Reduced Motion Respect',
        body: 'Honor prefers-reduced-motion by replacing spatial sweeps with crisp, immediate cross-fades.',
      },
    ],
  },
];

export const DISCIPLINE_MAP: Record<DisciplineId, DisciplineMeta> = DISCIPLINES.reduce(
  (acc, item) => {
    acc[item.id] = item;
    return acc;
  },
  {} as Record<DisciplineId, DisciplineMeta>
);
