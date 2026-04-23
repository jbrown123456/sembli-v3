/**
 * Captures screenshots from the Sembli v3 HTML prototypes at 375×812 (iPhone viewport).
 * Run: npx tsx scripts/capture-screens.ts
 * Output: public/screenshots/*.jpg
 */

import { chromium } from 'playwright'
import path from 'path'

const DESIGN_DIR = path.resolve(
  __dirname,
  '../../Sembli (Home Tracking)/DESIGN (sembli v3)'
)

const OUTPUT_DIR = path.resolve(__dirname, '../public/screenshots')

const captures: { file: string; out: string; scrollY?: number }[] = [
  // Hero: onboarding chat/intake screen (scroll past welcome to intake)
  { file: '02-onboarding.html', out: 'onboarding-chat.jpg', scrollY: 0 },
  // Dashboard morning brief
  { file: '03-dashboard.html', out: 'dashboard.jpg', scrollY: 0 },
  // Template flow — "building live" screen
  { file: '04-template-flow.html', out: 'template-flow.jpg', scrollY: 0 },
  // Vendor directory — profile screen
  { file: '06-vendor-directory.html', out: 'vendor-profile.jpg', scrollY: 0 },
]

async function run() {
  const browser = await chromium.launch()
  const context = await browser.newContext({
    viewport: { width: 375, height: 812 },
    deviceScaleFactor: 3, // retina quality
  })

  for (const { file, out, scrollY = 0 } of captures) {
    const page = await context.newPage()
    const url = `file://${path.join(DESIGN_DIR, file)}`
    await page.goto(url, { waitUntil: 'networkidle' })

    // Wait for fonts to load
    await page.waitForTimeout(800)

    if (scrollY > 0) await page.evaluate(y => window.scrollTo(0, y), scrollY)

    const outPath = path.join(OUTPUT_DIR, out)
    await page.screenshot({ path: outPath, type: 'jpeg', quality: 92 })
    console.log(`✓ ${out}`)
    await page.close()
  }

  await browser.close()
  console.log('\nAll screenshots captured → public/screenshots/')
}

run().catch(err => { console.error(err); process.exit(1) })
