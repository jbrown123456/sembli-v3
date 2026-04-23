import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Sembli — Your home, remembered.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#F5F0E8',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '80px 96px',
          fontFamily: 'Georgia, serif',
        }}
      >
        <div
          style={{
            fontSize: 13,
            letterSpacing: 2,
            textTransform: 'uppercase',
            color: 'rgba(26,24,20,0.4)',
            marginBottom: 32,
            fontFamily: 'monospace',
          }}
        >
          SEMBLI · PRIVATE BETA · 2026
        </div>
        <div
          style={{
            fontSize: 80,
            fontWeight: 400,
            lineHeight: 1.05,
            letterSpacing: -3,
            color: '#1A1814',
            marginBottom: 32,
          }}
        >
          Your home,{' '}
          <span style={{ fontStyle: 'italic', color: '#B8860B' }}>remembered.</span>
        </div>
        <div
          style={{
            fontSize: 22,
            lineHeight: 1.5,
            color: 'rgba(26,24,20,0.5)',
            maxWidth: 600,
          }}
        >
          AI-native home management. Talk for two minutes. Leave with a 10-year outlook.
        </div>
      </div>
    ),
    { ...size }
  )
}
