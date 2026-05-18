import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Login — Jay Ganga Associates',
  robots: { index: false },
}

export default function AdminLoginLayout({ children }: { children: React.ReactNode }) {
  // Login page overrides navbar/footer by rendering standalone
  return <>{children}</>
}
