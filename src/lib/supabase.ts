import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Product = {
  id: string
  name: string
  price: number
  image_url: string
  description: string
}

export type OrderItem = {
  id: string
  order_id: string
  product_id: string
  quantity: number
  product?: Pick<Product, 'name' | 'price'>
}

export type Order = {
  id: string
  customer_name: string
  phone: string
  address: string
  total_price: number
  created_at: string
  order_items?: OrderItem[]
}
