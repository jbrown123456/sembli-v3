import { createTheme } from '@shopify/restyle'
import { colors, spacing, borderRadii, fontFamilies } from './tokens'

const theme = createTheme({
  colors,
  spacing,
  borderRadii,
  textVariants: {
    defaults: {
      fontFamily: fontFamilies.sans,
      color: 'ink',
      fontSize: 14,
    },
    display: {
      fontFamily: fontFamilies.display,
      color: 'ink',
      fontSize: 42,
      letterSpacing: -1.4,
      lineHeight: 46,
    },
    displayItalic: {
      fontFamily: fontFamilies.displayItalic,
      color: 'brandDeep',
      fontSize: 42,
      letterSpacing: -1.4,
      lineHeight: 46,
    },
    displayMd: {
      fontFamily: fontFamilies.display,
      color: 'ink',
      fontSize: 32,
      letterSpacing: -1,
      lineHeight: 36,
    },
    displaySm: {
      fontFamily: fontFamilies.display,
      color: 'ink',
      fontSize: 24,
      letterSpacing: -0.6,
      lineHeight: 28,
    },
    heading: {
      fontFamily: fontFamilies.sansSemiBold,
      color: 'ink',
      fontSize: 15,
    },
    body: {
      fontFamily: fontFamilies.sans,
      color: 'ink',
      fontSize: 14,
      lineHeight: 21,
    },
    bodySmall: {
      fontFamily: fontFamilies.sans,
      color: 'inkSoft',
      fontSize: 12,
      lineHeight: 17,
    },
    mono: {
      fontFamily: fontFamilies.mono,
      color: 'muted',
      fontSize: 10,
      letterSpacing: 0.6,
      // textTransform handled per-component
    },
    monoSmall: {
      fontFamily: fontFamilies.mono,
      color: 'muted',
      fontSize: 9,
      letterSpacing: 0.5,
    },
    label: {
      fontFamily: fontFamilies.sansSemiBold,
      color: 'ink',
      fontSize: 10,
    },
    badge: {
      fontFamily: fontFamilies.sansMedium,
      fontSize: 11,
    },
    chatBody: {
      fontFamily: fontFamilies.sans,
      color: 'ink',
      fontSize: 14,
      lineHeight: 21.7,
    },
    highlight: {
      fontFamily: fontFamilies.displayItalic,
      color: 'ink',
      fontSize: 15,
      lineHeight: 21,
    },
  },
  breakpoints: {},
})

export type Theme = typeof theme
export default theme
