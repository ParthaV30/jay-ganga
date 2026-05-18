'use client'

import { usePathname } from 'next/navigation'
import Navbar from './Navbar'
import Footer from './Footer'
import Toast from './Toast'

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')

  if (isAdmin) {
    return (
      <>
        <Toast />
        {children}
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <Toast />
    </>
  )
}
