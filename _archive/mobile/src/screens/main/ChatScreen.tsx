import { useRef, useState } from 'react'
import {
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Svg, { Path, Rect } from 'react-native-svg'
import { colors } from '../../theme/tokens'

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

function SembliLogoSm({ color = colors.ink }: { color?: string }) {
  return (
    <Svg width={28} height={28} viewBox="0 0 76 76">
      <Rect x={10} y={62} width={56} height={6} rx={3} fill={color} />
      <Path d="M16 62 L16 38 A22 22 0 0 1 60 38 L60 62" fill="none" stroke={color} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}

function ThinkChip() {
  const anims = [useRef(new Animated.Value(0.3)).current, useRef(new Animated.Value(0.3)).current, useRef(new Animated.Value(0.3)).current]

  const pulse = (anim: Animated.Value, delay: number) =>
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, { toValue: 1, duration: 600, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0.3, duration: 600, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    )

  useRef(null).current ?? (() => {
    pulse(anims[0], 0).start()
    pulse(anims[1], 200).start()
    pulse(anims[2], 400).start()
  })()

  return (
    <View style={styles.thinkChip}>
      <View style={styles.thinkDots}>
        {anims.map((anim, i) => (
          <Animated.View key={i} style={[styles.thinkDot, { opacity: anim }]} />
        ))}
      </View>
      <Text style={styles.thinkLabel}>checking specs · regional costs · lifespan data</Text>
    </View>
  )
}

function SourceCard({ num, title, url }: { num: string; title: string; url: string }) {
  return (
    <View style={styles.sourceCard}>
      <Text style={styles.sourceNum}>{num}</Text>
      <View>
        <Text style={styles.sourceTitle}>{title}</Text>
        <Text style={styles.sourceUrl}>{url}</Text>
      </View>
    </View>
  )
}

type Chip = { label: string }

type Message =
  | { type: 'user'; text: string }
  | { type: 'bot'; text: string; highlight?: string; sources?: { num: string; title: string; url: string }[] }
  | { type: 'chips'; items: Chip[] }
  | { type: 'thinking' }

const INITIAL_MESSAGES: Message[] = [
  { type: 'user', text: 'Should I replace the AC this year or wait? It\'s a 2006 Carrier.' },
  { type: 'thinking' },
  {
    type: 'bot',
    text: 'At 19 years old, your mom\'s Carrier is past its expected 15–18 year lifespan — but "replace now vs. wait" depends on a few things.',
    highlight: 'If it\'s still cooling well and the last tune-up was clean, one more summer is reasonable — but budget $7–10K and don\'t wait past fall 2026.',
    sources: [
      { num: '[1]', title: 'ENERGY STAR — Central AC lifespan', url: 'energystar.gov' },
      { num: '[2]', title: 'ACCA — repair vs. replace rule of thumb', url: 'acca.org' },
    ],
  },
  { type: 'chips', items: [{ label: 'Get 3 local quotes' }, { label: '+ Add to outlook' }, { label: 'What size do I need?' }] },
]

export default function ChatScreen() {
  const insets = useSafeAreaInsets()
  const scrollRef = useRef<ScrollView>(null)
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
  const [input, setInput] = useState('')

  function sendMessage(text: string) {
    if (!text.trim()) return
    setMessages(prev => [
      ...prev.filter(m => m.type !== 'chips'),
      { type: 'user', text: text.trim() },
      { type: 'thinking' },
    ])
    setInput('')
    setTimeout(() => {
      setMessages(prev => [
        ...prev.filter(m => m.type !== 'thinking'),
        { type: 'bot', text: 'I\'m looking into that for you. Check back in a moment.' },
      ])
    }, 1500)
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100)
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}
    >
      {/* Header */}
      <View style={styles.header}>
        <SembliLogoSm />
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Ask Sembli</Text>
          <Text style={styles.headerSub}>Mom's house · Des Moines</Text>
        </View>
        <TouchableOpacity style={styles.historyBtn} activeOpacity={0.7}>
          <Text style={styles.historyBtnText}>History</Text>
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollRef}
        style={styles.messageList}
        contentContainerStyle={styles.messageContent}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
      >
        <View style={styles.timestamp}>
          <Text style={styles.timestampText}>TODAY · 9:42 AM</Text>
        </View>

        {messages.map((msg, i) => {
          if (msg.type === 'user') {
            return (
              <View key={i} style={styles.userBubbleWrap}>
                <View style={styles.userBubble}>
                  <Text style={styles.userBubbleText}>{msg.text}</Text>
                </View>
              </View>
            )
          }
          if (msg.type === 'thinking') {
            return <ThinkChip key={i} />
          }
          if (msg.type === 'chips') {
            return (
              <View key={i} style={styles.chipsRow}>
                {msg.items.map((chip, j) => (
                  <TouchableOpacity key={j} style={styles.chip} onPress={() => sendMessage(chip.label)} activeOpacity={0.7}>
                    <Text style={styles.chipText}>{chip.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )
          }
          if (msg.type === 'bot') {
            return (
              <View key={i} style={styles.botRow}>
                <SembliAvatar />
                <View style={styles.botBubble}>
                  <Text style={styles.botText}>{msg.text}</Text>
                  {msg.highlight && (
                    <View style={styles.highlight}>
                      <Text style={styles.highlightText}>{msg.highlight}</Text>
                    </View>
                  )}
                  {msg.sources?.map((s, j) => <SourceCard key={j} {...s} />)}
                </View>
              </View>
            )
          }
          return null
        })}
      </ScrollView>

      {/* Composer */}
      <View style={[styles.composer, { paddingBottom: insets.bottom + 8 }]}>
        <View style={styles.composerInner}>
          <TextInput
            style={styles.composerInput}
            placeholder="Ask anything about the house…"
            placeholderTextColor={colors.muted}
            value={input}
            onChangeText={setInput}
            onSubmitEditing={() => sendMessage(input)}
            returnKeyType="send"
            multiline
          />
          <TouchableOpacity style={styles.sendBtn} onPress={() => sendMessage(input)} activeOpacity={0.7}>
            <Text style={styles.sendBtnText}>↑</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },

  header: { paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.borderSoft, flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerText: { flex: 1 },
  headerTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: colors.ink },
  headerSub: { fontFamily: 'Inter_400Regular', fontSize: 11, color: colors.muted },
  historyBtn: { borderWidth: 1, borderColor: colors.border, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  historyBtnText: { fontFamily: 'Inter_400Regular', fontSize: 11, color: colors.inkSoft },

  messageList: { flex: 1 },
  messageContent: { padding: 14, gap: 12 },

  timestamp: { alignItems: 'center', paddingVertical: 2 },
  timestampText: { fontFamily: 'JetBrainsMono_400Regular', fontSize: 10, color: colors.muted, letterSpacing: 0.6 },

  userBubbleWrap: { alignSelf: 'flex-end', maxWidth: '82%' },
  userBubble: { backgroundColor: colors.ink, borderRadius: 18, borderBottomRightRadius: 4, paddingHorizontal: 14, paddingVertical: 10 },
  userBubbleText: { fontFamily: 'Inter_400Regular', fontSize: 14.5, color: colors.bg, lineHeight: 21 },

  thinkChip: { flexDirection: 'row', alignItems: 'center', gap: 7, paddingLeft: 34 },
  thinkDots: { flexDirection: 'row', gap: 3 },
  thinkDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: colors.brandDeep },
  thinkLabel: { fontFamily: 'JetBrainsMono_400Regular', fontSize: 10, color: colors.muted, letterSpacing: 0.5 },

  botRow: { flexDirection: 'row', gap: 8, maxWidth: '90%' },
  avatar: { width: 26, height: 26, borderRadius: 13, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 },
  botBubble: { flex: 1, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 18, borderTopLeftRadius: 4, padding: 11, paddingHorizontal: 14 },
  botText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: colors.ink, lineHeight: 21.7 },
  highlight: { marginTop: 9, padding: 10, backgroundColor: colors.brandSoft, borderRadius: 10 },
  highlightText: { fontFamily: 'Fraunces_400Regular_Italic', fontSize: 15, color: colors.ink, lineHeight: 21 },

  sourceCard: { marginTop: 8, padding: 8, borderWidth: 1, borderColor: colors.border, borderRadius: 9, flexDirection: 'row', gap: 8, borderStyle: 'dashed' },
  sourceNum: { fontFamily: 'JetBrainsMono_600SemiBold', fontSize: 10, color: colors.accent, paddingTop: 2 },
  sourceTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: colors.ink },
  sourceUrl: { fontFamily: 'JetBrainsMono_400Regular', fontSize: 9.5, color: colors.muted, marginTop: 2 },

  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, paddingLeft: 34 },
  chip: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 999, paddingHorizontal: 11, paddingVertical: 7 },
  chipText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: colors.ink },

  composer: { paddingHorizontal: 12, paddingTop: 10, backgroundColor: colors.bg, borderTopWidth: 1, borderTopColor: colors.borderSoft },
  composerInner: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 22, paddingHorizontal: 14, paddingVertical: 10, gap: 8 },
  composerInput: { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 14, color: colors.ink, maxHeight: 100 },
  sendBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' },
  sendBtnText: { color: colors.bg, fontSize: 16, fontFamily: 'Inter_600SemiBold' },
})
