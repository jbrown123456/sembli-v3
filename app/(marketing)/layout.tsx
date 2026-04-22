export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: '#F5F0E8', color: '#1A1814' }}
    >
      {children}
    </div>
  )
}
