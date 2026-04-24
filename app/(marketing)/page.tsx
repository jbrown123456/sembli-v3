import { Hero } from '@/components/marketing/Hero'
import { Thesis } from '@/components/marketing/Thesis'
import { HowItWorks } from '@/components/marketing/HowItWorks'
import { AppShowcase } from '@/components/marketing/AppShowcase'
import { WaitlistSection } from '@/components/marketing/WaitlistSection'
import { MarketingFooter } from '@/components/marketing/MarketingFooter'
import { LandingAnalytics } from '@/components/marketing/Analytics'
import { WaitlistProvider } from '@/components/marketing/WaitlistContext'

export default function LandingPage() {
  return (
    <WaitlistProvider>
      <LandingAnalytics />
      <Hero />
      <Thesis />
      <HowItWorks />
      <AppShowcase />
      <WaitlistSection />
      <MarketingFooter />
    </WaitlistProvider>
  )
}
