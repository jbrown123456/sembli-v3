import Svg, { Path, Rect } from 'react-native-svg'

type Props = { color: string }

export function HomeIcon({ color }: Props) {
  const isActive = color !== '#8B8476'
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"
        stroke={color}
        strokeWidth={1.8}
        fill={isActive ? '#F6EDB8' : 'none'}
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export function ChatIcon({ color }: Props) {
  const isActive = color !== '#8B8476'
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path
        d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
        stroke={color}
        strokeWidth={1.8}
        fill={isActive ? '#F6EDB8' : 'none'}
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export function GridIcon({ color }: Props) {
  const isActive = color !== '#8B8476'
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Rect x={3} y={3} width={7} height={7} rx={1.5} stroke={color} strokeWidth={1.8} fill={isActive ? '#F6EDB8' : 'none'} />
      <Rect x={14} y={3} width={7} height={7} rx={1.5} stroke={color} strokeWidth={1.8} fill={isActive ? '#F6EDB8' : 'none'} />
      <Rect x={3} y={14} width={7} height={7} rx={1.5} stroke={color} strokeWidth={1.8} fill={isActive ? '#F6EDB8' : 'none'} />
      <Rect x={14} y={14} width={7} height={7} rx={1.5} stroke={color} strokeWidth={1.8} fill={isActive ? '#F6EDB8' : 'none'} />
    </Svg>
  )
}

export function CalendarIcon({ color }: Props) {
  const isActive = color !== '#8B8476'
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Rect x={3} y={4} width={18} height={17} rx={2} stroke={color} strokeWidth={1.8} fill={isActive ? '#F6EDB8' : 'none'} />
      <Path d="M16 2v4M8 2v4M3 10h18" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  )
}
