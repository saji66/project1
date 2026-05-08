'use client'

import { useCart, CartItem } from '@/context/CartContext'
import Link from 'next/link'
import Image from 'next/image'

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, totalPrice, totalItems } = useCart()

  if (items.length === 0) {
    return (
      <div style={{ maxWidth: 680, margin: '80px auto', padding: '0 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 80, marginBottom: 24 }}>🛒</div>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 36, marginBottom: 12, color: 'var(--brown)' }}>
          Your cart is empty
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 16, marginBottom: 32 }}>
          Looks like you haven&apos;t added anything yet.
        </p>
        <Link href="/" style={{
          background: 'var(--caramel)',
          color: '#fff',
          padding: '14px 36px',
          borderRadius: 50,
          fontWeight: 600,
          fontSize: 16,
          display: 'inline-block',
        }}>
          Browse Menu
        </Link>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 24px' }}>
      <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 40, color: 'var(--brown)', marginBottom: 8 }}>
        Your Cart
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 40 }}>
        {totalItems} item{totalItems !== 1 ? 's' : ''}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32, alignItems: 'start' }}>
        {/* Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {items.map((item: CartItem) => (
            <div key={item.product.id} style={{
              background: 'var(--warm-white)',
              border: '1px solid var(--border)',
              borderRadius: 16,
              padding: 20,
              display: 'flex',
              gap: 18,
              alignItems: 'center',
            }}>
              <div style={{ width: 90, height: 90, borderRadius: 12, overflow: 'hidden', flexShrink: 0, background: 'var(--dusty-rose)' }}>
                {item.product.image_url ? (
                  <Image
                    src={item.product.image_url}
                    alt={item.product.name}
                    width={90}
                    height={90}
                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                  />
                ) : (
                  <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36 }}>🧁</div>
                )}
              </div>

              <div style={{ flex: 1 }}>
                <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, color: 'var(--brown)', marginBottom: 4 }}>
                  {item.product.name}
                </h3>
                <p style={{ color: 'var(--caramel-dark)', fontWeight: 600, fontSize: 16 }}>
                  ₹{item.product.price.toFixed(2)}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--cream)', borderRadius: 50, padding: '4px 4px' }}>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid var(--border)', background: '#fff', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brown)', cursor: 'pointer' }}
                  >−</button>
                  <span style={{ minWidth: 24, textAlign: 'center', fontWeight: 600, fontSize: 16 }}>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', background: 'var(--caramel)', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer' }}
                  >+</button>
                </div>
                <span style={{ fontWeight: 700, fontSize: 16, minWidth: 72, textAlign: 'right', color: 'var(--brown)' }}>
                  ₹{(item.product.price * item.quantity).toFixed(2)}
                </span>
                <button
                  onClick={() => removeFromCart(item.product.id)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 20, padding: 4, lineHeight: 1, cursor: 'pointer' }}
                  title="Remove"
                >✕</button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div style={{
          background: 'var(--warm-white)',
          border: '1px solid var(--border)',
          borderRadius: 20,
          padding: 28,
          position: 'sticky',
          top: 90,
        }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, color: 'var(--brown)', marginBottom: 24 }}>
            Order Summary
          </h2>
          {items.map((item: CartItem) => (
            <div key={item.product.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 14, color: 'var(--text-muted)' }}>
              <span>{item.product.name} × {item.quantity}</span>
              <span>₹{(item.product.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, marginTop: 8, display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 20 }}>
            <span style={{ fontFamily: 'Playfair Display, serif' }}>Total</span>
            <span style={{ color: 'var(--caramel-dark)' }}>₹{totalPrice.toFixed(2)}</span>
          </div>
          <Link href="/checkout" style={{
            display: 'block',
            background: 'var(--caramel)',
            color: '#fff',
            textAlign: 'center',
            padding: '14px',
            borderRadius: 12,
            fontWeight: 600,
            fontSize: 16,
            marginTop: 24,
          }}>
            Proceed to Checkout →
          </Link>
          <Link href="/" style={{ display: 'block', textAlign: 'center', marginTop: 12, color: 'var(--text-muted)', fontSize: 14 }}>
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
