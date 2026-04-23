'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ToolCallChip } from './ToolCallChip'

export interface ToolCall {
  toolName: string
  done: boolean
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  toolCalls?: ToolCall[]
  isStreaming?: boolean
}

interface MessageBubbleProps {
  message: Message
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user'

  if (isUser) {
    return (
      <div className="flex justify-end px-4">
        <div
          style={{
            maxWidth: '78%',
            background: 'var(--almanac-ink)',
            color: 'var(--almanac-bg)',
            borderRadius: '18px 18px 4px 18px',
            padding: '10px 14px',
            fontSize: 15,
            lineHeight: 1.5,
            fontFamily: 'var(--font-inter)',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {message.content}
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-end gap-2.5 px-4">
      {/* Sembli avatar */}
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: '50%',
          background: 'var(--almanac-accent)',
          flexShrink: 0,
          display: 'grid',
          placeItems: 'center',
          alignSelf: 'flex-start',
          marginTop: 2,
        }}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 9.5C2 6 4 3.5 6 3.5C8 3.5 10 6 10 9.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="6" cy="2.5" r="1" fill="white" />
        </svg>
      </div>

      <div style={{ maxWidth: 'calc(100% - 40px)', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {/* Tool call chips */}
        {message.toolCalls && message.toolCalls.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 4 }}>
            {message.toolCalls.map((tc, i) => (
              <ToolCallChip key={i} toolName={tc.toolName} done={tc.done} />
            ))}
          </div>
        )}

        {/* Message text */}
        {message.content && (
          <div
            style={{
              background: 'var(--almanac-surface-alt)',
              borderRadius: '18px 18px 18px 4px',
              padding: '10px 14px',
              fontSize: 15,
              lineHeight: 1.6,
              fontFamily: 'var(--font-inter)',
              color: 'var(--almanac-ink)',
            }}
          >
            <div className="sembli-markdown">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content}
              </ReactMarkdown>
              {message.isStreaming && (
                <span
                  style={{
                    display: 'inline-block',
                    width: 2,
                    height: 14,
                    background: 'var(--almanac-accent)',
                    marginLeft: 1,
                    verticalAlign: 'middle',
                    animation: 'sembliCursor 1s step-end infinite',
                  }}
                />
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes sembliCursor { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        .sembli-markdown p { margin: 0 0 8px; }
        .sembli-markdown p:last-child { margin-bottom: 0; }
        .sembli-markdown ul, .sembli-markdown ol { padding-left: 18px; margin: 4px 0 8px; }
        .sembli-markdown li { margin-bottom: 3px; }
        .sembli-markdown strong { color: var(--almanac-ink); }
        .sembli-markdown code {
          background: var(--almanac-border-soft);
          border-radius: 4px;
          padding: 1px 5px;
          font-family: var(--font-jetbrains-mono);
          font-size: 13px;
        }
        .sembli-markdown pre code {
          display: block;
          padding: 10px 12px;
          margin: 6px 0;
          overflow-x: auto;
        }
        .sembli-markdown a { color: var(--almanac-accent); text-decoration: underline; }
        .sembli-markdown table { border-collapse: collapse; width: 100%; font-size: 13px; margin: 8px 0; }
        .sembli-markdown th {
          background: var(--almanac-border-soft);
          padding: 5px 8px;
          text-align: left;
          border-bottom: 1px solid var(--almanac-border);
        }
        .sembli-markdown td {
          padding: 5px 8px;
          border-bottom: 1px solid var(--almanac-border-soft);
        }
      `}</style>
    </div>
  )
}
