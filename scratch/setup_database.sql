-- ============================================================
-- BLENDARTBOOK - TAM VERİTABANI KURULUM SQL
-- Supabase SQL Editor'de tüm bu kodu çalıştırın
-- ============================================================

-- 1. PROFILES TABLOSU
-- Kullanıcı profil bilgileri (auth.users ile bağlantılı)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  phone TEXT,
  address TEXT,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. BOOKS TABLOSU
-- Kitap ürünleri
CREATE TABLE IF NOT EXISTS public.books (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT,
  genre TEXT,
  language TEXT DEFAULT 'Turkish',
  price DECIMAL(10,2),
  image_url TEXT,
  description TEXT,
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. PRODUCTS TABLOSU
-- Genel ürünler (sanat, el yapımı, e-kitap, sesli kitap vb.)
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  price DECIMAL(10,2),
  image_url TEXT,
  description TEXT,
  category TEXT,
  subcategory TEXT,
  stock INTEGER DEFAULT 0,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. CATEGORIES TABLOSU
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. COLLECTION_PRODUCTS TABLOSU
-- Ana sayfa koleksiyonları (yeni gelenler, çok satanlar, ödüllüler vb.)
CREATE TABLE IF NOT EXISTS public.collection_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  collection_type TEXT NOT NULL, -- 'new_arrivals', 'bestsellers', 'award_winning', 'world_literature', 'monthly_set'
  title TEXT NOT NULL,
  author TEXT,
  price DECIMAL(10,2),
  image_url TEXT,
  description TEXT,
  details JSONB DEFAULT '{}',
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. ORDERS TABLOSU
-- Siparişler
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  order_number TEXT UNIQUE NOT NULL DEFAULT to_char(now(), 'YYYYMMDD') || '-' || floor(random() * 90000 + 10000)::TEXT,
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'pending', -- 'pending', 'shipped', 'delivered'
  payment_status TEXT DEFAULT 'pending', -- 'pending', 'paid'
  shipping_address TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 7. ORDER_ITEMS TABLOSU
-- Sipariş kalemleri
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id TEXT,
  product_title TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  price_at_purchase DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) AYARLARI
-- ============================================================

-- Profiles RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Books RLS (herkese açık okuma)
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read books" ON public.books
  FOR SELECT USING (true);

-- Products RLS (herkese açık okuma)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read products" ON public.products
  FOR SELECT USING (true);

-- Categories RLS (herkese açık okuma)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read categories" ON public.categories
  FOR SELECT USING (true);

-- Collection Products RLS (herkese açık okuma)
ALTER TABLE public.collection_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read collection_products" ON public.collection_products
  FOR SELECT USING (true);

-- Orders RLS (sadece kendi siparişleri)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Order Items RLS
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own order items" ON public.order_items
  FOR SELECT USING (
    order_id IN (
      SELECT id FROM public.orders WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert order items" ON public.order_items
  FOR INSERT WITH CHECK (
    order_id IN (
      SELECT id FROM public.orders WHERE user_id = auth.uid()
    )
  );

-- ============================================================
-- TRIGGER: Yeni kullanıcı kaydolunca otomatik profil oluştur
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'phone'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Mevcut kullanıcınız için profil oluştur (eğer yoksa)
INSERT INTO public.profiles (id, full_name, phone)
SELECT id, raw_user_meta_data->>'full_name', raw_user_meta_data->>'phone'
FROM auth.users
ON CONFLICT (id) DO NOTHING;
