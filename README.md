# 🧁 Sago Bakes

A full-stack artisan bakery ordering web app built with **Next.js 14**, **Supabase**, and deployed on **Vercel**.

---

## Features

**Customer Side**
- Browse bakery products with beautiful card UI
- Add to cart / update quantities / remove items
- Checkout with name, phone, and delivery address
- Order confirmation page

**Admin Side**
- Secure login via Supabase Auth
- Add, edit, and delete products
- View all customer orders with items
- Route protection via Next.js middleware

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Deployment | Vercel |
| Styling | CSS-in-JS (inline styles) |

---

## Getting Started

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd sago-bakes
npm install
```

### 2. Set Up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `supabase-schema.sql`
3. Go to **Authentication > Users** and create an admin user

### 3. Configure Environment Variables

```bash
cp .env.local.example .env.local
```

Fill in your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Find these in your Supabase dashboard under **Settings > API**.

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Product listing (home) |
| `/cart` | Shopping cart |
| `/checkout` | Place an order |
| `/order-confirmation` | Order success page |
| `/admin/login` | Admin sign-in |
| `/admin/dashboard` | Manage products & view orders |

---

## Deploying to Vercel

1. Push your repo to GitHub
2. Import the project at [vercel.com](https://vercel.com)
3. Add these Environment Variables in Vercel settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

---

## Database Schema

See `supabase-schema.sql` for the full schema including RLS policies.

**Tables:**
- `products` — bakery items
- `orders` — customer orders
- `order_items` — line items per order

---

## Admin Access

1. Go to `/admin/login`
2. Sign in with the email/password you created in Supabase Auth
3. You'll be redirected to the dashboard

---

Made with ❤️ and flour.
