import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  Grid,
  Play,
  SlidersHorizontal,
  Eye,
  Lock,
  Search,
  Layers,
  Compass,
  Sparkles,
  Image as ImageIcon,
  Type as TypeIcon,
  Zap,
} from 'lucide-react';
import {
  BRAND_SWATCHES,
  DISCIPLINES,
  DISCIPLINE_MAP,
  DisciplineId,
} from '../data/brandData';
import { FacetMark } from './FacetMark';

interface DisciplineModalProps {
  activeId: DisciplineId | null;
  onClose: () => void;
  onSelect: (id: DisciplineId) => void;
}

const FACET_SVG_STRING = `<svg width="120" height="104" viewBox="0 0 120 104" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M 32 6 L 60 23 L 32 40 L 4 23 Z" fill="#0061FF"/>
  <path d="M 88 6 L 116 23 L 88 40 L 60 23 Z" fill="#0061FF"/>
  <path d="M 32 40 L 60 57 L 32 74 L 4 57 Z" fill="#0061FF"/>
  <path d="M 88 40 L 116 57 L 88 74 L 60 57 Z" fill="#0061FF"/>
  <path d="M 60 64 L 88 81 L 60 98 L 32 81 Z" fill="#0061FF"/>
</svg>`;

export function DisciplineModal({
  activeId,
  onClose,
  onSelect,
}: DisciplineModalProps) {
  const discipline = activeId ? DISCIPLINE_MAP[activeId] : null;
  const currentIndex = activeId
    ? DISCIPLINES.findIndex((d) => d.id === activeId)
    : -1;

  // Interactive lab state
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [gridUnit, setGridUnit] = useState<8 | 16 | 24>(16);
  const [toneValue, setToneValue] = useState<number>(65);
  const [showClearspace, setShowClearspace] = useState<boolean>(true);
  const [logoSurface, setLogoSurface] = useState<'white' | 'cobalt' | 'sky' | 'obsidian'>('white');
  const [sampleText, setSampleText] = useState<string>(
    'Design systems built for clarity and quiet confidence.'
  );
  const [sampleWeight, setSampleWeight] = useState<400 | 500 | 600 | 700>(600);
  const [sampleScale, setSampleScale] = useState<'display' | 'heading' | 'body'>('display');
  const [iconStroke, setIconStroke] = useState<1.5 | 2 | 2.5>(2);
  const [contrastBg, setContrastBg] = useState<string>('#FFFFFF');
  const [contrastFg, setContrastFg] = useState<string>('#0061FF');
  const [imageryFilter, setImageryFilter] = useState<'wireframe' | 'plum' | 'cobalt'>('plum');
  const [motionTrigger, setMotionTrigger] = useState<number>(0);

  useEffect(() => {
    if (!activeId) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        const next = DISCIPLINES[(currentIndex + 1) % DISCIPLINES.length];
        onSelect(next.id);
      } else if (e.key === 'ArrowLeft') {
        const prev =
          DISCIPLINES[(currentIndex - 1 + DISCIPLINES.length) % DISCIPLINES.length];
        onSelect(prev.id);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [activeId, currentIndex, onClose, onSelect]);

  const handleCopy = (value: string, key: string) => {
    navigator.clipboard?.writeText(value);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1600);
  };

  const prevDiscipline =
    currentIndex >= 0
      ? DISCIPLINES[(currentIndex - 1 + DISCIPLINES.length) % DISCIPLINES.length]
      : null;
  const nextDiscipline =
    currentIndex >= 0
      ? DISCIPLINES[(currentIndex + 1) % DISCIPLINES.length]
      : null;

  return (
    <AnimatePresence>
      {discipline && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-6 md:p-10 bg-black/55 backdrop-blur-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="discipline-modal-title"
        >
          <motion.div
            className="relative w-full h-full sm:h-auto sm:max-h-[90vh] max-w-5xl bg-white text-[#161618] sm:rounded-xl overflow-hidden shadow-2xl flex flex-col border border-black/10"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Navigation Bar */}
            <div className="flex items-center justify-between gap-4 px-5 sm:px-8 py-4 border-b border-neutral-200 bg-white shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <FacetMark color="#0061FF" size={22} />
                <span className="text-sm font-semibold tracking-tight text-neutral-900 whitespace-nowrap">
                  Brand Guidelines
                </span>
                <span className="text-neutral-300 hidden sm:inline" aria-hidden="true">
                  /
                </span>
                <span className="text-sm text-neutral-500 font-mono tabular-nums hidden sm:inline whitespace-nowrap">
                  {discipline.index}. {discipline.title}
                </span>
              </div>

              {/* Compact discipline switcher on desktop */}
              <nav
                className="hidden lg:flex items-center gap-1"
                aria-label="Discipline navigation"
              >
                {DISCIPLINES.map((item) => {
                  const isActive = item.id === discipline.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onSelect(item.id)}
                      className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        isActive
                          ? 'bg-neutral-900 text-white'
                          : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                      }`}
                    >
                      {item.title}
                    </button>
                  );
                })}
              </nav>

              <button
                onClick={onClose}
                className="inline-flex items-center justify-center w-10 h-10 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer shrink-0 focus-visible:outline-2 focus-visible:outline-[#0061FF]"
                aria-label="Close guideline detail"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="overflow-y-auto flex-1">
              {/* Hero Color Banner */}
              <div
                className="px-6 sm:px-10 py-10 sm:py-12 transition-colors duration-300"
                style={{
                  backgroundColor:
                    discipline.id === 'imagery' ? '#7B1F48' : discipline.bg,
                  color: discipline.textColor,
                }}
              >
                <div className="max-w-3xl">
                  <div className="text-xs font-mono tabular-nums opacity-80 mb-3">
                    {discipline.index} — Discipline Specification
                  </div>
                  <h2
                    id="discipline-modal-title"
                    className="text-3xl sm:text-4xl font-semibold tracking-tight leading-tight mb-4"
                    style={{ textWrap: 'balance' }}
                  >
                    {discipline.title}: {discipline.tagline}
                  </h2>
                  <p className="text-base sm:text-lg leading-relaxed opacity-90 max-w-2xl">
                    {discipline.summary}
                  </p>
                </div>
              </div>

              {/* Main Spec Content */}
              <div className="px-6 sm:px-10 py-8 sm:py-10 space-y-10">
                {/* 3 Editorial Principles */}
                <section>
                  <h3 className="text-xs font-mono text-neutral-500 uppercase tracking-wider mb-5">
                    Core Standards
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {discipline.principles.map((p, idx) => (
                      <div
                        key={p.title}
                        className="p-5 border border-neutral-200 rounded-lg bg-neutral-50/50"
                      >
                        <div className="text-xs font-mono tabular-nums text-neutral-400 mb-2">
                          0{idx + 1}
                        </div>
                        <h4 className="text-base font-semibold text-neutral-900 mb-2">
                          {p.title}
                        </h4>
                        <p className="text-sm text-neutral-600 leading-relaxed">
                          {p.body}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Interactive Lab Section */}
                <section className="border-t border-neutral-200 pt-8">
                  {discipline.id === 'framework' && (
                    <div className="space-y-5">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-semibold text-neutral-900">
                            Architectural Grid Inspector
                          </h3>
                          <p className="text-sm text-neutral-600">
                            Inspect how our 8px base rhythm scales across layout surfaces.
                          </p>
                        </div>
                        <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-lg">
                          {([8, 16, 24] as const).map((unit) => (
                            <button
                              key={unit}
                              onClick={() => setGridUnit(unit)}
                              className={`px-3 py-1.5 text-xs font-mono tabular-nums rounded-md transition-colors cursor-pointer ${
                                gridUnit === unit
                                  ? 'bg-white text-neutral-900 shadow-xs'
                                  : 'text-neutral-600 hover:text-neutral-900'
                              }`}
                            >
                              {unit}px grid
                            </button>
                          ))}
                        </div>
                      </div>

                      <div
                        className="relative h-56 rounded-lg border border-neutral-200 overflow-hidden p-6 flex items-center justify-center bg-white"
                        style={{
                          backgroundImage:
                            'linear-gradient(to right, rgba(0, 97, 255, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 97, 255, 0.1) 1px, transparent 1px)',
                          backgroundSize: `${gridUnit}px ${gridUnit}px`,
                        }}
                      >
                        <div className="grid grid-cols-3 gap-3 w-full max-w-lg">
                          <div className="h-24 bg-[#23304C] text-white p-3 flex flex-col justify-between text-xs font-mono">
                            <span>COL 1</span>
                            <span className="tabular-nums">20%</span>
                          </div>
                          <div className="h-24 bg-[#0061FF] text-white p-3 flex flex-col justify-between text-xs font-mono">
                            <span>ANCHOR</span>
                            <span className="tabular-nums">1:1</span>
                          </div>
                          <div className="h-24 bg-[#3AC5F4] text-[#082436] p-3 flex flex-col justify-between text-xs font-mono">
                            <span>COL 3</span>
                            <span className="tabular-nums">30%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {discipline.id === 'voice' && (
                    <div className="space-y-6">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-semibold text-neutral-900">
                            Tone Spectrum Simulator
                          </h3>
                          <p className="text-sm text-neutral-600">
                            Adjust editorial warmth while maintaining structural clarity.
                          </p>
                        </div>
                        <div className="flex items-center gap-3 text-xs font-mono text-neutral-600">
                          <SlidersHorizontal className="w-4 h-4" />
                          <span>Direct</span>
                          <input
                            type="range"
                            min={0}
                            max={100}
                            value={toneValue}
                            onChange={(e) => setToneValue(Number(e.target.value))}
                            className="w-32 accent-[#0061FF] cursor-pointer"
                            aria-label="Tone warmth slider"
                          />
                          <span>Expressive</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-5 rounded-lg border border-neutral-200 bg-white">
                          <div className="text-xs font-mono text-neutral-400 mb-2">
                            Empty Workspace Prompt
                          </div>
                          <p className="text-base font-medium text-neutral-900">
                            {toneValue < 40
                              ? 'No guidelines saved in this project yet. Add a token set to begin.'
                              : toneValue < 75
                              ? 'Your canvas is clear. Start by defining your primary type and color tokens.'
                              : 'Every great identity starts with a blank grid. Drop in your first color or type specimen.'}
                          </p>
                        </div>
                        <div className="p-5 rounded-lg border border-neutral-200 bg-white">
                          <div className="text-xs font-mono text-neutral-400 mb-2">
                            Publishing Confirmation
                          </div>
                          <p className="text-base font-medium text-neutral-900">
                            {toneValue < 40
                              ? 'Guidelines published. All 8 discipline sheets are synced.'
                              : toneValue < 75
                              ? 'All set—your updated brand guidelines are live for the team.'
                              : 'Out in the world. Your refreshed identity system is ready for everyone to build with.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {discipline.id === 'logo' && (
                    <div className="space-y-5">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-semibold text-neutral-900">
                            Mark Clearspace & Surface Lockups
                          </h3>
                          <p className="text-sm text-neutral-600">
                            Test clearspace margins and copy production SVG artwork.
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            onClick={() => setShowClearspace((v) => !v)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors cursor-pointer ${
                              showClearspace
                                ? 'bg-neutral-900 text-white border-neutral-900'
                                : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'
                            }`}
                          >
                            <Grid className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
                            Clearspace Grid
                          </button>
                          <button
                            onClick={() => handleCopy(FACET_SVG_STRING, 'logo-svg')}
                            className="px-3 py-1.5 text-xs font-medium rounded-md bg-[#0061FF] text-white hover:bg-[#0050D6] transition-colors cursor-pointer"
                          >
                            {copiedKey === 'logo-svg' ? (
                              <>
                                <Check className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
                                SVG Copied
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
                                Copy SVG
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {(
                          [
                            { id: 'white', label: 'Pure White', bg: '#FFFFFF', fg: '#0061FF' },
                            { id: 'cobalt', label: 'Cobalt Core', bg: '#0061FF', fg: '#FFFFFF' },
                            { id: 'sky', label: 'Sky Cyan', bg: '#3AC5F4', fg: '#082436' },
                            { id: 'obsidian', label: 'Obsidian Ink', bg: '#161618', fg: '#FFFFFF' },
                          ] as const
                        ).map((s) => (
                          <button
                            key={s.id}
                            onClick={() => setLogoSurface(s.id)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md border cursor-pointer transition-colors ${
                              logoSurface === s.id
                                ? 'border-neutral-900 bg-neutral-900 text-white'
                                : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'
                            }`}
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>

                      <div
                        className="h-56 rounded-lg border border-neutral-200 flex items-center justify-center transition-colors duration-300"
                        style={{
                          backgroundColor:
                            logoSurface === 'white'
                              ? '#FFFFFF'
                              : logoSurface === 'cobalt'
                              ? '#0061FF'
                              : logoSurface === 'sky'
                              ? '#3AC5F4'
                              : '#161618',
                        }}
                      >
                        <div
                          className={`relative p-8 transition-all ${
                            showClearspace
                              ? 'border border-dashed border-current/40'
                              : 'border border-transparent'
                          }`}
                          style={{
                            color:
                              logoSurface === 'white'
                                ? '#0061FF'
                                : logoSurface === 'sky'
                                ? '#082436'
                                : '#FFFFFF',
                          }}
                        >
                          {showClearspace && (
                            <span className="absolute -top-5 left-0 text-[10px] font-mono opacity-75">
                              1x facet clearance
                            </span>
                          )}
                          <FacetMark
                            size={84}
                            color={
                              logoSurface === 'white'
                                ? '#0061FF'
                                : logoSurface === 'sky'
                                ? '#082436'
                                : '#FFFFFF'
                            }
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {discipline.id === 'typography' && (
                    <div className="space-y-5">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-semibold text-neutral-900">
                            Live Type Specimen Tester
                          </h3>
                          <p className="text-sm text-neutral-600">
                            Plus Jakarta Sans paired with JetBrains Mono for technical precision.
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-lg">
                            {(['display', 'heading', 'body'] as const).map((sc) => (
                              <button
                                key={sc}
                                onClick={() => setSampleScale(sc)}
                                className={`px-2.5 py-1 text-xs font-medium capitalize rounded-md cursor-pointer ${
                                  sampleScale === sc
                                    ? 'bg-white text-neutral-900 shadow-xs'
                                    : 'text-neutral-600 hover:text-neutral-900'
                                }`}
                              >
                                {sc}
                              </button>
                            ))}
                          </div>
                          <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-lg">
                            {([400, 500, 600, 700] as const).map((w) => (
                              <button
                                key={w}
                                onClick={() => setSampleWeight(w)}
                                className={`px-2.5 py-1 text-xs font-mono tabular-nums rounded-md cursor-pointer ${
                                  sampleWeight === w
                                    ? 'bg-white text-neutral-900 shadow-xs'
                                    : 'text-neutral-600 hover:text-neutral-900'
                                }`}
                              >
                                {w}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="p-6 rounded-lg border border-neutral-200 bg-neutral-50/50 space-y-4">
                        <textarea
                          value={sampleText}
                          onChange={(e) => setSampleText(e.target.value)}
                          rows={2}
                          className="w-full bg-transparent resize-none focus:outline-none text-neutral-900"
                          style={{
                            fontWeight: sampleWeight,
                            fontSize:
                              sampleScale === 'display'
                                ? 'clamp(1.75rem, 3vw, 2.5rem)'
                                : sampleScale === 'heading'
                                ? '1.375rem'
                                : '1rem',
                            lineHeight: sampleScale === 'display' ? 1.12 : 1.45,
                            letterSpacing: sampleScale === 'display' ? '-0.025em' : '0em',
                          }}
                          aria-label="Live typography test input"
                        />
                        <div className="flex items-center gap-4 text-xs font-mono tabular-nums text-neutral-500 pt-3 border-t border-neutral-200">
                          <span>Plus Jakarta Sans</span>
                          <span>·</span>
                          <span>Weight {sampleWeight}</span>
                          <span>·</span>
                          <span>
                            Tracking {sampleScale === 'display' ? '-0.025em' : '0em'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {discipline.id === 'iconography' && (
                    <div className="space-y-5">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-semibold text-neutral-900">
                            24px Keyline Icon System
                          </h3>
                          <p className="text-sm text-neutral-600">
                            Consistent stroke weight across every product surface.
                          </p>
                        </div>
                        <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-lg">
                          {([1.5, 2, 2.5] as const).map((sw) => (
                            <button
                              key={sw}
                              onClick={() => setIconStroke(sw)}
                              className={`px-3 py-1.5 text-xs font-mono tabular-nums rounded-md cursor-pointer ${
                                iconStroke === sw
                                  ? 'bg-white text-neutral-900 shadow-xs'
                                  : 'text-neutral-600 hover:text-neutral-900'
                              }`}
                            >
                              {sw}px
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                        {[
                          { Icon: Lock, name: 'Security' },
                          { Icon: Compass, name: 'Explore' },
                          { Icon: Layers, name: 'Layers' },
                          { Icon: Search, name: 'Search' },
                          { Icon: Eye, name: 'Preview' },
                          { Icon: ImageIcon, name: 'Media' },
                          { Icon: TypeIcon, name: 'Type' },
                          { Icon: Zap, name: 'Motion' },
                        ].map(({ Icon, name }) => (
                          <div
                            key={name}
                            className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg border border-neutral-200 bg-white hover:bg-[#B4DC19]/20 transition-colors"
                          >
                            <Icon
                              className="w-7 h-7 text-[#1E2E04]"
                              strokeWidth={iconStroke}
                            />
                            <span className="text-[11px] font-mono text-neutral-600">
                              {name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {discipline.id === 'color' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-neutral-900">
                          Interactive Palette & Contrast Tokens
                        </h3>
                        <p className="text-sm text-neutral-600">
                          Click any swatch to copy its HEX code, or test foreground/background contrast below.
                        </p>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                        {BRAND_SWATCHES.map((sw) => (
                          <button
                            key={sw.hex}
                            onClick={() => handleCopy(sw.hex, sw.hex)}
                            className="group text-left rounded-lg overflow-hidden border border-neutral-200 hover:border-neutral-400 transition-colors cursor-pointer bg-white"
                          >
                            <div
                              className="h-20 p-3 flex items-end justify-between"
                              style={{ backgroundColor: sw.hex, color: sw.onText }}
                            >
                              <span className="text-xs font-mono font-medium tabular-nums">
                                {copiedKey === sw.hex ? 'Copied' : sw.hex}
                              </span>
                            </div>
                            <div className="p-2.5">
                              <div className="text-xs font-semibold text-neutral-900 truncate">
                                {sw.name}
                              </div>
                              <div className="text-[11px] text-neutral-500 truncate">
                                {sw.role}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-lg border border-neutral-200 bg-neutral-50">
                        <div className="flex flex-wrap items-center gap-3">
                          <label className="text-xs font-mono text-neutral-600 flex items-center gap-2">
                            Surface
                            <select
                              value={contrastBg}
                              onChange={(e) => setContrastBg(e.target.value)}
                              className="px-2 py-1 rounded border border-neutral-300 bg-white text-neutral-900"
                            >
                              <option value="#FFFFFF">Pure White (#FFFFFF)</option>
                              <option value="#0061FF">Cobalt Core (#0061FF)</option>
                              <option value="#161618">Obsidian Ink (#161618)</option>
                              <option value="#F7CE46">Marigold (#F7CE46)</option>
                            </select>
                          </label>
                          <label className="text-xs font-mono text-neutral-600 flex items-center gap-2">
                            Text
                            <select
                              value={contrastFg}
                              onChange={(e) => setContrastFg(e.target.value)}
                              className="px-2 py-1 rounded border border-neutral-300 bg-white text-neutral-900"
                            >
                              <option value="#0061FF">Cobalt Core (#0061FF)</option>
                              <option value="#161618">Obsidian Ink (#161618)</option>
                              <option value="#FFFFFF">Pure White (#FFFFFF)</option>
                              <option value="#241B04">Warm Ink (#241B04)</option>
                            </select>
                          </label>
                        </div>
                        <div
                          className="px-5 py-2.5 rounded-md font-semibold text-sm border border-black/10"
                          style={{ backgroundColor: contrastBg, color: contrastFg }}
                        >
                          Sample Brand Headline
                        </div>
                      </div>
                    </div>
                  )}

                  {discipline.id === 'imagery' && (
                    <div className="space-y-5">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-semibold text-neutral-900">
                            Editorial Composition & Tonal Treatments
                          </h3>
                          <p className="text-sm text-neutral-600">
                            Toggle between keyline wireframe, plum duotone, and cobalt treatments.
                          </p>
                        </div>
                        <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-lg">
                          {(
                            [
                              { id: 'wireframe', label: 'Keyline' },
                              { id: 'plum', label: 'Plum Wash' },
                              { id: 'cobalt', label: 'Cobalt Wash' },
                            ] as const
                          ).map((mode) => (
                            <button
                              key={mode.id}
                              onClick={() => setImageryFilter(mode.id)}
                              className={`px-3 py-1.5 text-xs font-medium rounded-md cursor-pointer ${
                                imageryFilter === mode.id
                                  ? 'bg-white text-neutral-900 shadow-xs'
                                  : 'text-neutral-600 hover:text-neutral-900'
                              }`}
                            >
                              {mode.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div
                        className="h-60 rounded-lg border border-neutral-200 p-6 flex items-center justify-between transition-colors duration-300"
                        style={{
                          backgroundColor:
                            imageryFilter === 'wireframe'
                              ? '#161618'
                              : imageryFilter === 'plum'
                              ? '#7B1F48'
                              : '#0061FF',
                        }}
                      >
                        <div className="max-w-xs text-white space-y-2">
                          <div className="text-xs font-mono opacity-75">
                            Treatment: {imageryFilter}
                          </div>
                          <div className="text-xl font-semibold tracking-tight">
                            Balanced foreground silhouettes leave open room for headlines.
                          </div>
                        </div>
                        <svg viewBox="0 0 260 156" className="w-60 h-auto hidden sm:block" fill="none">
                          <rect
                            x="2"
                            y="2"
                            width="256"
                            height="152"
                            stroke="#FFFFFF"
                            strokeOpacity={0.7}
                            strokeWidth="2"
                            fill={
                              imageryFilter === 'wireframe'
                                ? 'transparent'
                                : imageryFilter === 'plum'
                                ? '#5D1435'
                                : '#0047BD'
                            }
                          />
                          <circle
                            cx="196"
                            cy="46"
                            r="18"
                            stroke="#FFFFFF"
                            strokeWidth="2"
                            fill={
                              imageryFilter === 'wireframe'
                                ? 'transparent'
                                : imageryFilter === 'plum'
                                ? '#E5A4C0'
                                : '#8CB8FF'
                            }
                          />
                          <path
                            d="M2 154 L94 64 L164 132 L206 94 L258 142 L258 154 Z"
                            stroke="#FFFFFF"
                            strokeWidth="2"
                            fill={
                              imageryFilter === 'wireframe'
                                ? 'transparent'
                                : imageryFilter === 'plum'
                                ? '#B35D84'
                                : '#3D89FF'
                            }
                          />
                        </svg>
                      </div>
                    </div>
                  )}

                  {discipline.id === 'motion' && (
                    <div className="space-y-5">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-semibold text-neutral-900">
                            Easing Curve Playground
                          </h3>
                          <p className="text-sm text-neutral-600">
                            Compare our three calibrated easing curves in real time.
                          </p>
                        </div>
                        <button
                          onClick={() => setMotionTrigger((n) => n + 1)}
                          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-md bg-[#0061FF] text-white hover:bg-[#0050D6] transition-colors cursor-pointer"
                        >
                          <Play className="w-3.5 h-3.5" />
                          Replay Curves
                        </button>
                      </div>

                      <div className="space-y-3">
                        {[
                          {
                            label: 'Micro Feedback',
                            token: '180ms · cubic-bezier(0.16, 1, 0.3, 1)',
                            duration: 0.18,
                            ease: [0.16, 1, 0.3, 1] as const,
                            color: '#0061FF',
                          },
                          {
                            label: 'Tile Morph',
                            token: '420ms · cubic-bezier(0.22, 1, 0.36, 1)',
                            duration: 0.42,
                            ease: [0.22, 1, 0.36, 1] as const,
                            color: '#7B1F48',
                          },
                          {
                            label: 'Spatial Zoom',
                            token: '700ms · cubic-bezier(0.32, 0.72, 0, 1)',
                            duration: 0.7,
                            ease: [0.32, 0.72, 0, 1] as const,
                            color: '#23304C',
                          },
                        ].map((curve) => (
                          <div
                            key={curve.label}
                            className="p-4 rounded-lg border border-neutral-200 bg-white space-y-2.5"
                          >
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-semibold text-neutral-900">
                                {curve.label}
                              </span>
                              <span className="font-mono tabular-nums text-neutral-500">
                                {curve.token}
                              </span>
                            </div>
                            <div className="relative h-8 bg-neutral-100 rounded-md overflow-hidden flex items-center px-2">
                              <motion.div
                                key={`${curve.label}-${motionTrigger}`}
                                className="w-14 h-5 rounded-xs"
                                style={{ backgroundColor: curve.color }}
                                initial={{ x: 0 }}
                                animate={{ x: 'calc(100% + 180px)' }}
                                transition={{
                                  duration: curve.duration,
                                  ease: curve.ease,
                                  repeat: 1,
                                  repeatType: 'reverse',
                                  repeatDelay: 0.25,
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </section>
              </div>
            </div>

            {/* Footer Prev / Next */}
            <div className="flex items-center justify-between px-5 sm:px-8 py-3.5 border-t border-neutral-200 bg-neutral-50 shrink-0">
              {prevDiscipline ? (
                <button
                  onClick={() => onSelect(prevDiscipline.id)}
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-neutral-700 hover:text-neutral-900 py-1.5 px-2 rounded-md hover:bg-neutral-200/60 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>
                    {prevDiscipline.index}. {prevDiscipline.title}
                  </span>
                </button>
              ) : (
                <span />
              )}

              <span className="text-xs font-mono text-neutral-400 hidden sm:inline">
                <Sparkles className="w-3.5 h-3.5 inline mr-1 -mt-0.5" />
                Use arrow keys to step through disciplines
              </span>

              {nextDiscipline ? (
                <button
                  onClick={() => onSelect(nextDiscipline.id)}
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-neutral-700 hover:text-neutral-900 py-1.5 px-2 rounded-md hover:bg-neutral-200/60 transition-colors cursor-pointer"
                >
                  <span>
                    {nextDiscipline.index}. {nextDiscipline.title}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <span />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
