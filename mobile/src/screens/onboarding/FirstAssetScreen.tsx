import { useRef, useState } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Svg, { Path, Rect } from 'react-native-svg'
import type { OnboardingScreenProps } from '../../navigation/types'
import { colors } from '../../theme/tokens'

type Props = OnboardingScreenProps<'FirstAsset'>

const ASSET_OPTIONS = ['HVAC / AC', 'Water heater', 'Roof', 'Appliances']

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

export default function FirstAssetScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets()
  const scrollRef = useRef<ScrollView>(null)
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null)
  const [input, setInput] = useState('')

  function selectAsset(asset: string) {
    setSelectedAsset(asset)
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100)
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={styles.header}>
        <SembliAvatar />
        <View>
          <Text style={styles.headerTitle}>Sembli</Text>
          <Text style={styles.headerSub}>Let's add your first item</Text>
        </View>
        <View style={styles.progressDots}>
          <View style={styles.dot} /><View style={styles.dot} /><View style={[styles.dot, styles.dotActive]} />
        </View>
      </View>

      <ScrollView ref={scrollRef} style={styles.chat} contentContainerStyle={styles.chatContent} showsVerticalScrollIndicator={false}>
        {/* Bot prompt */}
        <View style={styles.botRow}>
          <SembliAvatar />
          <View style={styles.botBubble}>
            <Text style={styles.botText}>Tell me about a major system in the home — your HVAC, water heater, roof, or appliances. What do you have?</Text>
          </View>
        </View>

        {/* Asset chips */}
        {!selectedAsset && (
          <View style={styles.chipsRow}>
            {ASSET_OPTIONS.map(opt => (
              <TouchableOpacity key={opt} style={styles.chip} onPress={() => selectAsset(opt)} activeOpacity={0.7}>
                <Text style={styles.chipText}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* After selection */}
        {selectedAsset && (
          <>
            <View style={styles.userBubbleWrap}>
              <View style={styles.userBubble}>
                <Text style={styles.userBubbleText}>{selectedAsset}</Text>
              </View>
            </View>
            <View style={styles.botRow}>
              <SembliAvatar />
              <View style={styles.botBubble}>
                <Text style={styles.botText}>Do you know the brand and approximate install year? Even a rough guess helps me flag when replacements are due.</Text>
                <View style={styles.highlight}>
                  <Text style={styles.highlightText}>e.g. "Carrier, 2006" or "not sure, maybe 10 yrs old"</Text>
                </View>
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {/* Composer + CTA */}
      <View style={[styles.composerWrap, { paddingBottom: insets.bottom + 8 }]}>
        <View style={styles.composerInner}>
          <TextInput
            style={styles.composerInput}
            placeholder="Brand, year, or 'not sure'…"
            placeholderTextColor={colors.muted}
            value={input}
            onChangeText={setInput}
            returnKeyType="send"
          />
          <TouchableOpacity style={styles.sendBtn} activeOpacity={0.7}>
            <Text style={styles.sendBtnText}>↑</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.btnPrimary}
          onPress={() => navigation.getParent()?.navigate('Main')}
          activeOpacity={0.85}
        >
          <Text style={styles.btnPrimaryText}>Take me to my dashboard →</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.borderSoft, flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: { width: 26, height: 26, borderRadius: 13, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  headerTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: colors.ink },
  headerSub: { fontFamily: 'Inter_400Regular', fontSize: 11, color: colors.muted },
  progressDots: { flexDirection: 'row', gap: 6, marginLeft: 'auto' },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.border },
  dotActive: { width: 20, borderRadius: 3, backgroundColor: colors.ink },

  chat: { flex: 1 },
  chatContent: { padding: 14, gap: 12 },

  botRow: { flexDirection: 'row', gap: 8, maxWidth: '90%' },
  botBubble: { flex: 1, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 18, borderTopLeftRadius: 4, padding: 11, paddingHorizontal: 14 },
  botText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: colors.ink, lineHeight: 21 },
  highlight: { marginTop: 9, padding: 10, backgroundColor: colors.brandSoft, borderRadius: 10 },
  highlightText: { fontFamily: 'Fraunces_400Regular_Italic', fontSize: 15, color: colors.ink, lineHeight: 21 },

  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, paddingLeft: 34 },
  chip: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 999, paddingHorizontal: 11, paddingVertical: 7 },
  chipText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: colors.ink },

  userBubbleWrap: { alignSelf: 'flex-end', maxWidth: '82%' },
  userBubble: { backgroundColor: colors.ink, borderRadius: 18, borderBottomRightRadius: 4, paddingHorizontal: 14, paddingVertical: 10 },
  userBubbleText: { fontFamily: 'Inter_400Regular', fontSize: 14.5, color: colors.bg },

  composerWrap: { paddingHorizontal: 12, paddingTop: 10, backgroundColor: colors.bg, borderTopWidth: 1, borderTopColor: colors.borderSoft, gap: 10 },
  composerInner: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 22, paddingHorizontal: 14, paddingVertical: 10, gap: 8 },
  composerInput: { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 14, color: colors.ink },
  sendBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' },
  sendBtnText: { color: colors.bg, fontSize: 16, fontFamily: 'Inter_600SemiBold' },
  btnPrimary: { backgroundColor: colors.ink, borderRadius: 14, paddingVertical: 12, alignItems: 'center' },
  btnPrimaryText: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: colors.bg },
})
