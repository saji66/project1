import { supabase, Product } from '@/lib/supabase'
import ProductCard from '@/components/ProductCard'

async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase.from('products').select('*').order('name')
  if (error) { console.error(error); return [] }
  return data || []
}

export default async function HomePage() {
  const products = await getProducts()

  return (
    <div>
      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, var(--brown) 0%, var(--brown-mid) 60%, var(--caramel-dark) 100%)',
        color: '#fff',
        padding: '80px 24px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.05,
          backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }} />
        <div style={{ position: 'relative', maxWidth: 680, margin: '0 auto' }}>
          <p style={{ fontSize: 14, letterSpacing: 4, textTransform: 'uppercase', color: 'var(--caramel-light)', marginBottom: 16 }}>
            Fresh · Artisan · Handcrafted
          </p>
          <h1 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(40px, 7vw, 68px)',
            fontWeight: 700,
            lineHeight: 1.1,
            marginBottom: 20
          }}>
            Baked With Love,<br />
            <em style={{ fontStyle: 'italic', color: 'var(--caramel-light)' }}>Every Single Day</em>
          </h1>
          <p style={{ fontSize: 18, lineHeight: 1.7, color: 'rgba(255,255,255,0.8)', maxWidth: 480, margin: '0 auto' }}>
            From buttery croissants to layered cakes — discover our handcrafted treats made fresh each morning.
          </p>
        </div>
      </section>

      {/* Products */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 36,
            fontWeight: 600,
            color: 'var(--brown)'
          }}>Our Menu</h2>
          <div style={{ width: 60, height: 3, background: 'var(--caramel)', margin: '12px auto 0', borderRadius: 2 }} />
        </div>

        {products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🍞</div>
            <p style={{ fontSize: 18 }}>No products available yet. Check back soon!</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 28
          }}>
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
