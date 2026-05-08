-- ============================================
-- Sago Bakes - Supabase Schema Setup
-- Run this in your Supabase SQL Editor
-- ============================================

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  image_url TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  total_price NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Order Items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- Row Level Security
-- ============================================

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Products: Anyone can read, only authenticated users (admins) can write
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Admin insert products" ON products FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin update products" ON products FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin delete products" ON products FOR DELETE USING (auth.role() = 'authenticated');

-- Orders: Anyone can insert (place an order), only authenticated users can read
CREATE POLICY "Public insert orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin read orders" ON orders FOR SELECT USING (auth.role() = 'authenticated');

-- Order Items: Anyone can insert, only authenticated users can read
CREATE POLICY "Public insert order_items" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin read order_items" ON order_items FOR SELECT USING (auth.role() = 'authenticated');

-- ============================================
-- Sample Data (Optional)
-- ============================================

INSERT INTO products (name, price, image_url, description) VALUES
  ('Classic Croissant', 55.00, 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400', 'Buttery, flaky layers baked to golden perfection every morning.'),
  ('Chocolate Lava Cake', 120.00, 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400', 'Warm chocolate cake with a molten fudge centre. Served fresh.'),
  ('Red Velvet Cupcake', 90.00, 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=400', 'Soft red velvet cupcake topped with creamy vanilla frosting.'),
  ('Sourdough Loaf', 180.00, 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400', 'Slow-fermented artisan sourdough with a crispy crust.'),
  ('Blueberry Muffin', 65.00, 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400', 'Fluffy muffin bursting with fresh blueberries.'),
  ('Cinnamon Roll', 95.00, 'https://images.unsplash.com/photo-1570145820259-b5b80c5c8bd6?w=400', 'Soft spiral roll glazed with cream cheese icing and cinnamon.');

