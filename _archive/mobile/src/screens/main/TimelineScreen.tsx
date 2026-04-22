import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { colors } from '../../theme/tokens'
import { useNavigation } from '@react-navigation/native'

type OutlookItem = {
  title: string
  category: string
  categoryColor: string
  categoryBg: string
  cost: string
}

type YearGroup = {
  year: string
  urgent?: boolean
  items: OutlookItem[]
}

const OUTLOOK: YearGroup[] = [
  {
    year: '2026',
    urgent: true,
    items: [{ title: 'Carrier AC', category: 'HVAC', categoryColor: colors.danger, categoryBg: colors.dangerSoft, cost: '$8,500' }],
  },
  {
    year: '2027',
    items: [{ title: 'Rheem water heater', category: 'Plumbing', categoryColor: colors.brandDeep, categoryBg: colors.brandSoft, cost: '$1,800' }],
  },
  { year: '2029', items: [] },
  {
    year: '2031',
    items: [
      { title: 'Roof (asphalt)', category: 'Exterior', categoryColor: colors.accent, categoryBg: colors.accentSoft, cost: '$14,000' },
      { title: 'Electrical panel', category: 'Electrical', categoryColor: colors.brandDeep, categoryBg: colors.brandSoft, cost: '$3,500' },
    ],
  },
]

export default function TimelineScreen() {
  const insets = useSafeAreaInsets()
  const navigation = useNavigation<any>()

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.topSection}>
        <Text style={styles.topMono}>MOM'S HOUSE · DES MOINES</Text>
        <Text style={styles.heading}>10-Year <Text style={styles.headingItalic}>Outlook</Text></Text>
        <View style={styles.statsRow}>
          <View style={[styles.statTile, { flex: 1 }]}>
            <Text style={styles.statVal}>$27.8K</Text>
            <Text style={styles.statLabel}>est. 10-yr</Text>
          </View>
          <View style={[styles.statTile, { flex: 1 }]}>
            <Text style={styles.statVal}>4</Text>
            <Text style={styles.statLabel}>replacements</Text>
          </View>
          <View style={[styles.statTile, { flex: 1 }]}>
            <Text style={styles.statVal}>'26</Text>
            <Text style={styles.statLabel}>first due</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {OUTLOOK.map((group, i) => (
          <View key={i} style={styles.yearGroup}>
            <View style={styles.yearLabel}>
              <Text style={[styles.yearNum, group.urgent && { color: colors.danger }]}>{group.year}</Text>
              {group.urgent && <Text style={styles.urgentLabel}>ACT NOW</Text>}
            </View>
            <View style={[styles.yearItems, { borderLeftColor: group.urgent ? 'rgba(180,67,43,0.3)' : colors.border }]}>
              {group.items.length === 0 ? (
                <Text style={styles.emptyYear}>Nothing forecasted</Text>
              ) : (
                group.items.map((item, j) => (
                  <TouchableOpacity
                    key={j}
                    style={[styles.timelineItem, group.urgent && styles.timelineItemHot]}
                    onPress={() => navigation.navigate('Assets', { screen: 'AssetDetail', params: { assetId: item.title } })}
                    activeOpacity={0.8}
                  >
                    <View style={styles.timelineItemInfo}>
                      <Text style={styles.timelineItemTitle}>{item.title}</Text>
                      <View style={[styles.badge, { backgroundColor: item.categoryBg, marginTop: 4 }]}>
                        <Text style={[styles.badgeText, { color: item.categoryColor }]}>{item.category}</Text>
                      </View>
                    </View>
                    <Text style={styles.timelineCost}>{item.cost}</Text>
                  </TouchableOpacity>
                ))
              )}
            </View>
          </View>
        ))}

        {/* Footer note */}
        <View style={styles.footerNote}>
          <Text style={styles.footerHeart}>♥</Text>
          <Text style={styles.footerText}>Estimates are based on typical Des Moines averages + your actual service history. Confirm AC install date for higher confidence.</Text>
        </View>

        {/* Invite */}
        <TouchableOpacity
          style={styles.inviteBtn}
          onPress={() => navigation.navigate('Invite')}
          activeOpacity={0.8}
        >
          <Text style={styles.inviteBtnText}>👤  Invite a sibling as collaborator</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },

  topSection: { paddingHorizontal: 18, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: colors.borderSoft },
  topMono: { fontFamily: 'JetBrainsMono_400Regular', fontSize: 10, color: colors.muted, letterSpacing: 0.6 },
  heading: { fontFamily: 'Fraunces_400Regular', fontSize: 32, letterSpacing: -1, color: colors.ink, marginTop: 4 },
  headingItalic: { fontFamily: 'Fraunces_400Regular_Italic', color: colors.brandDeep },
  statsRow: { flexDirection: 'row', gap: 10, marginTop: 14 },
  statTile: { backgroundColor: colors.surface, borderRadius: 12, borderWidth: 1, borderColor: colors.border, padding: 10 },
  statVal: { fontFamily: 'Fraunces_400Regular', fontSize: 22, letterSpacing: -0.6, color: colors.ink },
  statLabel: { fontFamily: 'Inter_400Regular', fontSize: 11, color: colors.muted, marginTop: 1 },

  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 18, paddingVertical: 14, paddingBottom: 100 },

  yearGroup: { flexDirection: 'row', gap: 16, marginBottom: 20 },
  yearLabel: { width: 52, flexShrink: 0, paddingTop: 2 },
  yearNum: { fontFamily: 'Fraunces_400Regular', fontSize: 28, letterSpacing: -1, lineHeight: 30, color: colors.ink },
  urgentLabel: { fontFamily: 'JetBrainsMono_400Regular', fontSize: 8.5, color: colors.danger, letterSpacing: 0.5, marginTop: 2 },
  yearItems: { flex: 1, paddingLeft: 14, borderLeftWidth: 1 },
  emptyYear: { fontFamily: 'Inter_400Regular', fontSize: 13, color: colors.muted, paddingVertical: 6 },

  timelineItem: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 10, marginBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 10 },
  timelineItemHot: { backgroundColor: colors.dangerSoft, borderColor: 'rgba(180,67,43,0.2)' },
  timelineItemInfo: { flex: 1 },
  timelineItemTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 13.5, color: colors.ink },
  badge: { borderRadius: 999, paddingHorizontal: 9, paddingVertical: 3, alignSelf: 'flex-start' },
  badgeText: { fontFamily: 'Inter_500Medium', fontSize: 11 },
  timelineCost: { fontFamily: 'JetBrainsMono_500Medium', fontSize: 12, color: colors.inkSoft },

  footerNote: { padding: 12, backgroundColor: colors.accentSoft, borderRadius: 12, flexDirection: 'row', gap: 10, marginBottom: 14 },
  footerHeart: { fontSize: 14 },
  footerText: { flex: 1, fontFamily: 'Fraunces_400Regular_Italic', fontSize: 12.5, color: colors.accent, lineHeight: 18 },

  inviteBtn: { borderWidth: 1, borderColor: colors.border, borderRadius: 14, padding: 12, alignItems: 'center' },
  inviteBtnText: { fontFamily: 'Inter_400Regular', fontSize: 13.5, color: colors.inkSoft },
})
