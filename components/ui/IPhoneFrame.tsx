import { cn } from '@/lib/utils'

type Size = 'hero' | 'showcase' | 'beat'

const sizes: Record<Size, { width: number; height: number }> = {
  hero:     { width: 248, height: 536 },
  showcase: { width: 210, height: 454 },
  beat:     { width: 162, height: 350 },
}

interface IPhoneFrameProps {
  size?: Size
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export function IPhoneFrame({ size = 'hero', children, className, style }: IPhoneFrameProps) {
  const { width, height } = sizes[size]
  const bezel = 10
  const radius = Math.round(width * 0.19)
  const innerRadius = Math.max(radius - bezel, 4)
  const dynamicIslandW = Math.round(width * 0.32)
  const dynamicIslandH = 11

  return (
    <div
      className={cn('relative flex-shrink-0', className)}
      style={{ width, height, ...style }}
    >
      {/* Outer frame */}
      <div
        className="absolute inset-0 shadow-[0_24px_64px_rgba(0,0,0,0.55)]"
        style={{
          borderRadius: radius,
          background: '#1C1A17',
          border: '1px solid rgba(255,255,255,0.12)',
        }}
      />

      {/* Screen area */}
      <div
        className="absolute overflow-hidden bg-[#0E0C0A]"
        style={{
          inset: bezel,
          borderRadius: innerRadius,
        }}
      >
        {children ?? (
          <div className="w-full h-full bg-[#1A1814]" />
        )}
      </div>

      {/* Dynamic Island */}
      <div
        className="absolute left-1/2 -translate-x-1/2 bg-black"
        style={{
          top: bezel + 8,
          width: dynamicIslandW,
          height: dynamicIslandH,
          borderRadius: dynamicIslandH / 2,
          zIndex: 10,
        }}
      />

      {/* Home indicator */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-white/30"
        style={{
          bottom: bezel + 6,
          width: Math.round(width * 0.28),
          height: 4,
          borderRadius: 2,
          zIndex: 10,
        }}
      />
    </div>
  )
}
