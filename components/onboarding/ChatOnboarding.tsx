'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { completeOnboarding } from '@/app/(onboarding)/onboarding/actions';
import { useAnalytics } from '@/lib/analytics';
import {
  MonoLabel, Cite, SourceCard,
  UserBubble, BotBubble, Highlight, ThinkChip,
  QuickChip, Composer, ChatHeader,
} from './atoms';
import { Logo } from '@/components/app/Logo';

// ─── Screen 1 — Welcome ──────────────────────────────────────

function ScreenWelcome({ onNext }: { onNext: () => void }) {
  return (
    <div
      style={{
        flex: 1,
        background: 'var(--almanac-bg)',
        display: 'flex',
        flexDirection: 'column',
        padding: '52px 24px 32px',
        color: 'var(--almanac-ink)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Logo size={32} />
        <span
          style={{
            fontFamily: 'var(--font-fraunces)',
            fontSize: 22,
            fontWeight: 400,
            letterSpacing: '-0.05em',
          }}
        >
          sembli
        </span>
      </div>

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          marginTop: -32,
        }}
      >
        <MonoLabel>For the long-distance caretaker</MonoLabel>
        <h1
          style={{
            fontFamily: 'var(--font-fraunces)',
            fontWeight: 400,
            fontSize: 52,
            lineHeight: 1.02,
            letterSpacing: '-0.04em',
            margin: '14px 0 0',
          }}
        >
          Your parents&apos;
          <br />
          home,
          <br />
          <span style={{ fontStyle: 'italic', color: 'var(--almanac-brand-deep)' }}>
            remembered.
          </span>
        </h1>
        <p
          style={{
            marginTop: 20,
            fontSize: 15.5,
            lineHeight: 1.55,
            color: 'var(--almanac-ink-soft)',
            maxWidth: 320,
          }}
        >
          Tell Sembli what you know — even if it&apos;s &ldquo;not much.&rdquo; We&apos;ll fill in
          the rest and keep track from here on out.
        </p>

        <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            onClick={onNext}
            style={{
              background: 'var(--almanac-ink)',
              color: 'var(--almanac-bg)',
              border: 0,
              padding: '16px 20px',
              borderRadius: 999,
              fontSize: 16,
              fontWeight: 600,
              fontFamily: 'var(--font-inter)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            Start a conversation
            <span style={{ fontSize: 18 }}>→</span>
          </button>
          <button
            style={{
              background: 'transparent',
              color: 'var(--almanac-ink-soft)',
              border: 0,
              padding: '12px',
              fontSize: 14,
              fontFamily: 'var(--font-inter)',
              cursor: 'pointer',
            }}
          >
            I already have an account
          </button>
        </div>

        <div
          style={{
            marginTop: 28,
            padding: '12px 14px',
            background: 'var(--almanac-surface-alt)',
            borderRadius: 12,
            display: 'flex',
            gap: 10,
            alignItems: 'flex-start',
          }}
        >
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: '50%',
              background: 'var(--almanac-brand)',
              display: 'grid',
              placeItems: 'center',
              flexShrink: 0,
              fontSize: 11,
              color: 'var(--almanac-ink)',
            }}
          >
            ✓
          </div>
          <div
            style={{
              fontSize: 12.5,
              lineHeight: 1.45,
              color: 'var(--almanac-ink-soft)',
            }}
          >
            <strong style={{ color: 'var(--almanac-ink)' }}>No forms to fill.</strong> Talk, type,
            or upload — Sembli figures it out and shows its work.
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Screen 2 — Intake ───────────────────────────────────────

function ScreenIntake({ onNext }: { onNext: (address: string) => void }) {
  const [input, setInput] = useState('');
  const [selectedWho, setSelectedWho] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [submitted, selectedWho]);

  const handleSubmit = () => {
    if (!input.trim()) return;
    setSubmitted(true);
    setTimeout(() => onNext(input.trim()), 900);
  };

  const now = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  return (
    <div
      style={{
        flex: 1,
        background: 'var(--almanac-bg)',
        display: 'flex',
        flexDirection: 'column',
        color: 'var(--almanac-ink)',
        overflow: 'hidden',
      }}
    >
      <ChatHeader />
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '16px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <div style={{ textAlign: 'center', padding: '4px 0 8px' }}>
          <MonoLabel>Today · {now}</MonoLabel>
        </div>

        <BotBubble>
          Hi — I&apos;m Sembli. I&apos;ll help you keep track of a home without living in it.
          <Highlight>Whose home are we starting with?</Highlight>
        </BotBubble>

        <div
          style={{
            alignSelf: 'flex-start',
            display: 'flex',
            gap: 6,
            flexWrap: 'wrap',
            paddingLeft: 34,
            maxWidth: '88%',
          }}
        >
          {["Mom & Dad's", "My mom's", "My dad's", "Someone else's"].map((who) => (
            <QuickChip key={who} accent={selectedWho === who} onClick={() => setSelectedWho(who)}>
              {who}
            </QuickChip>
          ))}
        </div>

        {selectedWho && (
          <>
            <UserBubble>{selectedWho}</UserBubble>
            <BotBubble>
              Got it. If you have the address I can pull up some things about the house right now.{' '}
              <span style={{ color: 'var(--almanac-muted)' }}>
                (Or skip — we can figure it out together.)
              </span>
            </BotBubble>

            <div style={{ alignSelf: 'flex-start', paddingLeft: 34, maxWidth: '88%' }}>
              <button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  background: 'var(--almanac-surface)',
                  border: '1px solid color-mix(in srgb, var(--almanac-brand-deep) 33%, transparent)',
                  padding: '12px 14px',
                  borderRadius: 14,
                  fontFamily: 'var(--font-inter)',
                  fontSize: 14,
                  fontWeight: 500,
                  color: 'var(--almanac-ink)',
                  cursor: 'pointer',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                }}
              >
                <span
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: 'var(--almanac-brand-soft)',
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: 14,
                  }}
                >
                  📍
                </span>
                Use my location
                <span style={{ color: 'var(--almanac-muted)', marginLeft: 'auto', fontSize: 13 }}>
                  ›
                </span>
              </button>
            </div>
          </>
        )}

        {submitted && <UserBubble>{input}</UserBubble>}
        <div ref={messagesEndRef} />
      </div>

      {selectedWho && !submitted && (
        <Composer
          value={input}
          onChange={setInput}
          onSubmit={handleSubmit}
          placeholder="Enter the address…"
        />
      )}
    </div>
  );
}

// ─── Screen 3 — Magic moment ──────────────────────────────────

function ScreenMagic({ address, onNext }: { address: string; onNext: () => void }) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 1400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      style={{
        flex: 1,
        background: 'var(--almanac-bg)',
        display: 'flex',
        flexDirection: 'column',
        color: 'var(--almanac-ink)',
        overflow: 'hidden',
      }}
    >
      <ChatHeader step="Step 2 of 4" badge="GATHERING" />

      <div
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '16px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <UserBubble>{address}</UserBubble>
        <ThinkChip>looked up · county + redfin + energy star</ThinkChip>

        {revealed && (
          <>
            <BotBubble>
              Found it. Here&apos;s what I can see from public records:
              <div
                style={{
                  marginTop: 10,
                  background: 'var(--almanac-surface-alt)',
                  borderRadius: 12,
                  padding: 12,
                  fontSize: 13,
                }}
              >
                {(
                  [
                    ['Built', <><strong>1978</strong><Cite n={1} /></>],
                    ['Sq ft', <><strong>1,940</strong><Cite n={1} /></>],
                    ['Roof permit', <><strong>2011</strong><Cite n={2} /></>],
                    ['Lot', <strong>0.24 ac</strong>],
                  ] as [string, React.ReactNode][]
                ).map(([label, val], i) => (
                  <div
                    key={label}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '4px 0',
                      borderTop: i > 0 ? '1px solid var(--almanac-border-soft)' : 'none',
                    }}
                  >
                    <span style={{ color: 'var(--almanac-muted)' }}>{label}</span>
                    <span>{val}</span>
                  </div>
                ))}
              </div>
              <Highlight>
                A 1978 house this size usually has <strong>5–6 major systems</strong> worth
                tracking. I&apos;ll set up the obvious ones and we can fine-tune.
              </Highlight>
              <SourceCard n={1} title="County Assessor" source="public records · 2025" />
              <SourceCard
                n={2}
                title="City permits database"
                snippet="Roof replacement permit #11-4482, issued Apr 2011."
                source="city records · Apr 2011"
              />
            </BotBubble>

            <div
              style={{
                alignSelf: 'flex-start',
                display: 'flex',
                gap: 6,
                flexWrap: 'wrap',
                paddingLeft: 34,
                maxWidth: '88%',
              }}
            >
              <QuickChip accent onClick={onNext}>
                Looks right →
              </QuickChip>
              <QuickChip>Fix something</QuickChip>
              <QuickChip>Not their house</QuickChip>
            </div>
          </>
        )}
      </div>

      <Composer placeholder="Add anything you know…" />
    </div>
  );
}

// ─── Screen 4 — Voice memo ────────────────────────────────────

const WAVEFORM = [8,14,22,18,12,24,16,10,20,26,18,14,10,22,16,12,20,14,8,16,24,18,12,20,14,10,18,22,14,8,12,16];

const EXTRACTED_ITEMS: [string, string, string][] = [
  ['Roof', 'replaced ~2011', 'Exterior'],
  ['Rheem water heater', 'replaced last winter', 'Plumbing'],
  ['Carrier AC', 'installed ~2006', 'HVAC'],
  ['Dave — Hometown Heating', 'HVAC vendor', 'Contact'],
];

function ScreenVoice({ onNext }: { onNext: () => void }) {
  const [input, setInput] = useState('');
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);
  const [showExtraction, setShowExtraction] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startRecording = () => {
    setRecording(true);
    setSeconds(0);
    timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    setTimeout(() => setShowTranscript(true), 1800);
    setTimeout(() => setShowExtraction(true), 3200);
  };

  const stopRecording = () => {
    setRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  return (
    <div
      style={{
        flex: 1,
        background: 'var(--almanac-bg)',
        display: 'flex',
        flexDirection: 'column',
        color: 'var(--almanac-ink)',
        overflow: 'hidden',
      }}
    >
      <ChatHeader step="Step 3 of 4" badge={recording ? 'LISTENING' : undefined} />

      <div
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '16px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <BotBubble>
          Now the part only you can tell me.
          <Highlight>
            Just talk for 30 seconds — anything you remember about the house. Contractors, repairs,
            things that break, rooms you&apos;ve seen remodeled.
          </Highlight>
          It&apos;s genuinely fine to say &ldquo;I don&apos;t know.&rdquo; I&apos;ll organize
          whatever you give me.
        </BotBubble>

        {!recording && !showExtraction && (
          <div style={{ alignSelf: 'flex-start', paddingLeft: 34 }}>
            <button
              onClick={startRecording}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                background: 'var(--almanac-surface)',
                border: '1px solid var(--almanac-border)',
                padding: '12px 16px',
                borderRadius: 14,
                fontFamily: 'var(--font-inter)',
                fontSize: 14,
                fontWeight: 500,
                color: 'var(--almanac-ink)',
                cursor: 'pointer',
              }}
            >
              <span
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: 'var(--almanac-danger)',
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                <svg width="10" height="14" viewBox="0 0 10 14">
                  <rect x="2" y="0" width="6" height="9" rx="3" fill="#fff" />
                  <path
                    d="M0 8a5 5 0 0010 0M5 13v-2"
                    stroke="#fff"
                    strokeWidth="1.2"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              Tap to start talking
            </button>
          </div>
        )}

        {recording && (
          <div style={{ alignSelf: 'flex-end', width: '82%' }}>
            <div
              style={{
                background: 'var(--almanac-ink)',
                color: 'var(--almanac-bg)',
                borderRadius: '18px 18px 4px 18px',
                padding: '12px 14px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <button
                  onClick={stopRecording}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: '50%',
                    background: 'var(--almanac-danger)',
                    border: 0,
                    cursor: 'pointer',
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  <svg width="10" height="14" viewBox="0 0 10 14">
                    <rect x="2" y="0" width="6" height="9" rx="3" fill="#fff" />
                    <path
                      d="M0 8a5 5 0 0010 0M5 13v-2"
                      stroke="#fff"
                      strokeWidth="1.2"
                      fill="none"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontFamily: 'var(--font-jetbrains-mono)',
                      fontSize: 10,
                      letterSpacing: '0.05em',
                      opacity: 0.6,
                    }}
                  >
                    RECORDING
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-jetbrains-mono)',
                      fontSize: 13,
                      fontWeight: 500,
                    }}
                  >
                    0:{String(seconds).padStart(2, '0')}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 2, height: 28 }}>
                {WAVEFORM.map((h, i) => (
                  <div
                    key={i}
                    style={{
                      width: 2.5,
                      height: h,
                      borderRadius: 2,
                      background: i < seconds * 0.75 ? '#fff' : 'rgba(255,255,255,0.25)',
                      transition: 'background 0.3s',
                    }}
                  />
                ))}
              </div>
            </div>

            {showTranscript && (
              <div
                style={{
                  marginTop: 6,
                  padding: '8px 12px',
                  background: 'var(--almanac-surface-alt)',
                  borderRadius: 10,
                  fontSize: 13,
                  lineHeight: 1.45,
                  color: 'var(--almanac-ink-soft)',
                  fontStyle: 'italic',
                }}
              >
                &ldquo;Um, the roof was done maybe fifteen years ago? Mom had to get the water heater
                redone last winter, it was a Rheem I think. There&apos;s a Carrier AC unit,
                it&apos;s old. A guy named Dave from Hometown Heating has been servicing it for
                years…&rdquo;
              </div>
            )}
          </div>
        )}

        {showExtraction && (
          <>
            <ThinkChip>listening · extracting entities</ThinkChip>

            <div style={{ alignSelf: 'flex-start', paddingLeft: 34, maxWidth: '88%' }}>
              <div
                style={{
                  background: 'var(--almanac-surface)',
                  border: '1.5px solid var(--almanac-brand)',
                  borderRadius: 14,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    padding: '8px 12px',
                    background: 'var(--almanac-brand-soft)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <MonoLabel color="var(--almanac-brand-deep)">Sembli heard</MonoLabel>
                  <span
                    style={{
                      marginLeft: 'auto',
                      fontFamily: 'var(--font-jetbrains-mono)',
                      fontSize: 10,
                      color: 'var(--almanac-brand-deep)',
                    }}
                  >
                    {EXTRACTED_ITEMS.length} items
                  </span>
                </div>
                <div style={{ padding: '6px 0' }}>
                  {EXTRACTED_ITEMS.map(([t, s, tag], i) => (
                    <div
                      key={i}
                      style={{
                        padding: '8px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        borderTop: i > 0 ? '1px solid var(--almanac-border-soft)' : 'none',
                      }}
                    >
                      <div
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          background: 'var(--almanac-brand)',
                          flexShrink: 0,
                        }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{t}</div>
                        <div
                          style={{
                            fontSize: 11.5,
                            color: 'var(--almanac-muted)',
                            marginTop: 1,
                          }}
                        >
                          {s}
                        </div>
                      </div>
                      <div
                        style={{
                          fontFamily: 'var(--font-jetbrains-mono)',
                          fontSize: 9.5,
                          color: 'var(--almanac-muted)',
                          letterSpacing: '0.04em',
                          textTransform: 'uppercase',
                        }}
                      >
                        {tag}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ alignSelf: 'flex-start', display: 'flex', gap: 6, paddingLeft: 34 }}>
              <QuickChip accent onClick={onNext}>
                Continue →
              </QuickChip>
              <QuickChip>Add more</QuickChip>
            </div>
          </>
        )}
      </div>

      <Composer
        value={input}
        onChange={setInput}
        voice={recording}
        placeholder="Or type what you know…"
      />
    </div>
  );
}

// ─── Screen 5 — Outlook ───────────────────────────────────────

const WATCH_OUTS = [
  { t: 'Carrier AC', s: 'installed ~2006 — near end of typical 15–20 yr life', year: "'26–'28", urgent: true },
  { t: 'Water heater', s: 'replaced last winter — set a reminder for flush in fall', year: 'Oct', urgent: false },
  { t: 'Roof', s: 'replaced 2011 — halfway through typical asphalt life', year: "'31+", urgent: false },
];

function ScreenOutlook({ onDone }: { onDone: () => void }) {
  return (
    <div
      style={{
        flex: 1,
        background: 'var(--almanac-bg)',
        display: 'flex',
        flexDirection: 'column',
        color: 'var(--almanac-ink)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: '16px 18px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          flexShrink: 0,
        }}
      >
        <Logo size={32} />
        <div style={{ flex: 1 }}>
          <MonoLabel>Done in 2 min 14 s</MonoLabel>
          <div
            style={{
              fontFamily: 'var(--font-fraunces)',
              fontSize: 20,
              fontWeight: 400,
              letterSpacing: '-0.03em',
              marginTop: -1,
            }}
          >
            Mom&apos;s house,{' '}
            <span style={{ fontStyle: 'italic', color: 'var(--almanac-brand-deep)' }}>
              indexed.
            </span>
          </div>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '8px 18px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
        }}
      >
        {/* Hero quote card */}
        <div
          style={{
            background: 'var(--almanac-surface)',
            border: '1px solid var(--almanac-border)',
            borderRadius: 18,
            padding: '20px 20px 18px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
          }}
        >
          <MonoLabel>What I now know</MonoLabel>
          <div
            style={{
              fontFamily: 'var(--font-fraunces)',
              fontSize: 24,
              fontWeight: 400,
              lineHeight: 1.2,
              letterSpacing: '-0.03em',
              margin: '8px 0 0',
            }}
          >
            A 1978 ranch in Des Moines with{' '}
            <span style={{ color: 'var(--almanac-brand-deep)' }}>11 tracked items</span>,{' '}
            <span style={{ fontStyle: 'italic' }}>one trusted contractor</span>, and a few things
            I&apos;d watch.
          </div>

          <div
            style={{
              marginTop: 14,
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 10,
              paddingTop: 14,
              borderTop: '1px solid var(--almanac-border-soft)',
            }}
          >
            {[['11', 'items'], ['3', 'watch-outs'], ['$14k', 'est. 10-yr']].map(([v, l]) => (
              <div key={l}>
                <div
                  style={{
                    fontFamily: 'var(--font-fraunces)',
                    fontSize: 26,
                    fontWeight: 500,
                    letterSpacing: '-0.04em',
                    lineHeight: 1,
                  }}
                >
                  {v}
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--almanac-muted)', marginTop: 3 }}>
                  {l}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Watch-outs */}
        <div>
          <MonoLabel>Needs your eye</MonoLabel>
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {WATCH_OUTS.map((r, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  gap: 12,
                  alignItems: 'flex-start',
                  background: r.urgent ? 'var(--almanac-brand-soft)' : 'var(--almanac-surface)',
                  border: r.urgent
                    ? '1px solid color-mix(in srgb, var(--almanac-brand-deep) 20%, transparent)'
                    : '1px solid var(--almanac-border)',
                  borderRadius: 14,
                  padding: '12px 14px',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-fraunces)',
                    fontSize: 13,
                    fontWeight: 500,
                    fontStyle: 'italic',
                    color: r.urgent ? 'var(--almanac-brand-deep)' : 'var(--almanac-muted)',
                    width: 48,
                    flexShrink: 0,
                    marginTop: 1,
                  }}
                >
                  {r.year}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{r.t}</div>
                  <div
                    style={{
                      fontSize: 12.5,
                      color: 'var(--almanac-ink-soft)',
                      marginTop: 2,
                      lineHeight: 1.4,
                    }}
                  >
                    {r.s}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Personal nudge */}
        <div
          style={{
            padding: '16px 18px',
            background: 'var(--almanac-accent-soft)',
            borderRadius: 14,
            border: '1px solid color-mix(in srgb, var(--almanac-accent) 13%, transparent)',
          }}
        >
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: 'var(--almanac-accent)',
                color: '#fff',
                display: 'grid',
                placeItems: 'center',
                flexShrink: 0,
                fontSize: 12,
                marginTop: 1,
              }}
            >
              ♥
            </div>
            <div
              style={{
                fontFamily: 'var(--font-fraunces)',
                fontSize: 15.5,
                lineHeight: 1.4,
                fontStyle: 'italic',
                color: 'var(--almanac-accent)',
              }}
            >
              Next time you visit Mom, check the AC model number on the side — I&apos;ll use it to
              pin down the install date.
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button
            onClick={onDone}
            style={{
              width: '100%',
              background: 'var(--almanac-ink)',
              color: 'var(--almanac-bg)',
              border: 0,
              padding: '16px',
              borderRadius: 999,
              fontSize: 16,
              fontWeight: 600,
              fontFamily: 'var(--font-inter)',
              cursor: 'pointer',
            }}
          >
            Open Mom&apos;s home →
          </button>
          <button
            style={{
              width: '100%',
              background: 'transparent',
              color: 'var(--almanac-ink-soft)',
              border: 0,
              padding: '10px',
              fontSize: 13,
              fontFamily: 'var(--font-inter)',
              cursor: 'pointer',
            }}
          >
            Invite a sibling to collaborate
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Root orchestrator ────────────────────────────────────────

const TOTAL_STEPS = 5;

export function ChatOnboarding() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [address, setAddress] = useState('');
  const { track } = useAnalytics();

  // Fire onboarding_started once on mount
  useEffect(() => {
    track('onboarding_started');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function advanceTo(nextStep: number) {
    track('onboarding_step_completed', { step: nextStep });
    setStep(nextStep);
  }

  async function handleDone() {
    track('onboarding_completed', { home_name_set: !!address, has_hvac: false });
    await completeOnboarding().catch(() => {});
    router.push('/onboarding/add-home');
  }

  const screens = [
    <ScreenWelcome key="welcome" onNext={() => advanceTo(1)} />,
    <ScreenIntake key="intake" onNext={(addr) => { setAddress(addr); advanceTo(2); }} />,
    <ScreenMagic key="magic" address={address || '412 Oak St, Des Moines IA'} onNext={() => advanceTo(3)} />,
    <ScreenVoice key="voice" onNext={() => advanceTo(4)} />,
    <ScreenOutlook key="outlook" onDone={handleDone} />,
  ];

  return (
    <div
      style={{
        minHeight: '100dvh',
        background: 'var(--almanac-ink)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 430,
          minHeight: '100dvh',
          background: 'var(--almanac-bg)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Screen transition */}
        <div
          key={step}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
            animation: 'slideIn 0.22s ease-in-out',
          }}
        >
          {screens[step]}
        </div>

        {/* Step indicator (screens 1–4) */}
        {step > 0 && step < TOTAL_STEPS - 1 && (
          <div
            style={{
              position: 'absolute',
              bottom: 92,
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'center',
              gap: 6,
              pointerEvents: 'none',
            }}
          >
            {Array.from({ length: TOTAL_STEPS - 1 }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: i + 1 === step ? 16 : 6,
                  height: 6,
                  borderRadius: 3,
                  background:
                    i + 1 === step ? 'var(--almanac-ink)' : 'var(--almanac-border)',
                  transition: 'all 0.2s ease',
                }}
              />
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
