import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Svg, { Path, Rect } from 'react-native-svg'
import { colors } from '../../theme/tokens'
import { useNavigation } from '@react-navigation/native'

function SembliLogo() {
  return (
    <Svg width={28} height={28} viewBox="0 0 76 76">
      <Rect x={10} y={62} width={56} height={6} rx={3} fill={colors.ink} />
      <Path d="M16 62 L16 38 A22 22 0 0 1 60 38 L60 62" fill="none" stroke={colors.ink} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}

const FEATURES = [
  '11 tracked systems & appliances',
  '10-year cost outlook',
  'Full service history',
  'AI chat with Sembli',
]

export default function InviteScreen() {
  const insets = useSafeAreaInsets()
  const navigation = useNavigation<any>()

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <SembliLogo />
        <View style={styles.invitedBadge}>
          <Text style={styles.invitedBadgeText}>INVITED COLLABORATOR</Text>
        </View>
      </View>

      {/* Center content */}
      <View style={styles.center}>
        <View style={styles.inviteCard}>
          {/* Sender row */}
          <View style={styles.senderRow}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarInitial}>J</Text>
            </View>
            <View>
              <Text style={styles.senderName}>Jen invited you</Text>
              <Text style={styles.senderSub}>to Mom's house</Text>
            </View>
          </View>

          <Text style={styles.addressLine}>412 Oak St,{'\n'}<Text style={styles.addressItalic}>Des Moines.</Text></Text>
          <Text style={styles.description}>Jen has set up mom's home with 11 tracked items and a 10-year outlook. You're now a collaborator.</Text>

          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={() => navigation.getParent()?.getParent()?.navigate('Main')}
            activeOpacity={0.85}
          >
            <Text style={styles.btnPrimaryText}>Open Mom's home →</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnGhost}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Text style={styles.btnGhostText}>Not now</Text>
          </TouchableOpacity>
        </View>

        {/* Feature list */}
        <View style={styles.featureList}>
          <Text style={styles.featureHeader}>YOU'LL HAVE ACCESS TO</Text>
          {FEATURES.map((f, i) => (
            <View key={i} style={[styles.featureRow, i < FEATURES.length - 1 && styles.featureRowBorder]}>
              <Text style={styles.featureDiamond}>◈</Text>
              <Text style={styles.featureText}>{f}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },

  topBar: { paddingHorizontal: 18, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  invitedBadge: { backgroundColor: colors.brandSoft, borderWidth: 1, borderColor: 'rgba(184,154,46,0.2)', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 5 },
  invitedBadgeText: { fontFamily: 'JetBrainsMono_400Regular', fontSize: 10.5, color: colors.brandDeep, letterSpacing: 0.4 },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28, marginTop: -20 },

  inviteCard: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 20, padding: 28, width: '100%', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } },

  senderRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 18 },
  avatarCircle: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' },
  avatarInitial: { fontFamily: 'Fraunces_400Regular_Italic', fontSize: 20, color: colors.bg },
  senderName: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: colors.ink },
  senderSub: { fontFamily: 'Inter_400Regular', fontSize: 11.5, color: colors.muted },

  addressLine: { fontFamily: 'Fraunces_400Regular', fontSize: 28, letterSpacing: -0.8, lineHeight: 32, color: colors.ink, marginBottom: 12 },
  addressItalic: { fontFamily: 'Fraunces_400Regular_Italic', color: colors.brandDeep },
  description: { fontFamily: 'Inter_400Regular', fontSize: 13.5, color: colors.inkSoft, lineHeight: 21, marginBottom: 20 },

  btnPrimary: { backgroundColor: colors.ink, borderRadius: 999, paddingVertical: 14, alignItems: 'center', marginBottom: 6 },
  btnPrimaryText: { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: colors.bg },
  btnGhost: { paddingVertical: 10, alignItems: 'center' },
  btnGhostText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: colors.muted },

  featureList: { marginTop: 20, width: '100%' },
  featureHeader: { fontFamily: 'JetBrainsMono_400Regular', fontSize: 10, color: colors.muted, letterSpacing: 0.6, textAlign: 'center', marginBottom: 10 },
  featureRow: { flexDirection: 'row', gap: 10, alignItems: 'center', paddingVertical: 9 },
  featureRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.borderSoft },
  featureDiamond: { color: colors.muted, fontSize: 15 },
  featureText: { fontFamily: 'Inter_400Regular', fontSize: 13.5, color: colors.inkSoft },
})
