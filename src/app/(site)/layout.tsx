import { Header } from '@/components/site/Header'
import { Footer } from '@/components/site/Footer'
import { Outfit, Libre_Baskerville } from 'next/font/google'
import '@/app/globals.css'

const fontSans = Outfit({
  subsets: ['latin'],
  variable: '--font-sans',
})

const fontSerif = Libre_Baskerville({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-serif',
})

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`min-h-screen flex flex-col font-sans antialiased ${fontSans.variable} ${fontSerif.variable}`}>
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}
