import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Svg, { Path, Rect } from 'react-native-svg'
import { colors } from '../../theme/tokens'
import { useNavigation } from '@react-navigation/native'

function SembliLogo({ size = 28, color = colors.ink }: { size?: number; color?: string }) {
  const s = size / 28
  return (
    <Svg width={size} height={size} viewBox="0 0 76 76">
      <Rect x={10} y={62} width={56} height={6} rx={3} fill={color} />
      <Path
        d="M16 62 L16 38 A22 22 0 0 1 60 38 L60 62"
        fill="none"
        stroke={color}
        strokeWidth={6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

function AvatarCircle({ initial }: { initial: string }) {
  return (
    <View style={styles.avatarCircle}>
      <Text style={styles.avatarInitial}>{initial}</Text>
    </View>
  )
}

function TaskRow({ label, due, done }: { label: string; due: string; done?: boolean }) {
  return (
    <View style={[styles.taskRow, done && { opacity: 0.45 }]}>
      <View style={[styles.checkbox, done && styles.checkboxDone]}>
        {done && <Text style={styles.checkmark}>✓</Text>}
      </View>
      <Text style={[styles.taskLabel, done && { textDecorationLine: 'line-through' }]}>{label}</Text>
      <Text style={styles.taskDue}>{due}</Text>
    </View>
  )
}

export default function DashboardScreen() {
  const insets = useSafeAreaInsets()
  const navigation = useNavigation<any>()

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <SembliLogo />
          <AvatarCircle initial="J" />
        </View>

        {/* Greeting */}
        <View style={styles.greeting}>
          <Text style={styles.dateLabel}>SATURDAY · APR 19</Text>
          <Text style={styles.greetingLine}>Good morning,</Text>
          <Text style={styles.greetingName}>Jen.</Text>
        </View>

        {/* Needs your eye */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderLabel}>NEEDS YOUR EYE</Text>
            <Text style={styles.cardHeaderMeta}>2 items</Text>
          </View>
          <TouchableOpacity
            style={styles.alertRow}
            onPress={() => navigation.navigate('Assets', { screen: 'AssetDetail', params: { assetId: 'carrier-ac' } })}
            activeOpacity={0.7}
          >
            <View style={[styles.dot, { backgroundColor: colors.danger }]} />
            <View style={styles.alertText}>
              <Text style={styles.alertTitle}>Carrier AC</Text>
              <Text style={styles.alertSub}>19 yrs old — plan for replacement</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: colors.dangerSoft }]}>
              <Text style={[styles.badgeText, { color: colors.danger }]}>HVAC</Text>
            </View>
          </TouchableOpacity>
          <View style={[styles.alertRow, styles.alertRowBorder]}>
            <View style={[styles.dot, { backgroundColor: colors.brandDeep }]} />
            <View style={styles.alertText}>
              <Text style={styles.alertTitle}>HVAC filter</Text>
              <Text style={styles.alertSub}>Due for replacement · last changed Oct</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: colors.brandSoft }]}>
              <Text style={[styles.badgeText, { color: colors.brandDeep }]}>Maint.</Text>
            </View>
          </View>
        </View>

        {/* Ask Sembli CTA */}
        <TouchableOpacity
          style={styles.askCta}
          onPress={() => navigation.navigate('Ask')}
          activeOpacity={0.85}
        >
          <SembliLogo size={22} color={colors.bg} />
          <View style={styles.askCtaText}>
            <Text style={styles.askCtaTitle}>Ask Sembli</Text>
            <Text style={styles.askCtaSub}>"Should I replace the AC before summer?"</Text>
          </View>
          <Text style={styles.askCtaChevron}>›</Text>
        </TouchableOpacity>

        {/* This month */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderLabel}>THIS MONTH</Text>
          </View>
          <TaskRow label="Schedule spring HVAC tune-up" due="Before May" />
          <View style={styles.taskDivider} />
          <TaskRow label="Test smoke detectors" due="Apr 26" done />
          <View style={styles.taskDivider} />
          <TaskRow label="Check attic insulation" due="Apr 30" />
        </View>

        {/* Home at a glance */}
        <View style={styles.glanceCard}>
          <Text style={styles.glanceLabel}>MOM'S HOUSE</Text>
          <Text style={styles.glanceAddress}>412 Oak St · Des Moines</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statTile}>
              <Text style={styles.statVal}>11</Text>
              <Text style={styles.statLabel}>assets</Text>
            </View>
            <View style={styles.statTile}>
              <Text style={styles.statVal}>3</Text>
              <Text style={styles.statLabel}>watch-outs</Text>
            </View>
            <TouchableOpacity
              style={styles.statTile}
              onPress={() => navigation.navigate('Outlook', { screen: 'Timeline' })}
              activeOpacity={0.7}
            >
              <Text style={styles.statVal}>'27</Text>
              <Text style={styles.statLabel}>next big cost</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 18, paddingBottom: 24 },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, marginTop: 8 },

  avatarCircle: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' },
  avatarInitial: { fontFamily: 'Fraunces_400Regular_Italic', fontSize: 16, color: colors.bg },

  greeting: { marginBottom: 18 },
  dateLabel: { fontFamily: 'JetBrainsMono_400Regular', fontSize: 10, color: colors.muted, letterSpacing: 0.6, marginBottom: 4 },
  greetingLine: { fontFamily: 'Fraunces_400Regular', fontSize: 42, letterSpacing: -1.4, lineHeight: 46, color: colors.ink },
  greetingName: { fontFamily: 'Fraunces_400Regular_Italic', fontSize: 42, letterSpacing: -1.4, lineHeight: 46, color: colors.brandDeep },

  card: { backgroundColor: colors.surface, borderRadius: 18, borderWidth: 1, borderColor: colors.border, marginBottom: 14, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 3, shadowOffset: { width: 0, height: 1 } },
  cardHeader: { paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.borderSoft, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardHeaderLabel: { fontFamily: 'JetBrainsMono_400Regular', fontSize: 10, color: colors.ink, letterSpacing: 0.6 },
  cardHeaderMeta: { fontFamily: 'Inter_400Regular', fontSize: 11, color: colors.muted },

  alertRow: { paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', gap: 12 },
  alertRowBorder: { borderTopWidth: 1, borderTopColor: colors.borderSoft },
  dot: { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },
  alertText: { flex: 1 },
  alertTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: colors.ink },
  alertSub: { fontFamily: 'Inter_400Regular', fontSize: 12, color: colors.muted, marginTop: 1 },
  badge: { borderRadius: 999, paddingHorizontal: 9, paddingVertical: 3 },
  badgeText: { fontFamily: 'Inter_500Medium', fontSize: 11 },

  askCta: { backgroundColor: colors.ink, borderRadius: 16, padding: 14, marginBottom: 14, flexDirection: 'row', alignItems: 'center', gap: 12 },
  askCtaText: { flex: 1 },
  askCtaTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: colors.bg },
  askCtaSub: { fontFamily: 'Inter_400Regular', fontSize: 11.5, color: 'rgba(251,248,241,0.5)', marginTop: 1 },
  askCtaChevron: { color: 'rgba(255,255,255,0.4)', fontSize: 18 },

  taskRow: { paddingHorizontal: 16, paddingVertical: 11, flexDirection: 'row', alignItems: 'center', gap: 12 },
  taskDivider: { height: 1, backgroundColor: colors.borderSoft, marginLeft: 46 },
  checkbox: { width: 18, height: 18, borderRadius: 5, borderWidth: 1.5, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  checkboxDone: { backgroundColor: colors.successSoft, borderColor: colors.success },
  checkmark: { color: colors.success, fontSize: 11, fontFamily: 'Inter_700Bold' },
  taskLabel: { flex: 1, fontFamily: 'Inter_500Medium', fontSize: 13.5, color: colors.ink },
  taskDue: { fontFamily: 'JetBrainsMono_400Regular', fontSize: 10, color: colors.muted, letterSpacing: 0.4 },

  glanceCard: { backgroundColor: colors.surfaceAlt, borderRadius: 18, padding: 14, marginBottom: 16 },
  glanceLabel: { fontFamily: 'JetBrainsMono_400Regular', fontSize: 10, color: colors.muted, letterSpacing: 0.6 },
  glanceAddress: { fontFamily: 'Fraunces_400Regular', fontSize: 18, letterSpacing: -0.5, color: colors.ink, marginTop: 4, marginBottom: 12 },
  statsGrid: { flexDirection: 'row', gap: 10 },
  statTile: { flex: 1, backgroundColor: colors.surface, borderRadius: 12, borderWidth: 1, borderColor: colors.border, padding: 10 },
  statVal: { fontFamily: 'Fraunces_400Regular', fontSize: 22, letterSpacing: -0.6, color: colors.ink },
  statLabel: { fontFamily: 'Inter_400Regular', fontSize: 11, color: colors.muted, marginTop: 1 },
})
