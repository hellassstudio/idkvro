import { motion } from 'motion/react';

interface FacetMarkProps {
  className?: string;
  variant?: 'solid' | 'wireframe';
  color?: string;
  size?: number;
  expanded?: boolean;
}

/**
 * Facet Geometric Diamond Mark:
 * 5 balanced isometric facets arranged in a symmetrical brand emblem.
 */
export function FacetMark({
  className = '',
  variant = 'solid',
  color = '#0061FF',
  size = 36,
  expanded = false,
}: FacetMarkProps) {
  const facets = [
    { d: 'M 32 6 L 60 23 L 32 40 L 4 23 Z', dx: -4, dy: -4 },
    { d: 'M 88 6 L 116 23 L 88 40 L 60 23 Z', dx: 4, dy: -4 },
    { d: 'M 32 40 L 60 57 L 32 74 L 4 57 Z', dx: -5, dy: 2 },
    { d: 'M 88 40 L 116 57 L 88 74 L 60 57 Z', dx: 5, dy: 2 },
    { d: 'M 60 64 L 88 81 L 60 98 L 32 81 Z', dx: 0, dy: 6 },
  ];

  const height = Math.round((size * 104) / 120);

  if (variant === 'wireframe') {
    return (
      <svg
        width={size}
        height={height}
        viewBox="0 0 120 104"
        fill="none"
        className={`overflow-visible ${className}`}
        aria-hidden="true"
      >
        {facets.map((f, idx) => (
          <motion.path
            key={idx}
            d={f.d}
            fill={color}
            stroke={color}
            strokeWidth={1.5}
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0, fillOpacity: 0 }}
            animate={{
              pathLength: 1,
              opacity: 1,
              fillOpacity: [0, 0.08, 0.22],
            }}
            transition={{
              pathLength: {
                duration: 0.55,
                delay: 0.1 + idx * 0.07,
                ease: [0.16, 1, 0.3, 1],
              },
              opacity: { duration: 0.3, delay: 0.1 + idx * 0.07 },
              fillOpacity: { duration: 0.7, delay: 0.3 + idx * 0.07 },
            }}
          />
        ))}
      </svg>
    );
  }

  return (
    <svg
      width={size}
      height={height}
      viewBox="0 0 120 104"
      fill="none"
      className={`overflow-visible ${className}`}
      aria-label="Facet Brand Mark"
    >
      {facets.map((f, idx) => (
        <path
          key={idx}
          d={f.d}
          fill={color}
          className="transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            transform: expanded
              ? `translate(${f.dx}px, ${f.dy}px)`
              : 'translate(0px, 0px)',
          }}
        />
      ))}
    </svg>
  );
}
