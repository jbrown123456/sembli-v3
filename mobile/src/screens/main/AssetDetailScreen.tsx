import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Svg, { Circle, Path } from 'react-native-svg'
import { colors } from '../../theme/tokens'
import { useNavigation } from '@react-navigation/native'

function HVACIcon() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={4} fill={colors.brandDeep} />
      <Path d="M12 2v3M12 19v3M2 12h3M19 12h3M5.64 5.64l2.12 2.12M16.24 16.24l2.12 2.12M5.64 18.36l2.12-2.12M16.24 7.76l2.12-2.12" stroke={colors.brandDeep} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  )
}

type ServiceItem = {
  date: string
  title: string
  technician: string
  company: string
  type: 'success' | 'danger'
  warning?: string
}

const SERVICE_HISTORY: ServiceItem[] = [
  { date: 'Apr 2024', title: 'Annual tune-up', technician: 'Dave', company: 'Hometown Heating', type: 'success' },
  { date: 'Aug 2023', title: 'Refrigerant top-up', technician: 'Dave', company: 'Hometown Heating', type: 'danger', warning: '⚠ Refrigerant leak indicator — watch for repeat' },
  { date: 'Oct 2022', title: 'Annual tune-up', technician: 'Dave', company: 'Hometown Heating', type: 'success' },
]

export default function AssetDetailScreen() {
  const insets = useSafeAreaInsets()
  const navigation = useNavigation()

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Top header (outside scroll) */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.7}>
          <Text style={styles.backBtnText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.topBarMono}>HVAC · ASSET</Text>
      </View>

      {/* Asset hero card (outside scroll) */}
      <View style={styles.heroPad}>
        <View style={styles.heroCard}>
          <View style={styles.heroTop}>
            <View style={styles.iconBox}>
              <HVACIcon />
            </View>
            <View style={styles.heroInfo}>
              <Text style={styles.heroCategory}>Central Air</Text>
              <Text style={styles.heroName}>Carrier Infinity</Text>
              <Text style={styles.heroSub}>24ANB648A003 · basement</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: colors.dangerSoft }]}>
              <Text style={[styles.badgeText, { color: colors.danger }]}>Aging</Text>
            </View>
          </View>

          {/* Life bar */}
          <View style={styles.lifeBarSection}>
            <View style={styles.lifeBarLabels}>
              <Text style={styles.monoLabel}>LIFE USED</Text>
              <Text style={styles.monoLabel}>YR 19 OF ~18</Text>
            </View>
            <View style={styles.lifeBarBg}>
              <View style={[styles.lifeBarFill, { width: '100%' }]} />
            </View>
          </View>

          {/* Stats row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.monoLabel}>REPLACE</Text>
              <Text style={styles.statVal}>'26–'28</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.monoLabel}>EST. COST</Text>
              <Text style={styles.statVal}>$7–10K</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.monoLabel}>CONFIDENCE</Text>
              <Text style={styles.statVal}>Medium</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Service history */}
        <Text style={styles.sectionMono}>SERVICE HISTORY</Text>
        <View style={styles.serviceTimeline}>
          <View style={styles.timelineLine} />
          {SERVICE_HISTORY.map((item, i) => (
            <View key={i} style={styles.serviceItem}>
              <View style={[styles.serviceDot, { backgroundColor: item.type === 'success' ? colors.successSoft : colors.dangerSoft, borderColor: item.type === 'success' ? colors.success : colors.danger }]}>
                <View style={[styles.serviceDotInner, { backgroundColor: item.type === 'success' ? colors.success : colors.danger }]} />
              </View>
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceTitle}>{item.title}</Text>
                <Text style={styles.serviceSub}>{item.technician} · {item.company}</Text>
                {item.warning && (
                  <View style={styles.warningChip}>
                    <Text style={styles.warningText}>{item.warning}</Text>
                  </View>
                )}
              </View>
              <Text style={styles.serviceDate}>{item.date}</Text>
            </View>
          ))}
        </View>

        {/* Ask inline CTA */}
        <TouchableOpacity
          style={styles.askCta}
          onPress={() => navigation.getParent()?.getParent()?.navigate('Main', { screen: 'Ask' })}
          activeOpacity={0.8}
        >
          <Svg width={20} height={20} viewBox="0 0 76 76">
            <Path d="M16 62 L16 38 A22 22 0 0 1 60 38 L60 62" fill="none" stroke={colors.ink} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
          <Text style={styles.askCtaText}>Ask Sembli about this AC…</Text>
          <Text style={styles.askCtaChevron}>›</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },

  topBar: { paddingHorizontal: 18, paddingBottom: 14, flexDirection: 'row', alignItems: 'center', gap: 10 },
  backBtn: { padding: 0 },
  backBtnText: { fontFamily: 'Inter_400Regular', fontSize: 22, color: colors.muted, lineHeight: 26 },
  topBarMono: { fontFamily: 'JetBrainsMono_400Regular', fontSize: 10, color: colors.muted, letterSpacing: 0.6 },

  heroPad: { paddingHorizontal: 18, paddingBottom: 14 },
  heroCard: { backgroundColor: colors.surface, borderRadius: 18, borderWidth: 1, borderColor: colors.border, padding: 18, paddingBottom: 14 },
  heroTop: { flexDirection: 'row', gap: 12, alignItems: 'flex-start', marginBottom: 14 },
  iconBox: { width: 48, height: 48, borderRadius: 12, backgroundColor: colors.brandSoft, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  heroInfo: { flex: 1 },
  heroCategory: { fontFamily: 'JetBrainsMono_400Regular', fontSize: 10, color: colors.muted, letterSpacing: 0.6 },
  heroName: { fontFamily: 'Fraunces_400Regular', fontSize: 24, letterSpacing: -0.6, lineHeight: 28, color: colors.ink, marginTop: 2 },
  heroSub: { fontFamily: 'Inter_400Regular', fontSize: 12.5, color: colors.muted, marginTop: 3 },
  badge: { borderRadius: 999, paddingHorizontal: 9, paddingVertical: 3 },
  badgeText: { fontFamily: 'Inter_500Medium', fontSize: 11 },

  lifeBarSection: { marginBottom: 12 },
  lifeBarLabels: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  monoLabel: { fontFamily: 'JetBrainsMono_400Regular', fontSize: 10, color: colors.muted, letterSpacing: 0.5 },
  lifeBarBg: { height: 7, borderRadius: 999, backgroundColor: colors.surfaceAlt, overflow: 'hidden' },
  lifeBarFill: { height: '100%', backgroundColor: colors.danger, opacity: 0.7, borderRadius: 999 },

  statsRow: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: colors.borderSoft, paddingTop: 12, gap: 8 },
  statItem: { flex: 1 },
  statVal: { fontFamily: 'Inter_600SemiBold', fontSize: 13.5, color: colors.ink, marginTop: 3 },

  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 18, paddingBottom: 100 },

  sectionMono: { fontFamily: 'JetBrainsMono_400Regular', fontSize: 10, color: colors.muted, letterSpacing: 0.6, marginBottom: 10 },
  serviceTimeline: { position: 'relative', marginBottom: 16 },
  timelineLine: { position: 'absolute', left: 7, top: 8, bottom: 8, width: 1, backgroundColor: colors.border },
  serviceItem: { flexDirection: 'row', gap: 14, marginBottom: 12 },
  serviceDot: { width: 15, height: 15, borderRadius: 7.5, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2, zIndex: 1 },
  serviceDotInner: { width: 5, height: 5, borderRadius: 2.5 },
  serviceInfo: { flex: 1 },
  serviceTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 13.5, color: colors.ink },
  serviceSub: { fontFamily: 'Inter_400Regular', fontSize: 11.5, color: colors.muted, marginTop: 1 },
  warningChip: { marginTop: 5, padding: 6, backgroundColor: colors.dangerSoft, borderRadius: 7 },
  warningText: { fontFamily: 'Inter_400Regular', fontSize: 11.5, color: colors.danger },
  serviceDate: { fontFamily: 'JetBrainsMono_400Regular', fontSize: 10, color: colors.muted, letterSpacing: 0.4 },

  askCta: { backgroundColor: colors.surfaceAlt, borderWidth: 1, borderColor: colors.border, borderRadius: 14, padding: 12, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 10 },
  askCtaText: { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 13.5, color: colors.inkSoft },
  askCtaChevron: { color: colors.muted, fontSize: 16 },
})
