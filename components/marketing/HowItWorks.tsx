import Image from 'next/image'
import { SectionHeader } from '@/components/ui/section-header'
import { IPhoneFrame } from '@/components/ui/IPhoneFrame'

const beats = [
  {
    num: '01',
    heading: "Talk, don\u2019t type.",
    body: 'Open the app. Describe what you know about your home in plain language. Sembli extracts every asset, system, and vendor — no forms, no dropdowns, no guessing.',
    img: '/screenshots/onboarding-chat.jpg',
    alt: 'Sembli chat-first onboarding screen',
  },
  {
    num: '02',
    heading: 'Get a 10-year outlook, not a checklist.',
    body: "Your dashboard is a morning brief: what\u2019s due, what\u2019s coming, what it costs. Ask a question in plain English and get a cited answer \u2014 not a generic article.",
    img: '/screenshots/dashboard.jpg',
    alt: 'Sembli dashboard and 10-year outlook screen',
  },
  {
    num: '03',
    heading: 'Every asset, every vendor, one tap.',
    body: 'Scan a business card. Forward an invoice. The people and systems that keep your home running are always one tap away — linked to the assets they work on.',
    img: '/screenshots/vendor-profile.jpg',
    alt: 'Sembli vendor directory screen',
  },
]

export function HowItWorks() {
  return (
    <section className="px-6 py-20 md:py-28" style={{ borderTop: '1px solid rgba(26,24,20,0.08)' }}>
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="How it works"
          heading="Three capabilities. Zero data entry."
          className="mb-20"
        />

        <div className="flex flex-col gap-24">
          {beats.map((beat, i) => (
            <div
              key={beat.num}
              className={`flex flex-col md:flex-row md:items-center gap-10 md:gap-16 ${
                i % 2 === 1 ? 'md:flex-row-reverse' : ''
              }`}
            >
              <div className="flex-1">
                <p className="font-mono text-[10px] tracking-[0.6px] mb-4" style={{ color: '#B8860B' }}>
                  {beat.num}
                </p>
                <h3
                  className="font-heading font-normal tracking-tight mb-4"
                  style={{ fontSize: 'clamp(28px, 4vw, 40px)', color: '#1A1814', lineHeight: 1.1 }}
                >
                  {beat.heading}
                </h3>
                <p className="text-base leading-relaxed max-w-sm" style={{ color: 'rgba(26,24,20,0.5)' }}>
                  {beat.body}
                </p>
              </div>

              <div className="flex justify-center md:justify-start flex-shrink-0">
                <IPhoneFrame size="beat">
                  <Image
                    src={beat.img}
                    alt={beat.alt}
                    width={375}
                    height={812}
                    className="w-full h-full object-cover object-top"
                  />
                </IPhoneFrame>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
