import { useState } from 'react'
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Svg, { Path, Rect } from 'react-native-svg'
import type { OnboardingScreenProps } from '../../navigation/types'
import { colors } from '../../theme/tokens'

type OwnerType = 'Mine' | "A parent's" | 'A rental' | 'Other'
type Props = OnboardingScreenProps<'Address'>

function SembliAvatar() {
  return (
    <View style={styles.avatar}>
      <Svg width={14} height={14} viewBox="0 0 76 76">
        <Rect x={10} y={62} width={56} height={8} rx={4} fill={colors.ink} />
        <Path d="M16 62 L16 38 A22 22 0 0 1 60 38 L60 62" fill="none" stroke={colors.ink} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    </View>
  )
}

const OWNER_TYPES: OwnerType[] = ['Mine', "A parent's", 'A rental', 'Other']

export default function AddressScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets()
  const [address, setAddress] = useState('412 Oak St, Des Moines, IA 50312')
  const [owner, setOwner] = useState<OwnerType>('Mine')

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.stepLabel}>
          <Text style={styles.stepMono}>STEP 1 OF 3</Text>
          <Text style={styles.heading}>Which home are{'\n'}we starting with?</Text>
        </View>

        {/* Chat-style prompt card */}
        <View style={styles.card}>
          <SembliAvatar />
          <Text style={styles.cardPrompt}>What's the address? I'll use it to pull regional cost data and climate info for maintenance timing.</Text>
        </View>

        {/* Address input */}
        <View style={styles.inputField}>
          <Text style={styles.inputLabel}>ADDRESS</Text>
          <TextInput
            style={styles.inputText}
            value={address}
            onChangeText={setAddress}
            placeholder="123 Main St, City, State ZIP"
            placeholderTextColor={colors.muted}
            autoCorrect={false}
          />
        </View>

        {/* Owner type */}
        <View style={styles.inputField}>
          <Text style={styles.inputLabel}>WHOSE HOME IS THIS?</Text>
          <View style={styles.ownerChips}>
            {OWNER_TYPES.map(type => (
              <TouchableOpacity
                key={type}
                style={[styles.chip, owner === type && styles.chipActive]}
                onPress={() => setOwner(type)}
                activeOpacity={0.7}
              >
                <Text style={[styles.chipText, owner === type && styles.chipTextActive]}>{type}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.progressDots}>
          <View style={styles.dot} />
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
        </View>
        <TouchableOpacity style={styles.btnPrimary} onPress={() => navigation.navigate('FirstAsset')} activeOpacity={0.85}>
          <Text style={styles.btnPrimaryText}>Continue →</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scroll: { flex: 1, paddingHorizontal: 24 },
  scrollContent: { paddingTop: 8 },

  stepLabel: { marginBottom: 28 },
  stepMono: { fontFamily: 'JetBrainsMono_400Regular', fontSize: 10, color: colors.muted, letterSpacing: 0.6, marginBottom: 8 },
  heading: { fontFamily: 'Fraunces_400Regular', fontSize: 34, letterSpacing: -1, lineHeight: 38, color: colors.ink },

  card: { backgroundColor: colors.surface, borderRadius: 14, borderWidth: 1, borderColor: colors.border, padding: 16, marginBottom: 12, flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  avatar: { width: 26, height: 26, borderRadius: 13, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 },
  cardPrompt: { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 14, color: colors.ink, lineHeight: 21 },

  inputField: { backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: 14, padding: 14, marginBottom: 12 },
  inputLabel: { fontFamily: 'JetBrainsMono_400Regular', fontSize: 10, color: colors.muted, letterSpacing: 0.6, marginBottom: 6 },
  inputText: { fontFamily: 'Inter_400Regular', fontSize: 15, color: colors.ink },

  ownerChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  chip: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 999, paddingHorizontal: 11, paddingVertical: 7 },
  chipActive: { backgroundColor: colors.ink, borderColor: colors.ink },
  chipText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: colors.ink },
  chipTextActive: { color: colors.bg },

  footer: { paddingHorizontal: 24, paddingBottom: 8 },
  progressDots: { flexDirection: 'row', gap: 6, justifyContent: 'center', paddingVertical: 12 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.border },
  dotActive: { width: 20, borderRadius: 3, backgroundColor: colors.ink },
  btnPrimary: { backgroundColor: colors.ink, borderRadius: 999, paddingVertical: 14, alignItems: 'center' },
  btnPrimaryText: { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: colors.bg },
})
