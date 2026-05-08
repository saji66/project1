'use client'

import Link from 'next/link'
import type { MouseEvent } from 'react'
import { useCart } from '@/context/CartContext'

export default function Navbar() {
  const { totalItems } = useCart()

  const onMenuEnter = (e: MouseEvent<HTMLAnchorElement>) =>
    (e.currentTarget.style.color = 'var(--caramel)')
  const onMenuLeave = (e: MouseEvent<HTMLAnchorElement>) =>
    (e.currentTarget.style.color = 'var(--text-muted)')
  const onCartEnter = (e: MouseEvent<HTMLAnchorElement>) =>
    (e.currentTarget.style.background = 'var(--caramel-dark)')
  const onCartLeave = (e: MouseEvent<HTMLAnchorElement>) =>
    (e.currentTarget.style.background = 'var(--caramel)')

  return (
    <nav style={{
      background: 'var(--warm-white)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 2px 20px var(--shadow)',
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '0 24px',
        height: 72,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 28 }}>🧁</span>
          <span style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 24,
            fontWeight: 700,
            color: 'var(--caramel-dark)',
            letterSpacing: '-0.5px',
          }}>Sago Bakes</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <Link
            href="/"
            style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: 15, transition: 'color 0.2s' }}
            onMouseEnter={onMenuEnter}
            onMouseLeave={onMenuLeave}
          >
            Menu
          </Link>
          <Link
            href="/cart"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'var(--caramel)',
              color: '#fff',
              padding: '9px 20px',
              borderRadius: 50,
              fontWeight: 500,
              fontSize: 15,
              transition: 'background 0.2s',
              position: 'relative',
            }}
            onMouseEnter={onCartEnter}
            onMouseLeave={onCartLeave}
          >
            <span>🛒</span>
            <span>Cart</span>
            {totalItems > 0 && (
              <span style={{
                background: 'var(--brown)',
                color: '#fff',
                borderRadius: '50%',
                width: 20,
                height: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 11,
                fontWeight: 700,
                marginLeft: 2,
              }}>{totalItems}</span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  )
}
