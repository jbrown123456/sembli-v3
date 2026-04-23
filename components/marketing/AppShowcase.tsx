import Image from 'next/image'
import { SectionHeader } from '@/components/ui/section-header'
import { IPhoneFrame } from '@/components/ui/IPhoneFrame'

const screens = [
  { img: '/screenshots/onboarding-chat.jpg', alt: 'Sembli onboarding — magic moment', label: 'Onboarding · Magic moment' },
  { img: '/screenshots/dashboard.jpg', alt: 'Sembli dashboard — morning brief', label: 'Dashboard · Morning brief' },
  { img: '/screenshots/template-flow.jpg', alt: 'Sembli template flow — building live', label: 'Template flow · Building live' },
  { img: '/screenshots/vendor-profile.jpg', alt: 'Sembli vendor directory — profile', label: 'Vendor · Profile' },
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
            <div key={s.img} className="flex flex-col items-center gap-3">
              <IPhoneFrame
                size="showcase"
                style={{ transform: `translateY(${i % 2 === 1 ? '24px' : '0'})` }}
              >
                <Image
                  src={s.img}
                  alt={s.alt}
                  width={375}
                  height={812}
                  className="w-full h-full object-cover object-top"
                />
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
