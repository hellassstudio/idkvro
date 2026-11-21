import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react';
import { ChevronsDown, ArrowUp, BookOpen } from 'lucide-react';
import { DISCIPLINES, DISCIPLINE_MAP, DisciplineId } from '../data/brandData';
import { FacetMark } from './FacetMark';
import { TileArtwork } from './TileArtwork';

interface ScrollBrandStageProps {
  onSelectDiscipline: (id: DisciplineId) => void;
}

interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface TileCardProps {
  id: DisciplineId;
  className?: string;
  hoveredId: DisciplineId | null;
  setHoveredId: (id: DisciplineId | null) => void;
  onSelect: (id: DisciplineId) => void;
  interactive: boolean;
}

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

function easeInOutQuart(t: number) {
  return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
}

function easeOutQuart(t: number) {
  return 1 - Math.pow(1 - t, 4);
}

function lerpEased(
  p: number,
  inStart: number,
  inEnd: number,
  outStart: number,
  outEnd: number,
  easing: (t: number) => number = easeInOutQuart
) {
  if (inEnd === inStart) return outEnd;
  const raw = clamp01((p - inStart) / (inEnd - inStart));
  const t = easing(raw);
  return outStart + (outEnd - outStart) * t;
}

function BentoTileButton({
  id,
  className = '',
  hoveredId,
  setHoveredId,
  onSelect,
  interactive,
}: TileCardProps) {
  const meta = DISCIPLINE_MAP[id];
  const isHovered = hoveredId === id;
  const isDimmed = interactive && hoveredId !== null && hoveredId !== id;

  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      onMouseEnter={() => setHoveredId(id)}
      onMouseLeave={() => setHoveredId(null)}
      onFocus={() => setHoveredId(id)}
      onBlur={() => setHoveredId(null)}
      disabled={!interactive}
      tabIndex={interactive ? 0 : -1}
      aria-label={`Explore ${meta.title} brand guidelines`}
      className={`group relative w-full h-full text-left p-5 md:p-6 flex flex-col justify-between overflow-hidden transition-[background-color,opacity,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-white ${
        interactive ? 'cursor-pointer' : 'cursor-default pointer-events-none'
      } ${className}`}
      style={{
        backgroundColor: isHovered ? meta.hoverBg : meta.bg,
        color: meta.textColor,
        opacity: isDimmed ? 0.88 : 1,
      }}
    >
      <div className="relative z-10 flex items-baseline justify-between gap-2">
        <span className="text-xl md:text-2xl lg:text-[26px] font-medium tracking-tight leading-none whitespace-nowrap">
          {meta.title}
        </span>
        <span
          className={`text-xs font-mono tabular-nums transition-all duration-200 ${
            isHovered ? 'opacity-80 translate-x-0' : 'opacity-0 translate-x-1'
          }`}
          aria-hidden="true"
        >
          {meta.index}
        </span>
      </div>

      <div className="relative z-10 flex-1 w-full flex items-end pt-3">
        <TileArtwork id={id} hovered={isHovered} />
      </div>
    </button>
  );
}

export function ScrollBrandStage({ onSelectDiscipline }: ScrollBrandStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const centerCellRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const [hoveredId, setHoveredId] = useState<DisciplineId | null>(null);
  const [introPhase, setIntroPhase] = useState<'blueprint' | 'settled'>(
    prefersReducedMotion ? 'settled' : 'blueprint'
  );
  const [isMosaicReady, setIsMosaicReady] = useState<boolean>(false);
  const [activeStageIndex, setActiveStageIndex] = useState<0 | 1 | 2>(0);

  const [viewport, setViewport] = useState<{ w: number; h: number }>({
    w: typeof window !== 'undefined' ? window.innerWidth : 1440,
    h: typeof window !== 'undefined' ? window.innerHeight : 900,
  });

  const [targetRect, setTargetRect] = useState<Rect>({
    left: 580,
    top: 380,
    width: 112,
    height: 112,
  });

  const geomRef = useRef({
    heroLeft: 484,
    heroTop: 44,
    heroWidth: 472,
    heroHeight: 812,
    targetRect: { left: 580, top: 380, width: 112, height: 112 },
    vw: 1440,
    vh: 900,
  });

  // Choreographed intro beat: blueprint draw-in -> settled hero card
  useEffect(() => {
    if (prefersReducedMotion) {
      setIntroPhase('settled');
      return;
    }
    const timer = setTimeout(() => setIntroPhase('settled'), 1050);
    return () => clearTimeout(timer);
  }, [prefersReducedMotion]);

  const measureLayout = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const isDesktopNow = w >= 768;
    const heroW = isDesktopNow
      ? Math.min(472, Math.max(320, w * 0.34))
      : Math.max(280, w - 32);
    const heroT = isDesktopNow ? 44 : 20;
    const heroH = Math.max(360, h - heroT * 2);
    const heroL = (w - heroW) / 2;

    let nextTarget = geomRef.current.targetRect;
    if (centerCellRef.current && stageRef.current) {
      const cell = centerCellRef.current.getBoundingClientRect();
      const stage = stageRef.current.getBoundingClientRect();
      if (cell.width > 0 && cell.height > 0) {
        nextTarget = {
          left: cell.left - stage.left,
          top: cell.top - stage.top,
          width: cell.width,
          height: cell.height,
        };
      }
    }

    geomRef.current = {
      heroLeft: heroL,
      heroTop: heroT,
      heroWidth: heroW,
      heroHeight: heroH,
      targetRect: nextTarget,
      vw: w,
      vh: h,
    };

    setViewport({ w, h });
    setTargetRect(nextTarget);
  };

  useLayoutEffect(() => {
    measureLayout();
    const ro = new ResizeObserver(() => measureLayout());
    if (centerCellRef.current) ro.observe(centerCellRef.current);
    if (stageRef.current) ro.observe(stageRef.current);
    window.addEventListener('resize', measureLayout);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measureLayout);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Silky inertial dolly spring for premium wheel/trackpad smoothing
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 115,
    damping: 24,
    mass: 0.55,
    restDelta: 0.0001,
  });

  const progress = prefersReducedMotion ? scrollYProgress : smoothProgress;

  useMotionValueEvent(progress, 'change', (latest) => {
    if (latest > 0.02 && introPhase !== 'settled') {
      setIntroPhase('settled');
    }
    setIsMosaicReady(latest >= 0.78);
    if (latest < 0.16) {
      setActiveStageIndex(0);
    } else if (latest < 0.65) {
      setActiveStageIndex(1);
    } else {
      setActiveStageIndex(2);
    }
  });

  // Scroll cleanly to one of the 3 editorial stages (Overview, Identity, Mosaic)
  const scrollToStage = (stage: 0 | 1 | 2) => {
    if (!containerRef.current) return;
    const totalScrollable =
      containerRef.current.offsetHeight - window.innerHeight;
    const ratio = stage === 0 ? 0 : stage === 1 ? 0.32 : 1;
    window.scrollTo({
      top: containerRef.current.offsetTop + totalScrollable * ratio,
      behavior: 'smooth',
    });
  };

  // Keyboard shortcuts: 1-8 jump into disciplines when mosaic is active
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }
      if (isMosaicReady && e.key >= '1' && e.key <= '8') {
        const idx = Number(e.key) - 1;
        if (DISCIPLINES[idx]) {
          onSelectDiscipline(DISCIPLINES[idx].id);
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isMosaicReady, onSelectDiscipline]);

  const isDesktop = viewport.w >= 768;
  const heroWidth = isDesktop
    ? Math.min(472, Math.max(320, viewport.w * 0.34))
    : Math.max(280, viewport.w - 32);
  const heroTop = isDesktop ? 44 : 20;
  const heroHeight = Math.max(360, viewport.h - heroTop * 2);
  const heroLeft = (viewport.w - heroWidth) / 2;

  // Center Cobalt Card: eased dolly zoom-out from centered column to exact pinwheel square
  const cardX = useTransform(progress, (p) => {
    const g = geomRef.current;
    return lerpEased(p, 0.36, 0.88, g.heroLeft, g.targetRect.left, easeInOutQuart);
  });
  const cardY = useTransform(progress, (p) => {
    const g = geomRef.current;
    return lerpEased(p, 0.36, 0.88, g.heroTop, g.targetRect.top, easeInOutQuart);
  });
  const cardScaleX = useTransform(progress, (p) => {
    const g = geomRef.current;
    return lerpEased(p, 0.36, 0.88, 1, g.targetRect.width / g.heroWidth, easeInOutQuart);
  });
  const cardScaleY = useTransform(progress, (p) => {
    const g = geomRef.current;
    return lerpEased(p, 0.36, 0.88, 1, g.targetRect.height / g.heroHeight, easeInOutQuart);
  });

  // White -> Cobalt background inversion
  const cobaltFillOpacity = useTransform(progress, (p) =>
    lerpEased(p, 0.1, 0.3, 0, 1, easeOutQuart)
  );

  // Copy cross-fades inside hero column
  const headline1Opacity = useTransform(progress, (p) =>
    lerpEased(p, 0.08, 0.22, 1, 0, easeOutQuart)
  );
  const headline1Y = useTransform(progress, (p) =>
    lerpEased(p, 0.08, 0.22, 0, -14, easeOutQuart)
  );

  const headline2Opacity = useTransform(progress, (p) => {
    if (p < 0.16) return 0;
    if (p < 0.3) return lerpEased(p, 0.16, 0.3, 0, 1, easeOutQuart);
    if (p < 0.38) return 1;
    return lerpEased(p, 0.38, 0.5, 1, 0, easeOutQuart);
  });
  const headline2Y = useTransform(progress, (p) =>
    lerpEased(p, 0.16, 0.3, 14, 0, easeOutQuart)
  );

  // Chevron fade
  const chevronOpacity = useTransform(progress, (p) =>
    lerpEased(p, 0.34, 0.46, 1, 0, easeOutQuart)
  );
  const chevronBlueOpacity = useTransform(progress, (p) =>
    lerpEased(p, 0.11, 0.25, 1, 0, easeOutQuart)
  );
  const chevronWhiteOpacity = useTransform(progress, (p) =>
    lerpEased(p, 0.14, 0.28, 0, 1, easeOutQuart)
  );

  // FacetMark glide from bottom-left of hero column to exact center of target square
  const markX = useTransform(progress, (p) => {
    const g = geomRef.current;
    const startX = g.heroLeft + 28;
    const endX = g.targetRect.left + g.targetRect.width / 2 - 14;
    return lerpEased(p, 0.36, 0.88, startX, endX, easeInOutQuart);
  });
  const markY = useTransform(progress, (p) => {
    const g = geomRef.current;
    const startY = g.heroTop + g.heroHeight - 28 - 25;
    const endY = g.targetRect.top + g.targetRect.height / 2 - 12;
    return lerpEased(p, 0.36, 0.88, startY, endY, easeInOutQuart);
  });
  const markScale = useTransform(progress, (p) =>
    lerpEased(p, 0.36, 0.88, 1, 1.38, easeInOutQuart)
  );
  const markBlueOpacity = useTransform(progress, (p) =>
    lerpEased(p, 0.11, 0.25, 1, 0, easeOutQuart)
  );
  const markWhiteOpacity = useTransform(progress, (p) =>
    lerpEased(p, 0.13, 0.27, 0, 1, easeOutQuart)
  );

  // Blueprint grid lines remain visible through camera pull-back and dissolve softly as gutters lock
  const gridLinesOpacity = useTransform(progress, (p) =>
    lerpEased(p, 0.72, 0.92, 1, 0, easeOutQuart)
  );

  // Radial grid-aligned camera convergence for the 8 outer tiles (matches video framing)
  const colorX = useTransform(progress, (p) =>
    lerpEased(p, 0.2, 0.86, -geomRef.current.vw * 0.44, 0, easeOutQuart)
  );
  const colorY = useTransform(progress, (p) =>
    lerpEased(p, 0.2, 0.86, geomRef.current.vh * 0.26, 0, easeOutQuart)
  );
  const colorOpacity = useTransform(progress, (p) =>
    lerpEased(p, 0.18, 0.36, 0, 1, easeOutQuart)
  );

  const logoX = useTransform(progress, (p) =>
    lerpEased(p, 0.22, 0.86, geomRef.current.vw * 0.44, 0, easeOutQuart)
  );
  const logoY = useTransform(progress, (p) =>
    lerpEased(p, 0.22, 0.86, -geomRef.current.vh * 0.18, 0, easeOutQuart)
  );
  const logoOpacity = useTransform(progress, (p) =>
    lerpEased(p, 0.2, 0.38, 0, 1, easeOutQuart)
  );

  const voiceX = useTransform(progress, (p) =>
    lerpEased(p, 0.32, 0.88, -geomRef.current.vw * 0.08, 0, easeOutQuart)
  );
  const voiceY = useTransform(progress, (p) =>
    lerpEased(p, 0.32, 0.88, -geomRef.current.vh * 0.56, 0, easeOutQuart)
  );
  const voiceOpacity = useTransform(progress, (p) =>
    lerpEased(p, 0.3, 0.46, 0, 1, easeOutQuart)
  );

  const imageryX = useTransform(progress, (p) =>
    lerpEased(p, 0.32, 0.88, geomRef.current.vw * 0.12, 0, easeOutQuart)
  );
  const imageryY = useTransform(progress, (p) =>
    lerpEased(p, 0.32, 0.88, geomRef.current.vh * 0.58, 0, easeOutQuart)
  );
  const imageryOpacity = useTransform(progress, (p) =>
    lerpEased(p, 0.3, 0.46, 0, 1, easeOutQuart)
  );

  const frameworkX = useTransform(progress, (p) =>
    lerpEased(p, 0.42, 0.91, -geomRef.current.vw * 0.38, 0, easeOutQuart)
  );
  const frameworkY = useTransform(progress, (p) =>
    lerpEased(p, 0.42, 0.91, -geomRef.current.vh * 0.26, 0, easeOutQuart)
  );
  const frameworkOpacity = useTransform(progress, (p) =>
    lerpEased(p, 0.4, 0.56, 0, 1, easeOutQuart)
  );

  const iconographyX = useTransform(progress, (p) =>
    lerpEased(p, 0.44, 0.91, -geomRef.current.vw * 0.38, 0, easeOutQuart)
  );
  const iconographyY = useTransform(progress, (p) =>
    lerpEased(p, 0.44, 0.91, geomRef.current.vh * 0.24, 0, easeOutQuart)
  );
  const iconographyOpacity = useTransform(progress, (p) =>
    lerpEased(p, 0.42, 0.58, 0, 1, easeOutQuart)
  );

  const typographyX = useTransform(progress, (p) =>
    lerpEased(p, 0.42, 0.91, geomRef.current.vw * 0.38, 0, easeOutQuart)
  );
  const typographyY = useTransform(progress, (p) =>
    lerpEased(p, 0.42, 0.91, -geomRef.current.vh * 0.24, 0, easeOutQuart)
  );
  const typographyOpacity = useTransform(progress, (p) =>
    lerpEased(p, 0.4, 0.56, 0, 1, easeOutQuart)
  );

  const motionX = useTransform(progress, (p) =>
    lerpEased(p, 0.44, 0.91, geomRef.current.vw * 0.38, 0, easeOutQuart)
  );
  const motionY = useTransform(progress, (p) =>
    lerpEased(p, 0.44, 0.91, geomRef.current.vh * 0.26, 0, easeOutQuart)
  );
  const motionOpacity = useTransform(progress, (p) =>
    lerpEased(p, 0.42, 0.58, 0, 1, easeOutQuart)
  );

  const mosaicDockOpacity = useTransform(progress, (p) =>
    lerpEased(p, 0.85, 0.96, 0, 1, easeOutQuart)
  );

  const targetMarker = `${targetRect.left}-${targetRect.top}-${targetRect.width}`;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[360vh] bg-white"
      data-layout={targetMarker}
    >
      <div
        ref={stageRef}
        className="sticky top-0 w-full h-screen overflow-hidden bg-white"
      >
        {/* Layer 1: Architectural Blueprint Hairlines with Draw-In Intro */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-0"
          style={{ opacity: gridLinesOpacity }}
          aria-hidden="true"
        >
          {/* Horizontal rules sweep outward from center */}
          <motion.div
            className="absolute left-0 right-0 h-px bg-[#DCE8FF] origin-center"
            style={{ top: heroTop }}
            initial={prefersReducedMotion ? false : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.div
            className="absolute left-0 right-0 h-px bg-[#DCE8FF] origin-center"
            style={{ top: heroTop + heroHeight }}
            initial={prefersReducedMotion ? false : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.75, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Vertical rules sweep top-to-bottom */}
          <motion.div
            className="absolute top-0 bottom-0 w-px bg-[#DCE8FF] origin-center"
            style={{ left: heroLeft }}
            initial={prefersReducedMotion ? false : { scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.75, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.div
            className="absolute top-0 bottom-0 w-px bg-[#DCE8FF] origin-center"
            style={{ left: heroLeft + heroWidth }}
            initial={prefersReducedMotion ? false : { scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.75, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          />

          {isDesktop && (
            <>
              <motion.div
                className="absolute top-0 bottom-0 w-px bg-[#EDF3FF] origin-center"
                style={{ left: '19%' }}
                initial={prefersReducedMotion ? false : { scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.85, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
              />
              <motion.div
                className="absolute top-0 bottom-0 w-px bg-[#EDF3FF] origin-center"
                style={{ left: '81%' }}
                initial={prefersReducedMotion ? false : { scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.85, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
              />
            </>
          )}
        </motion.div>

        {/* Layer 2: Full-Viewport Asymmetric Bento Mosaic */}
        {isDesktop ? (
          <div className="relative z-10 w-full h-full p-2 grid grid-cols-[19fr_62fr_19fr] gap-2">
            {/* Left Wing Column */}
            <div className="h-full grid grid-rows-[54fr_46fr] gap-2">
              <motion.div
                className="w-full h-full"
                style={{ x: frameworkX, y: frameworkY, opacity: frameworkOpacity }}
              >
                <BentoTileButton
                  id="framework"
                  hoveredId={hoveredId}
                  setHoveredId={setHoveredId}
                  onSelect={onSelectDiscipline}
                  interactive={isMosaicReady}
                />
              </motion.div>
              <motion.div
                className="w-full h-full"
                style={{
                  x: iconographyX,
                  y: iconographyY,
                  opacity: iconographyOpacity,
                }}
              >
                <BentoTileButton
                  id="iconography"
                  hoveredId={hoveredId}
                  setHoveredId={setHoveredId}
                  onSelect={onSelectDiscipline}
                  interactive={isMosaicReady}
                />
              </motion.div>
            </div>

            {/* Center 3x3 Pinwheel Grid */}
            <div
              className="h-full grid gap-2"
              style={{
                gridTemplateColumns:
                  '1fr clamp(84px, 7.6vw, 116px) 1.32fr',
                gridTemplateRows:
                  '1fr clamp(84px, 7.6vw, 116px) 1.15fr',
              }}
            >
              <motion.div
                className="col-start-1 col-end-3 row-start-1 row-end-2 w-full h-full"
                style={{ x: voiceX, y: voiceY, opacity: voiceOpacity }}
              >
                <BentoTileButton
                  id="voice"
                  hoveredId={hoveredId}
                  setHoveredId={setHoveredId}
                  onSelect={onSelectDiscipline}
                  interactive={isMosaicReady}
                />
              </motion.div>

              <motion.div
                className="col-start-3 col-end-4 row-start-1 row-end-3 w-full h-full"
                style={{ x: logoX, y: logoY, opacity: logoOpacity }}
              >
                <BentoTileButton
                  id="logo"
                  hoveredId={hoveredId}
                  setHoveredId={setHoveredId}
                  onSelect={onSelectDiscipline}
                  interactive={isMosaicReady}
                />
              </motion.div>

              <motion.div
                className="col-start-1 col-end-2 row-start-2 row-end-4 w-full h-full"
                style={{ x: colorX, y: colorY, opacity: colorOpacity }}
              >
                <BentoTileButton
                  id="color"
                  hoveredId={hoveredId}
                  setHoveredId={setHoveredId}
                  onSelect={onSelectDiscipline}
                  interactive={isMosaicReady}
                />
              </motion.div>

              <div
                ref={centerCellRef}
                className="col-start-2 col-end-3 row-start-2 row-end-3 w-full h-full pointer-events-none"
                aria-hidden="true"
              />

              <motion.div
                className="col-start-2 col-end-4 row-start-3 row-end-4 w-full h-full"
                style={{ x: imageryX, y: imageryY, opacity: imageryOpacity }}
              >
                <BentoTileButton
                  id="imagery"
                  hoveredId={hoveredId}
                  setHoveredId={setHoveredId}
                  onSelect={onSelectDiscipline}
                  interactive={isMosaicReady}
                />
              </motion.div>
            </div>

            {/* Right Wing Column */}
            <div className="h-full grid grid-rows-[46fr_54fr] gap-2">
              <motion.div
                className="w-full h-full"
                style={{
                  x: typographyX,
                  y: typographyY,
                  opacity: typographyOpacity,
                }}
              >
                <BentoTileButton
                  id="typography"
                  hoveredId={hoveredId}
                  setHoveredId={setHoveredId}
                  onSelect={onSelectDiscipline}
                  interactive={isMosaicReady}
                />
              </motion.div>
              <motion.div
                className="w-full h-full"
                style={{ x: motionX, y: motionY, opacity: motionOpacity }}
              >
                <BentoTileButton
                  id="motion"
                  hoveredId={hoveredId}
                  setHoveredId={setHoveredId}
                  onSelect={onSelectDiscipline}
                  interactive={isMosaicReady}
                />
              </motion.div>
            </div>
          </div>
        ) : (
          /* Mobile / Tablet Clean 2-Column Mosaic */
          <div className="relative z-10 w-full h-full p-2 grid grid-cols-2 grid-rows-[72px_1fr_1fr_1fr_1fr] gap-2">
            <div className="col-span-2 flex items-center justify-center">
              <div
                ref={centerCellRef}
                className="w-[72px] h-[72px]"
                aria-hidden="true"
              />
            </div>
            <motion.div style={{ x: frameworkX, opacity: frameworkOpacity }}>
              <BentoTileButton
                id="framework"
                hoveredId={hoveredId}
                setHoveredId={setHoveredId}
                onSelect={onSelectDiscipline}
                interactive={isMosaicReady}
              />
            </motion.div>
            <motion.div style={{ x: voiceX, opacity: voiceOpacity }}>
              <BentoTileButton
                id="voice"
                hoveredId={hoveredId}
                setHoveredId={setHoveredId}
                onSelect={onSelectDiscipline}
                interactive={isMosaicReady}
              />
            </motion.div>
            <motion.div style={{ x: logoX, opacity: logoOpacity }}>
              <BentoTileButton
                id="logo"
                hoveredId={hoveredId}
                setHoveredId={setHoveredId}
                onSelect={onSelectDiscipline}
                interactive={isMosaicReady}
              />
            </motion.div>
            <motion.div style={{ x: typographyX, opacity: typographyOpacity }}>
              <BentoTileButton
                id="typography"
                hoveredId={hoveredId}
                setHoveredId={setHoveredId}
                onSelect={onSelectDiscipline}
                interactive={isMosaicReady}
              />
            </motion.div>
            <motion.div style={{ x: iconographyX, opacity: iconographyOpacity }}>
              <BentoTileButton
                id="iconography"
                hoveredId={hoveredId}
                setHoveredId={setHoveredId}
                onSelect={onSelectDiscipline}
                interactive={isMosaicReady}
              />
            </motion.div>
            <motion.div style={{ x: colorX, opacity: colorOpacity }}>
              <BentoTileButton
                id="color"
                hoveredId={hoveredId}
                setHoveredId={setHoveredId}
                onSelect={onSelectDiscipline}
                interactive={isMosaicReady}
              />
            </motion.div>
            <motion.div style={{ x: imageryX, opacity: imageryOpacity }}>
              <BentoTileButton
                id="imagery"
                hoveredId={hoveredId}
                setHoveredId={setHoveredId}
                onSelect={onSelectDiscipline}
                interactive={isMosaicReady}
              />
            </motion.div>
            <motion.div style={{ x: motionX, opacity: motionOpacity }}>
              <BentoTileButton
                id="motion"
                hoveredId={hoveredId}
                setHoveredId={setHoveredId}
                onSelect={onSelectDiscipline}
                interactive={isMosaicReady}
              />
            </motion.div>
          </div>
        )}

        {/* Layer 3: Morphing Central Hero Column -> Pinwheel Center Cobalt Square */}
        <motion.div
          className="absolute top-0 left-0 z-20 origin-top-left bg-white overflow-hidden"
          style={{
            width: heroWidth,
            height: heroHeight,
            x: cardX,
            y: cardY,
            scaleX: cardScaleX,
            scaleY: cardScaleY,
          }}
        >
          <motion.div
            className="absolute inset-0 bg-[#0061FF]"
            style={{ opacity: cobaltFillOpacity }}
          />
          {isMosaicReady && (
            <button
              type="button"
              onClick={() => scrollToStage(0)}
              aria-label="Return to brand guidelines introduction"
              title="Back to overview"
              className="absolute inset-0 w-full h-full cursor-pointer hover:bg-black/10 transition-colors focus-visible:outline-2 focus-visible:outline-white"
            />
          )}
        </motion.div>

        {/* Layer 4: Unscaled Hero Copy & Choreographed Intro Blueprint */}
        <div
          className="absolute z-30 pointer-events-none flex flex-col justify-between p-7 md:p-8"
          style={{
            left: heroLeft,
            top: heroTop,
            width: heroWidth,
            height: heroHeight,
          }}
        >
          <div className="relative">
            {/* Blueprint Intro Sequence (00:00 -> 00:01) */}
            <motion.div
              className="absolute inset-x-0 top-0 flex items-center justify-center pointer-events-none"
              style={{ height: heroHeight - 120 }}
              initial={false}
              animate={{
                opacity: introPhase === 'blueprint' ? 1 : 0,
                scale: introPhase === 'blueprint' ? 1 : 0.65,
                y: introPhase === 'blueprint' ? 0 : 120,
              }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              aria-hidden="true"
            >
              <FacetMark variant="wireframe" color="#0061FF" size={148} />
            </motion.div>

            {/* Headline 1 (White card, Cobalt text) */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
              animate={{
                opacity: introPhase === 'blueprint' ? 0.14 : 1,
                y: introPhase === 'blueprint' ? 8 : 0,
              }}
              transition={{
                duration: 0.65,
                delay: introPhase === 'blueprint' ? 0 : 0.05,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <motion.h1
                className="text-[26px] sm:text-[30px] md:text-[33px] font-medium tracking-[-0.02em] leading-[1.18] text-[#0061FF]"
                style={{
                  opacity: headline1Opacity,
                  y: headline1Y,
                  textWrap: 'balance',
                }}
              >
                At Facet, our Brand Guidelines help us infuse everything we make
                with identity.
              </motion.h1>
            </motion.div>

            {/* Headline 2 (Cobalt card, Crisp white text) */}
            <motion.p
              className="absolute top-0 left-0 right-0 text-[22px] sm:text-[26px] md:text-[29px] font-medium tracking-[-0.02em] leading-[1.2] text-white"
              style={{
                opacity: headline2Opacity,
                y: headline2Y,
                textWrap: 'balance',
              }}
            >
              From icons to illustration, logos to language, this collection is
              the foundation for how Facet looks, feels, and sounds.
            </motion.p>
          </div>

          {/* Bottom-right Scroll Cue Chevrons */}
          <motion.div
            className="flex justify-end"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
            animate={{
              opacity: introPhase === 'blueprint' ? 0 : 1,
              y: introPhase === 'blueprint' ? 6 : 0,
            }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div style={{ opacity: chevronOpacity }}>
              <button
                type="button"
                onClick={() => scrollToStage(2)}
                disabled={isMosaicReady}
                aria-label="Scroll down to explore brand disciplines"
                className={`relative w-10 h-10 flex items-center justify-center rounded-md transition-transform duration-200 hover:translate-y-0.5 focus-visible:outline-2 focus-visible:outline-[#0061FF] ${
                  isMosaicReady
                    ? 'pointer-events-none'
                    : 'pointer-events-auto cursor-pointer'
                }`}
              >
                <motion.span
                  className="absolute inset-0 flex items-center justify-center text-[#0061FF]"
                  style={{ opacity: chevronBlueOpacity }}
                >
                  <ChevronsDown className="w-6 h-6" strokeWidth={1.75} />
                </motion.span>
                <motion.span
                  className="absolute inset-0 flex items-center justify-center text-white"
                  style={{ opacity: chevronWhiteOpacity }}
                >
                  <ChevronsDown className="w-6 h-6" strokeWidth={1.75} />
                </motion.span>
              </button>
            </motion.div>
          </motion.div>
        </div>

        {/* Layer 5: Morphing FacetMark (Bottom-Left Hero -> Centered Cobalt Square) */}
        <motion.div
          className="absolute top-0 left-0 z-30 pointer-events-none origin-center"
          style={{
            x: markX,
            y: markY,
            scale: markScale,
          }}
        >
          <motion.div
            className="relative w-[28px] h-[24px]"
            initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.85 }}
            animate={{
              opacity: introPhase === 'blueprint' ? 0 : 1,
              scale: introPhase === 'blueprint' ? 0.85 : 1,
            }}
            transition={{ duration: 0.45, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              className="absolute inset-0"
              style={{ opacity: markBlueOpacity }}
            >
              <FacetMark color="#0061FF" size={28} />
            </motion.div>
            <motion.div
              className="absolute inset-0"
              style={{ opacity: markWhiteOpacity }}
            >
              <FacetMark color="#FFFFFF" size={28} />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Minimal 3-Stage Architectural Scroll Rail (Right Edge, visible before Mosaic locks) */}
        {!isMosaicReady && (
          <nav
            aria-label="Scroll section markers"
            className="hidden md:flex fixed right-5 top-1/2 -translate-y-1/2 z-40 flex-col items-end gap-3"
          >
            {(
              [
                { stage: 0, label: 'Overview' },
                { stage: 1, label: 'Identity' },
                { stage: 2, label: 'Disciplines' },
              ] as const
            ).map(({ stage, label }) => {
              const active = activeStageIndex === stage;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => scrollToStage(stage)}
                  className="group flex items-center gap-2.5 py-1 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#0061FF]"
                  aria-label={`Jump to ${label}`}
                >
                  <span
                    className={`text-[11px] font-mono tracking-tight transition-opacity duration-200 ${
                      active
                        ? 'opacity-90 text-[#0061FF] font-medium'
                        : 'opacity-0 group-hover:opacity-75 text-neutral-600'
                    }`}
                  >
                    {label}
                  </span>
                  <span
                    className={`h-[2px] transition-all duration-300 ${
                      active
                        ? 'w-6 bg-[#0061FF]'
                        : 'w-3 bg-neutral-300 group-hover:w-5 group-hover:bg-neutral-500'
                    }`}
                  />
                </button>
              );
            })}
          </nav>
        )}

        {/* Quiet Floating Action Dock once Mosaic is Active */}
        <motion.div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2"
          style={{
            opacity: mosaicDockOpacity,
            pointerEvents: isMosaicReady ? 'auto' : 'none',
          }}
        >
          <button
            type="button"
            onClick={() => scrollToStage(0)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-white/95 text-neutral-900 text-xs font-medium shadow-md border border-black/10 hover:bg-white transition-colors cursor-pointer whitespace-nowrap"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            Overview
          </button>
          <button
            type="button"
            onClick={() => onSelectDiscipline('framework')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-[#161618] text-white text-xs font-medium shadow-md border border-white/10 hover:bg-neutral-800 transition-colors cursor-pointer whitespace-nowrap"
          >
            <BookOpen className="w-3.5 h-3.5" />
            Browse Handbook
          </button>
        </motion.div>
      </div>
    </div>
  );
}
