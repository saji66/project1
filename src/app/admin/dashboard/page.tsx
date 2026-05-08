'use client'

import { useState, useEffect, useCallback } from 'react'
import type { FormEvent, FocusEvent, ChangeEvent } from 'react'
import { supabase, Product, Order } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const emptyForm = { name: '', price: '', image_url: '', description: '' }

type FormState = typeof emptyForm

export default function AdminDashboard() {
  const router = useRouter()
  const [tab, setTab] = useState<'products' | 'orders'>('products')
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [form, setForm] = useState<FormState>(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const checkAuth = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) router.replace('/admin/login')
  }, [router])

  const fetchProducts = useCallback(async () => {
    const { data } = await supabase.from('products').select('*').order('name')
    setProducts(data || [])
  }, [])

  const fetchOrders = useCallback(async () => {
    const { data } = await supabase
      .from('orders')
      .select('*, order_items(*, product:products(name, price))')
      .order('created_at', { ascending: false })
    setOrders((data as Order[]) || [])
  }, [])

  useEffect(() => {
    checkAuth()
    fetchProducts().then(() => setLoading(false))
  }, [checkAuth, fetchProducts])

  useEffect(() => {
    if (tab === 'orders') fetchOrders()
  }, [tab, fetchOrders])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.replace('/admin/login')
  }

  const handleSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    const payload = { ...form, price: parseFloat(form.price) }

    if (editingId) {
      const { error } = await supabase.from('products').update(payload).eq('id', editingId)
      if (error) { setError(error.message); setSaving(false); return }
    } else {
      const { error } = await supabase.from('products').insert(payload)
      if (error) { setError(error.message); setSaving(false); return }
    }
    setForm(emptyForm)
    setEditingId(null)
    setShowForm(false)
    await fetchProducts()
    setSaving(false)
  }

  const handleEdit = (p: Product) => {
    setForm({ name: p.name, price: String(p.price), image_url: p.image_url || '', description: p.description || '' })
    setEditingId(p.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return
    await supabase.from('products').delete().eq('id', id)
    await fetchProducts()
  }

  const focusIn = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    (e.target.style.borderColor = 'var(--caramel)')
  const focusOut = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    (e.target.style.borderColor = 'var(--border)')

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '11px 14px', border: '1.5px solid var(--border)',
    borderRadius: 8, fontSize: 14, background: '#fff', outline: 'none',
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <p style={{ color: 'var(--text-muted)', fontSize: 18 }}>Loading...</p>
    </div>
  )

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 36 }}>
        <div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 36, color: 'var(--brown)' }}>Admin Dashboard</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 4 }}>Manage your bakery products and orders</p>
        </div>
        <button onClick={handleLogout} style={{
          background: 'none', border: '1.5px solid var(--border)',
          borderRadius: 8, padding: '9px 20px', fontWeight: 500, fontSize: 14,
          color: 'var(--text-muted)', cursor: 'pointer',
        }}>
          Sign Out
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, background: 'var(--cream)', borderRadius: 12, padding: 4, width: 'fit-content', marginBottom: 32 }}>
        {(['products', 'orders'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '10px 28px', borderRadius: 8, border: 'none', fontWeight: 600, fontSize: 15,
            background: tab === t ? 'var(--caramel)' : 'transparent',
            color: tab === t ? '#fff' : 'var(--text-muted)',
            cursor: 'pointer', textTransform: 'capitalize', transition: 'all 0.2s',
          }}>{t}</button>
        ))}
      </div>

      {/* Products Tab */}
      {tab === 'products' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, color: 'var(--brown)' }}>
              Products ({products.length})
            </h2>
            <button onClick={() => { setForm(emptyForm); setEditingId(null); setShowForm(true) }} style={{
              background: 'var(--caramel)', color: '#fff', border: 'none',
              borderRadius: 10, padding: '11px 22px', fontWeight: 600, fontSize: 14, cursor: 'pointer',
            }}>
              + Add Product
            </button>
          </div>

          {showForm && (
            <div style={{
              background: 'var(--warm-white)', border: '1px solid var(--border)',
              borderRadius: 16, padding: 28, marginBottom: 28,
            }}>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, color: 'var(--brown)', marginBottom: 20 }}>
                {editingId ? 'Edit Product' : 'New Product'}
              </h3>
              <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-muted)', marginBottom: 6 }}>Product Name *</label>
                  <input style={inputStyle} placeholder="e.g. Chocolate Croissant" required
                    value={form.name}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setForm(p => ({ ...p, name: e.target.value }))}
                    onFocus={focusIn} onBlur={focusOut} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-muted)', marginBottom: 6 }}>Price (₹) *</label>
                  <input style={inputStyle} type="number" step="0.01" min="0" placeholder="0.00" required
                    value={form.price}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setForm(p => ({ ...p, price: e.target.value }))}
                    onFocus={focusIn} onBlur={focusOut} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-muted)', marginBottom: 6 }}>Image URL</label>
                  <input style={inputStyle} placeholder="https://..."
                    value={form.image_url}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setForm(p => ({ ...p, image_url: e.target.value }))}
                    onFocus={focusIn} onBlur={focusOut} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-muted)', marginBottom: 6 }}>Description</label>
                  <textarea style={{ ...inputStyle, height: 80, resize: 'vertical' }} placeholder="Short product description..."
                    value={form.description}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setForm(p => ({ ...p, description: e.target.value }))}
                    onFocus={focusIn} onBlur={focusOut} />
                </div>

                {error && (
                  <div style={{ gridColumn: '1/-1', background: '#fff5f5', border: '1px solid #fca5a5', borderRadius: 8, padding: '10px', color: '#dc2626', fontSize: 13 }}>
                    {error}
                  </div>
                )}

                <div style={{ gridColumn: '1/-1', display: 'flex', gap: 12 }}>
                  <button type="submit" disabled={saving} style={{
                    background: 'var(--caramel)', color: '#fff', border: 'none',
                    borderRadius: 8, padding: '11px 28px', fontWeight: 600, fontSize: 14, cursor: 'pointer',
                  }}>
                    {saving ? 'Saving...' : editingId ? 'Update Product' : 'Add Product'}
                  </button>
                  <button type="button" onClick={() => setShowForm(false)} style={{
                    background: 'none', border: '1.5px solid var(--border)', borderRadius: 8,
                    padding: '11px 20px', fontWeight: 500, fontSize: 14, cursor: 'pointer', color: 'var(--text-muted)',
                  }}>Cancel</button>
                </div>
              </form>
            </div>
          )}

          {products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🍞</div>
              <p>No products yet. Add your first one!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 12 }}>
              {products.map(p => (
                <div key={p.id} style={{
                  background: 'var(--warm-white)', border: '1px solid var(--border)',
                  borderRadius: 14, padding: '18px 22px',
                  display: 'flex', alignItems: 'center', gap: 16,
                }}>
                  <div style={{ width: 56, height: 56, borderRadius: 10, overflow: 'hidden', flexShrink: 0, background: 'var(--dusty-rose)' }}>
                    {p.image_url
                      ? <img src={p.image_url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>🧁</div>
                    }
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, fontSize: 16, color: 'var(--brown)' }}>{p.name}</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 2 }}>
                      {p.description && p.description.length > 60 ? p.description.slice(0, 60) + '...' : p.description}
                    </p>
                  </div>
                  <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, fontWeight: 700, color: 'var(--caramel-dark)', minWidth: 80, textAlign: 'right' }}>
                    ₹{p.price.toFixed(2)}
                  </span>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => handleEdit(p)} style={{
                      background: 'var(--cream)', border: '1px solid var(--border)',
                      borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 500, cursor: 'pointer',
                    }}>Edit</button>
                    <button onClick={() => handleDelete(p.id)} style={{
                      background: '#fff5f5', border: '1px solid #fca5a5', color: '#dc2626',
                      borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 500, cursor: 'pointer',
                    }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Orders Tab */}
      {tab === 'orders' && (
        <div>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, color: 'var(--brown)', marginBottom: 24 }}>
            Customer Orders ({orders.length})
          </h2>
          {orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📦</div>
              <p>No orders yet.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 16 }}>
              {orders.map(order => (
                <div key={order.id} style={{
                  background: 'var(--warm-white)', border: '1px solid var(--border)',
                  borderRadius: 16, padding: '22px 26px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: 17, color: 'var(--brown)' }}>{order.customer_name}</p>
                      <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 2 }}>📞 {order.phone}</p>
                      <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>📍 {order.address}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 700, color: 'var(--caramel-dark)' }}>
                        ₹{order.total_price.toFixed(2)}
                      </p>
                      <p style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 4 }}>
                        {new Date(order.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                      </p>
                    </div>
                  </div>
                  {order.order_items && order.order_items.length > 0 && (
                    <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12 }}>
                      <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Items</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {order.order_items.map((item: { id: string; quantity: number; product?: { name: string } }) => (
                          <span key={item.id} style={{
                            background: 'var(--cream)', border: '1px solid var(--border)',
                            borderRadius: 50, padding: '4px 12px', fontSize: 13,
                          }}>
                            {item.product?.name ?? 'Product'} × {item.quantity}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
