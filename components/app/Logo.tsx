// Threshold mark — an arched doorway. Sembli's logo.
// Inline SVG, no image assets needed. Scales cleanly from 16px favicon to hero size.

interface LogoProps {
  size?: number;
  color?: string;
  className?: string;
}

export function Logo({ size = 34, color = 'var(--almanac-ink)', className }: LogoProps) {
  const weight = size <= 24 ? 8 : 6;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 76 76"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <rect x="10" y="62" width="56" height={weight} rx={weight / 2} fill={color} />
      <path
        d="M16 62 L16 38 A22 22 0 0 1 60 38 L60 62"
        stroke={color}
        strokeWidth={weight}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
