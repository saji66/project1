import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import './globals.css'
import { CartProvider } from '@/context/CartContext'
import Navbar from '@/components/Navbar'

export const metadata: Metadata = {
  title: 'Sago Bakes — Artisan Bakery',
  description: 'Fresh baked goods made with love. Order your favourites online.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Navbar />
          <main>{children}</main>
        </CartProvider>
      </body>
    </html>
  )
}
