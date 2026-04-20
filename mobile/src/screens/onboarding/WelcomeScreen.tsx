import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Svg, { Path, Rect } from 'react-native-svg'
import { colors } from '../../theme/tokens'
import type { OnboardingScreenProps } from '../../navigation/types'

type Props = OnboardingScreenProps<'Welcome'>

export default function WelcomeScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets()

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.body}>
        {/* Logo */}
        <Svg width={56} height={56} viewBox="0 0 76 76" style={styles.logo}>
          <Rect x={10} y={62} width={56} height={6} rx={3} fill={colors.ink} />
          <Path d="M16 62 L16 38 A22 22 0 0 1 60 38 L60 62" fill="none" stroke={colors.ink} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
        <Text style={styles.wordmark}>Sembli</Text>
        <Text style={styles.headline}>Your home,{'\n'}<Text style={styles.headlineItalic}>remembered.</Text></Text>
        <Text style={styles.sub}>Track what you own, what needs attention, and what's coming — for any home you care about.</Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.progressDots}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
        <TouchableOpacity style={styles.btnPrimary} onPress={() => navigation.navigate('Address')} activeOpacity={0.85}>
          <Text style={styles.btnPrimaryText}>Get started</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnGhost} onPress={() => navigation.getParent()?.navigate('Main')} activeOpacity={0.7}>
          <Text style={styles.btnGhostText}>I already have an account</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 24 },
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: -20 },
  logo: { marginBottom: 28 },
  wordmark: { fontFamily: 'JetBrainsMono_400Regular', fontSize: 10, letterSpacing: 0.8, color: colors.muted, textTransform: 'uppercase', marginBottom: 12 },
  headline: { fontFamily: 'Fraunces_400Regular', fontSize: 44, letterSpacing: -1.5, textAlign: 'center', lineHeight: 48, color: colors.ink, marginBottom: 16 },
  headlineItalic: { fontFamily: 'Fraunces_400Regular_Italic', color: colors.brandDeep },
  sub: { fontFamily: 'Inter_400Regular', fontSize: 15, lineHeight: 24, color: colors.inkSoft, textAlign: 'center', maxWidth: 280 },
  footer: { paddingBottom: 8 },
  progressDots: { flexDirection: 'row', gap: 6, justifyContent: 'center', paddingVertical: 12 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.border },
  dotActive: { width: 20, borderRadius: 3, backgroundColor: colors.ink },
  btnPrimary: { backgroundColor: colors.ink, borderRadius: 999, paddingVertical: 14, alignItems: 'center' },
  btnPrimaryText: { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: colors.bg },
  btnGhost: { paddingVertical: 10, alignItems: 'center', marginTop: 6 },
  btnGhostText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: colors.muted },
})
