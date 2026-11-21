import { motion } from 'motion/react';
import { DisciplineId } from '../data/brandData';
import { FacetMark } from './FacetMark';

interface TileArtworkProps {
  id: DisciplineId;
  hovered: boolean;
}

export function TileArtwork({ id, hovered }: TileArtworkProps) {
  switch (id) {
    case 'framework':
      return (
        <div className="relative w-full h-full flex items-end justify-center">
          {/* Subtle architectural grid revealed on hover */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300"
            style={{
              opacity: hovered ? 0.18 : 0,
              backgroundImage:
                'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />
          <svg
            viewBox="0 0 240 200"
            className="relative z-10 w-full h-full max-w-[230px] max-h-[190px] overflow-visible"
            fill="none"
            aria-hidden="true"
          >
            <line
              x1="44"
              y1="100"
              x2="188"
              y2="34"
              stroke="#FFFFFF"
              strokeOpacity={hovered ? 1 : 0.72}
              strokeWidth="2"
              className="transition-all duration-300"
            />
            <line
              x1="44"
              y1="100"
              x2="188"
              y2="166"
              stroke="#FFFFFF"
              strokeOpacity={hovered ? 1 : 0.72}
              strokeWidth="2"
              className="transition-all duration-300"
            />
            <line
              x1="188"
              y1="34"
              x2="188"
              y2="166"
              stroke="#7FA7FF"
              strokeOpacity={hovered ? 0.85 : 0}
              strokeWidth="1.5"
              strokeDasharray="4 4"
              className="transition-all duration-300"
            />
            {/* Outer halo rings on hover */}
            <circle
              cx="44"
              cy="100"
              r={hovered ? 20 : 10}
              stroke="#7FA7FF"
              strokeOpacity={hovered ? 0.45 : 0}
              strokeWidth="1.5"
              className="transition-all duration-300 ease-out"
            />
            <circle
              cx="44"
              cy="100"
              r={hovered ? 12 : 10}
              fill="#FFFFFF"
              className="transition-all duration-300"
            />
            <circle
              cx="188"
              cy="34"
              r={hovered ? 12 : 10}
              fill="#FFFFFF"
              className="transition-all duration-300"
            />
            <circle
              cx="188"
              cy="166"
              r={hovered ? 12 : 10}
              fill="#FFFFFF"
              className="transition-all duration-300"
            />
          </svg>
        </div>
      );

    case 'voice':
      return (
        <div className="relative w-full h-full flex items-center justify-between px-1 select-none pointer-events-none">
          <svg
            viewBox="0 0 84 68"
            className={`w-16 h-14 md:w-20 md:h-16 self-start mt-1 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              hovered ? '-translate-x-1.5 -translate-y-1.5 scale-105' : ''
            }`}
            fill="#5C4406"
            aria-hidden="true"
          >
            <path d="M18.5 34C27.6 34 34 40.2 34 49.4C34 59 26.8 66 17.5 66C7.6 66 1 58.2 1 46.8C1 27.6 12.6 10.8 30.8 2L35.4 9.6C24.2 15.8 18.8 24.4 18.5 34ZM64.5 34C73.6 34 80 40.2 80 49.4C80 59 72.8 66 63.5 66C53.6 66 47 58.2 47 46.8C47 27.6 58.6 10.8 76.8 2L81.4 9.6C70.2 15.8 64.8 24.4 64.5 34Z" />
          </svg>

          {/* Subtle editorial prompt appearing between the quotes on hover */}
          <span
            className={`hidden md:inline-block text-xs font-mono tracking-tight text-[#473303] transition-all duration-300 ${
              hovered ? 'opacity-85 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
          >
            Human, clear, direct.
          </span>

          <svg
            viewBox="0 0 84 68"
            className={`w-16 h-14 md:w-20 md:h-16 self-end mb-1 rotate-180 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              hovered ? 'translate-x-1.5 translate-y-1.5 scale-105' : ''
            }`}
            fill="#5C4406"
            aria-hidden="true"
          >
            <path d="M18.5 34C27.6 34 34 40.2 34 49.4C34 59 26.8 66 17.5 66C7.6 66 1 58.2 1 46.8C1 27.6 12.6 10.8 30.8 2L35.4 9.6C24.2 15.8 18.8 24.4 18.5 34ZM64.5 34C73.6 34 80 40.2 80 49.4C80 59 72.8 66 63.5 66C53.6 66 47 58.2 47 46.8C47 27.6 58.6 10.8 76.8 2L81.4 9.6C70.2 15.8 64.8 24.4 64.5 34Z" />
          </svg>
        </div>
      );

    case 'logo':
      return (
        <div className="relative w-full h-full flex items-end justify-end">
          {/* Subtle clearspace frame revealed on hover */}
          <div
            className={`relative p-3 border border-dashed transition-all duration-300 ${
              hovered
                ? 'border-[#0B3A54]/45 -translate-x-1 -translate-y-1'
                : 'border-transparent'
            }`}
          >
            <FacetMark color="#0B3A54" size={88} expanded={hovered} />
          </div>
        </div>
      );

    case 'typography':
      return (
        <div className="relative w-full h-full flex items-end justify-start select-none pointer-events-none">
          {/* Typographic cap-height, x-height, baseline guides on hover */}
          <div
            className={`absolute inset-x-0 bottom-0 h-28 flex flex-col justify-between transition-opacity duration-300 ${
              hovered ? 'opacity-45' : 'opacity-0'
            }`}
          >
            <div className="border-t border-dashed border-[#280B03] flex justify-end">
              <span className="text-[10px] font-mono text-[#280B03] -mt-3.5">
                cap
              </span>
            </div>
            <div className="border-t border-dashed border-[#280B03] flex justify-end">
              <span className="text-[10px] font-mono text-[#280B03] -mt-3.5">
                x-h
              </span>
            </div>
            <div className="border-t border-[#280B03] flex justify-end">
              <span className="text-[10px] font-mono text-[#280B03] -mt-3.5">
                base
              </span>
            </div>
          </div>

          <span
            className={`relative z-10 font-semibold tracking-tight leading-[0.82] text-[#280B03] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] origin-bottom-left ${
              hovered ? 'scale-[1.06] translate-x-1' : 'scale-100'
            }`}
            style={{ fontSize: 'clamp(4.5rem, 8.2vw, 7.2rem)' }}
          >
            Aa
          </span>
        </div>
      );

    case 'iconography':
      return (
        <div className="relative w-full h-full flex items-end justify-start">
          {/* 24px keyline blueprint on hover */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300"
            style={{
              opacity: hovered ? 0.16 : 0,
              backgroundImage:
                'linear-gradient(to right, #2C4507 1px, transparent 1px), linear-gradient(to bottom, #2C4507 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />
          <svg
            viewBox="0 0 112 128"
            className={`relative z-10 w-20 h-24 md:w-24 md:h-28 overflow-visible transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              hovered ? 'scale-105' : 'scale-100'
            }`}
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M32 54V36C32 22.7452 42.7452 12 56 12C69.2548 12 80 22.7452 80 36V54"
              stroke="#2C4507"
              strokeWidth="4.5"
              strokeLinecap="round"
              style={{
                transformOrigin: '80px 54px',
                transform: hovered
                  ? 'translateY(-6px) rotate(6deg)'
                  : 'translateY(0px) rotate(0deg)',
              }}
              className="transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
            />
            <rect
              x="16"
              y="54"
              width="80"
              height="62"
              rx="4"
              fill={hovered ? '#2C4507' : 'transparent'}
              stroke="#2C4507"
              strokeWidth="4.5"
              className="transition-colors duration-300"
            />
            <circle
              cx="56"
              cy="80"
              r="7"
              fill={hovered ? '#B4DC19' : '#2C4507'}
              className="transition-colors duration-300"
            />
            <path
              d="M56 86V98"
              stroke={hovered ? '#B4DC19' : '#2C4507'}
              strokeWidth="4.5"
              strokeLinecap="round"
              className="transition-colors duration-300"
            />
          </svg>
        </div>
      );

    case 'color':
      return (
        <div className="w-full h-full flex items-end justify-center pb-1">
          <div className="relative w-[176px] h-[142px] md:w-[210px] md:h-[164px]">
            <div
              className={`absolute left-0 bottom-0 w-[96px] h-[96px] md:w-[114px] md:h-[114px] bg-[#9F4500] flex flex-col items-center justify-center transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                hovered ? '-translate-y-2 -translate-x-2' : ''
              }`}
            >
              <div className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-[#3A1900] transition-transform duration-300" />
              <span
                className={`mt-1.5 text-[10px] font-mono tabular-nums text-white/85 transition-opacity duration-200 ${
                  hovered ? 'opacity-100' : 'opacity-0'
                }`}
              >
                #9F4500
              </span>
            </div>
            <div
              className={`absolute right-0 top-0 w-[96px] h-[96px] md:w-[114px] md:h-[114px] bg-[#D06204] flex flex-col items-center justify-center transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                hovered ? 'translate-y-2 translate-x-2' : ''
              }`}
            >
              <div className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-[#5B2700] transition-transform duration-300" />
              <span
                className={`mt-1.5 text-[10px] font-mono tabular-nums text-white/90 transition-opacity duration-200 ${
                  hovered ? 'opacity-100' : 'opacity-0'
                }`}
              >
                #D06204
              </span>
            </div>
          </div>
        </div>
      );

    case 'imagery':
      return (
        <div className="w-full h-full flex items-end justify-end">
          <svg
            viewBox="0 0 260 156"
            className="w-[82%] max-w-[260px] h-auto"
            fill="none"
            aria-hidden="true"
          >
            <rect
              x="2"
              y="2"
              width="256"
              height="152"
              stroke={hovered ? '#E5A4C0' : '#E4E4E7'}
              strokeWidth="2"
              fill={hovered ? '#5D1435' : 'transparent'}
              className="transition-all duration-300"
            />
            <circle
              cx="196"
              cy="46"
              r="18"
              fill={hovered ? '#E5A4C0' : 'transparent'}
              stroke={hovered ? '#E5A4C0' : '#E4E4E7'}
              strokeWidth="2"
              style={{
                transform: hovered ? 'translateY(-4px)' : 'translateY(0px)',
              }}
              className="transition-all duration-300 ease-out"
            />
            <path
              d="M2 154 L94 64 L164 132 L206 94 L258 142 L258 154 Z"
              fill={hovered ? '#B35D84' : 'transparent'}
              stroke={hovered ? '#E5A4C0' : '#E4E4E7'}
              strokeWidth="2"
              strokeLinejoin="round"
              className="transition-all duration-300"
            />
            <path
              d="M78 154 L148 92 L222 154 Z"
              fill={hovered ? '#D484A7' : 'transparent'}
              stroke={hovered ? '#E5A4C0' : '#E4E4E7'}
              strokeWidth="2"
              strokeLinejoin="round"
              className="transition-all duration-300"
            />
          </svg>
        </div>
      );

    case 'motion':
      return (
        <div className="w-full h-full flex items-end justify-center">
          <svg
            viewBox="0 0 220 200"
            className="w-full h-full max-w-[220px] max-h-[200px] overflow-visible"
            fill="none"
            aria-hidden="true"
          >
            <line
              x1="126"
              y1="26"
              x2="196"
              y2="26"
              stroke="#48247E"
              strokeWidth="2"
            />
            <line
              x1="24"
              y1="174"
              x2="94"
              y2="174"
              stroke="#48247E"
              strokeWidth="2"
            />
            <path
              d="M 24 174 C 102 174, 118 26, 196 26"
              stroke="#2C1352"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle cx="126" cy="26" r="5" fill="#2C1352" />
            <circle cx="94" cy="174" r="5" fill="#2C1352" />
            <rect x="19" y="169" width="10" height="10" fill="#2C1352" />
            <rect x="191" y="21" width="10" height="10" fill="#2C1352" />
            {/* True path-following traveler dot */}
            <motion.circle
              r="7"
              fill="#FFFFFF"
              stroke="#2C1352"
              strokeWidth="2.5"
              initial={false}
              animate={{
                opacity: hovered ? 1 : 0,
                offsetDistance: hovered ? '100%' : '0%',
              }}
              transition={{
                offsetDistance: {
                  duration: 0.75,
                  ease: [0.16, 1, 0.3, 1],
                },
                opacity: { duration: 0.15 },
              }}
              style={{
                offsetPath: 'path("M 24 174 C 102 174, 118 26, 196 26")',
              }}
            />
          </svg>
        </div>
      );
  }
}
