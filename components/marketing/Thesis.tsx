import { SectionHeader } from '@/components/ui/section-header'

const problems = [
  {
    num: '01',
    heading: "You don\u2019t know what you own.",
    body: "Appliance manuals are in a drawer. HVAC age is a guess. Warranty status is unknown. Your home is the largest asset you\u2019ll ever own, and it\u2019s almost entirely undocumented.",
  },
  {
    num: '02',
    heading: 'Maintenance is reactive.',
    body: 'You find out the water heater failed when the floor is wet. You hire the first contractor on Google when you have no time to compare. The system is built to surprise you at the worst moment.',
  },
  {
    num: '03',
    heading: 'AI can fix both.',
    body: "Sembli converts conversations, photos, and PDFs into structured home intelligence. It knows your home better than you do \u2014 and it tells you what\u2019s coming before it arrives.",
  },
]

export function Thesis() {
  return (
    <section className="px-6 py-20 md:py-28" style={{ borderTop: '1px solid rgba(26,24,20,0.08)' }}>
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="The problem"
          heading={<>Most homeowners are flying <em style={{ fontStyle: 'italic', color: '#B8860B' }}>blind.</em></>}
          className="mb-16"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {problems.map(p => (
            <div
              key={p.num}
              className="rounded-[14px] p-6"
              style={{
                background: 'rgba(26,24,20,0.04)',
                border: '1px solid rgba(26,24,20,0.08)',
              }}
            >
              <p className="font-mono text-[10px] tracking-[0.6px] mb-3" style={{ color: '#B8860B' }}>
                {p.num}
              </p>
              <h3 className="font-heading text-xl font-normal tracking-tight mb-3" style={{ color: '#1A1814' }}>
                {p.heading}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(26,24,20,0.5)' }}>
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
