'use client'

import { useState } from 'react'
import type { FormEvent, FocusEvent, ChangeEvent } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/admin/dashboard')
    }
  }

  const focusStyle = (e: FocusEvent<HTMLInputElement>) =>
    (e.target.style.borderColor = 'var(--caramel)')
  const blurStyle = (e: FocusEvent<HTMLInputElement>) =>
    (e.target.style.borderColor = 'var(--border)')

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '13px 16px',
    border: '1.5px solid var(--border)',
    borderRadius: 10,
    fontSize: 15,
    background: '#fff',
    color: 'var(--text-primary)',
    outline: 'none',
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, var(--brown) 0%, var(--brown-mid) 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 24,
        padding: '48px 40px',
        width: '100%',
        maxWidth: 420,
        boxShadow: '0 30px 80px rgba(0,0,0,0.3)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🧁</div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, color: 'var(--brown)', marginBottom: 6 }}>
            Admin Portal
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Sign in to manage Sago Bakes</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label style={{ display: 'block', fontWeight: 500, marginBottom: 6, fontSize: 14, color: 'var(--text-muted)' }}>
              Email
            </label>
            <input
              style={inputStyle}
              type="email"
              placeholder="admin@sagobakes.com"
              required
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              onFocus={focusStyle}
              onBlur={blurStyle}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 500, marginBottom: 6, fontSize: 14, color: 'var(--text-muted)' }}>
              Password
            </label>
            <input
              style={inputStyle}
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              onFocus={focusStyle}
              onBlur={blurStyle}
            />
          </div>

          {error && (
            <div style={{ background: '#fff5f5', border: '1px solid #fca5a5', borderRadius: 8, padding: '10px 14px', color: '#dc2626', fontSize: 14 }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              background: 'var(--caramel)',
              color: '#fff',
              border: 'none',
              borderRadius: 10,
              padding: '14px',
              fontSize: 16,
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: 4,
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
