import { SectionHeader } from '@/components/ui/section-header'
import { IPhoneFrame } from '@/components/ui/IPhoneFrame'

const screens = [
  { label: 'Onboarding · Magic moment', file: '02-onboarding' },
  { label: 'Dashboard · Morning brief', file: '03-dashboard' },
  { label: 'Template flow · Building live', file: '04-template-flow' },
  { label: 'Vendor · Profile', file: '06-vendor-directory' },
]

export function AppShowcase() {
  return (
    <section className="px-6 py-20 md:py-28 overflow-hidden" style={{ borderTop: '1px solid rgba(26,24,20,0.08)' }}>
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="The app"
          heading={<>Everything your home needs,<br /><em style={{ fontStyle: 'italic', color: '#B8860B' }}>in your pocket.</em></>}
          className="mb-16"
        />

        <div className="flex justify-center gap-4 md:gap-8 flex-wrap">
          {screens.map((s, i) => (
            <div key={s.file} className="flex flex-col items-center gap-3">
              <IPhoneFrame
                size="showcase"
                className="transition-transform duration-300"
                style={{ transform: `translateY(${i % 2 === 1 ? '24px' : '0'})` }}
              >
                <div className="w-full h-full flex items-center justify-center" style={{ background: '#1A1814' }}>
                  <span className="font-mono text-[9px] text-center px-2" style={{ color: 'rgba(255,255,255,0.2)' }}>
                    {s.file}
                  </span>
                </div>
              </IPhoneFrame>
              <span className="font-mono text-[10px]" style={{ color: 'rgba(26,24,20,0.35)' }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
