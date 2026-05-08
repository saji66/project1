'use client'

import { useState } from 'react'
import type { FormEvent, FocusEvent, ChangeEvent } from 'react'
import { useCart } from '@/context/CartContext'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart()
  const router = useRouter()
  const [form, setForm] = useState({ customer_name: '', phone: '', address: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (items.length === 0) return
    setLoading(true)
    setError('')

    try {
      const { data: order, error: orderErr } = await supabase
        .from('orders')
        .insert({ ...form, total_price: totalPrice })
        .select()
        .single()

      if (orderErr) throw orderErr

      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.product.id,
        quantity: item.quantity,
      }))

      const { error: itemsErr } = await supabase.from('order_items').insert(orderItems)
      if (itemsErr) throw itemsErr

      clearCart()
      router.push(`/order-confirmation?id=${order.id}`)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const focusIn = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    (e.target.style.borderColor = 'var(--caramel)')
  const focusOut = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    (e.target.style.borderColor = 'var(--border)')

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '13px 16px',
    border: '1.5px solid var(--border)',
    borderRadius: 10,
    fontSize: 15,
    background: 'var(--warm-white)',
    color: 'var(--text-primary)',
    outline: 'none',
    transition: 'border-color 0.2s',
  }

  if (items.length === 0) {
    return (
      <div style={{ maxWidth: 500, margin: '80px auto', textAlign: 'center', padding: '0 24px' }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🛒</div>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, marginBottom: 12 }}>Nothing to checkout</h2>
        <Link href="/" style={{ color: 'var(--caramel)', fontWeight: 600 }}>← Back to Menu</Link>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 920, margin: '0 auto', padding: '48px 24px' }}>
      <Link href="/cart" style={{ color: 'var(--text-muted)', fontSize: 14, display: 'inline-block', marginBottom: 24 }}>
        ← Back to Cart
      </Link>
      <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 40, color: 'var(--brown)', marginBottom: 40 }}>
        Checkout
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 40, alignItems: 'start' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ background: 'var(--warm-white)', border: '1px solid var(--border)', borderRadius: 20, padding: 28 }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, color: 'var(--brown)', marginBottom: 24 }}>
              Delivery Details
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontWeight: 500, marginBottom: 6, fontSize: 14, color: 'var(--text-muted)' }}>
                  Full Name *
                </label>
                <input
                  style={inputStyle}
                  type="text"
                  placeholder="Your full name"
                  required
                  value={form.customer_name}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setForm(p => ({ ...p, customer_name: e.target.value }))}
                  onFocus={focusIn}
                  onBlur={focusOut}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 500, marginBottom: 6, fontSize: 14, color: 'var(--text-muted)' }}>
                  Phone Number *
                </label>
                <input
                  style={inputStyle}
                  type="tel"
                  placeholder="+91 98765 43210"
                  required
                  value={form.phone}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setForm(p => ({ ...p, phone: e.target.value }))}
                  onFocus={focusIn}
                  onBlur={focusOut}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 500, marginBottom: 6, fontSize: 14, color: 'var(--text-muted)' }}>
                  Delivery Address *
                </label>
                <textarea
                  style={{ ...inputStyle, height: 110, resize: 'vertical' }}
                  placeholder="Full delivery address"
                  required
                  value={form.address}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                    setForm(p => ({ ...p, address: e.target.value }))}
                  onFocus={focusIn}
                  onBlur={focusOut}
                />
              </div>
            </div>
          </div>

          {error && (
            <div style={{ background: '#fff5f5', border: '1px solid #fca5a5', borderRadius: 10, padding: '12px 16px', color: '#dc2626', fontSize: 14 }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading ? 'var(--text-muted)' : 'var(--caramel)',
              color: '#fff',
              border: 'none',
              borderRadius: 12,
              padding: '16px',
              fontSize: 17,
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s',
            }}
          >
            {loading ? 'Placing Order...' : `Place Order · ₹${totalPrice.toFixed(2)}`}
          </button>
        </form>

        {/* Order summary */}
        <div style={{
          background: 'var(--warm-white)',
          border: '1px solid var(--border)',
          borderRadius: 20,
          padding: 28,
          position: 'sticky',
          top: 90,
        }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, color: 'var(--brown)', marginBottom: 20 }}>
            Your Order
          </h2>
          {items.map(item => (
            <div key={item.product.id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 12,
              fontSize: 14,
              color: 'var(--text-muted)',
              paddingBottom: 12,
              borderBottom: '1px solid var(--border)',
            }}>
              <span style={{ flex: 1 }}>
                {item.product.name}
                <br />
                <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>Qty: {item.quantity}</span>
              </span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                ₹{(item.product.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 20, marginTop: 8 }}>
            <span style={{ fontFamily: 'Playfair Display, serif' }}>Total</span>
            <span style={{ color: 'var(--caramel-dark)' }}>₹{totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
