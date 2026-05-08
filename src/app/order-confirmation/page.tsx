'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function ConfirmationContent() {
  const params = useSearchParams()
  const orderId = params.get('id')

  return (
    <div style={{ maxWidth: 560, margin: '80px auto', padding: '0 24px', textAlign: 'center' }}>
      <div style={{
        width: 100, height: 100, background: 'var(--sage)',
        borderRadius: '50%', display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: 48, margin: '0 auto 32px'
      }}>✓</div>

      <h1 style={{
        fontFamily: 'Playfair Display, serif',
        fontSize: 40, color: 'var(--brown)', marginBottom: 16
      }}>Order Placed!</h1>

      <p style={{ color: 'var(--text-muted)', fontSize: 17, lineHeight: 1.7, marginBottom: 12 }}>
        Thank you for your order! We've received it and will start preparing your fresh bakes right away.
      </p>

      {orderId && (
        <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 32 }}>
          Order ID: <code style={{ background: 'var(--cream)', padding: '2px 8px', borderRadius: 6, fontFamily: 'monospace' }}>
            {orderId.slice(0, 8).toUpperCase()}
          </code>
        </p>
      )}

      <p style={{ color: 'var(--text-muted)', fontSize: 15, marginBottom: 40, background: 'var(--cream)', padding: '16px 20px', borderRadius: 12 }}>
        🚚 We'll call you on the number provided to confirm delivery details.
      </p>

      <Link href="/" style={{
        background: 'var(--caramel)',
        color: '#fff',
        padding: '14px 40px',
        borderRadius: 50,
        fontWeight: 600,
        fontSize: 16,
        display: 'inline-block'
      }}>
        Order More
      </Link>
    </div>
  )
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: 80 }}>Loading...</div>}>
      <ConfirmationContent />
    </Suspense>
  )
}
