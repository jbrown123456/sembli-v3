export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: '#1A1814', color: '#F0EBE0' }}
    >
      {children}
    </div>
  )
}
