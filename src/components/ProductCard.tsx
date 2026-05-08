'use client'

import { Product } from '@/lib/supabase'
import { useCart } from '@/context/CartContext'
import type { MouseEvent } from 'react'
import Image from 'next/image'
import { useState } from 'react'

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart, items } = useCart()
  const [added, setAdded] = useState(false)
  const cartItem = items.find(i => i.product.id === product.id)

  const handleAdd = () => {
    addToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1200)
  }

  const onCardEnter = (e: MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = 'translateY(-6px)'
    e.currentTarget.style.boxShadow = '0 16px 40px rgba(61,35,20,0.14)'
  }
  const onCardLeave = (e: MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = 'translateY(0)'
    e.currentTarget.style.boxShadow = 'none'
  }

  return (
    <div
      style={{
        background: 'var(--warm-white)',
        borderRadius: 20,
        overflow: 'hidden',
        border: '1px solid var(--border)',
        transition: 'transform 0.25s, box-shadow 0.25s',
        cursor: 'default',
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseEnter={onCardEnter}
      onMouseLeave={onCardLeave}
    >
      <div style={{ position: 'relative', height: 220, background: 'var(--dusty-rose)', overflow: 'hidden' }}>
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 72 }}>
            🧁
          </div>
        )}
        {cartItem && (
          <div style={{
            position: 'absolute', top: 12, right: 12,
            background: 'var(--caramel)',
            color: '#fff',
            borderRadius: 50,
            padding: '4px 10px',
            fontSize: 12,
            fontWeight: 600,
          }}>
            {cartItem.quantity} in cart
          </div>
        )}
      </div>

      <div style={{ padding: '20px 22px 22px', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <h3 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: 20,
          fontWeight: 600,
          color: 'var(--brown)',
        }}>{product.name}</h3>

        <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.6, flex: 1 }}>
          {product.description}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
          <span style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 22,
            fontWeight: 700,
            color: 'var(--caramel-dark)',
          }}>₹{product.price.toFixed(2)}</span>

          <button
            onClick={handleAdd}
            style={{
              background: added ? 'var(--sage)' : 'var(--caramel)',
              color: '#fff',
              border: 'none',
              borderRadius: 50,
              padding: '10px 22px',
              fontWeight: 600,
              fontSize: 14,
              cursor: 'pointer',
              transition: 'all 0.2s',
              transform: added ? 'scale(0.96)' : 'scale(1)',
            }}
          >
            {added ? '✓ Added!' : '+ Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  )
}
