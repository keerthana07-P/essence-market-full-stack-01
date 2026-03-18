-- Essence Market: Supabase Schema Setup
-- WARNING: Running this will drop existing tables to ensure a clean state.

-- Drop existing tables (in order of dependencies)
DROP TABLE IF EXISTS wishlist CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS products CASCADE;

-- 1. Create Products Table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category TEXT,
    image_url TEXT,
    status TEXT DEFAULT 'In Stock',
    badge TEXT,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create Orders Table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id TEXT UNIQUE NOT NULL,
    customer_info JSONB,
    customer_name TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    total_amount DECIMAL(10, 2) NOT NULL,
    status TEXT DEFAULT 'Pending',
    product TEXT,
    quantity INTEGER,
    unit_price DECIMAL(10, 2),
    created_by TEXT DEFAULT 'Customer',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Create Profiles Table
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone TEXT,
    address TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'user',
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Create Wishlist Table
CREATE TABLE wishlist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email TEXT NOT NULL,
    product_title TEXT NOT NULL,
    product_price DECIMAL(10, 2),
    product_image TEXT,
    product_category TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_email, product_title)
);

-- 5. Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;

-- 6. Policies
CREATE POLICY "Allow public read" ON products FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON orders FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read" ON profiles FOR SELECT USING (true);
CREATE POLICY "Allow public all" ON profiles FOR ALL USING (true); -- Simplification for demo
CREATE POLICY "Allow public all" ON wishlist FOR ALL USING (true); -- Simplification for demo
CREATE POLICY "Allow all for authenticated" ON products FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated" ON orders FOR ALL USING (true);

-- 7. Initial Seed Data
INSERT INTO products (title, description, price, category, image_url, status, badge, is_featured)
VALUES 
('Lavender Essential Oil', 'Relaxation and stress relief', 499, 'Relaxation Oils', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSvXIo0NbdUdXH9XE2aecVPvoFw8pWCnX0BUBYyZLRGGCZKIVtYc3qWCkaYQnXqSnSb2QrSP6pfKfVYa3Ht5-BiImBHnww7lrbPS9oHxrTZYTJz53idVgGsqZ2_PfsnOgTdC7dUYik1vteoUFad-QQ4wGhLXcQ72BxW4iUG85jNnGVmEUfuJuMBN13lmz9hdEuN2x2yWB0NdkZIf8MV67OB_zTdpxtobDjYUi-4PAWKoYb-6--miRLamcWyJwRircQeK7Ei_ZGTV4', 'In Stock', 'Best Seller', true),
('Peppermint Essential Oil', 'Cooling and headache relief', 450, 'Aromatherapy Oils', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCftbvjs2IAGnR6Mpb-uere8LyoViZaaNg4GLRd19pvkbomRueBpalJEVGoE-S37k60ZDEF-XnvKP27eNKYzLkDfSfNwU_WYgeg9ixfliEZC8sdJRCVmo0ZNatne019c6pMQXsAbD1J2tweCm1v_BYQw49U4oAnYNcRMdH_nhj7JRKkMTdFDo5usaWPZ-T_I0LU_Xo6ZK-4AFnZCNaOw-pMxrdUslRh8Cyk3737JUIVhPe5hLN2RukCTW-vbaShmgCXj_753ljMSTs', 'In Stock', 'Best Seller', true),
('Tea Tree Oil', 'Skin care and antibacterial', 420, 'Skin Care Oils', 'tea_tree_oil_1772640523525.png', 'Low Stock', '', true),
('Lemon Essential Oil', 'Refreshing and cleansing', 350, 'Relaxation Oils', 'lemon_oil_1772640545820.png', 'In Stock', 'New', false),
('Rosemary Essential Oil', 'Natural hair growth stimulator and cognitive enhancer.', 550, 'Hair Oils', 'rosemary_oil_1772640563345.png', 'In Stock', 'New', true),
('Sandalwood Essential Oil', 'Woody, sweet aroma for deep meditation and skin repair.', 750, 'Relaxation Oils', 'sandalwood_oil_1772640579938.png', 'In Stock', 'Premium', true),
('Jasmine Essential Oil', 'Exotic floral scent for emotional balance and skin elasticity.', 650, 'Relaxation Oils', 'jasmine_oil_1772640603190.png', 'In Stock', 'Premium', false),
('Frankincense Oil', 'The "King of Oils" for immunity and youthful skin.', 800, 'Aromatherapy Oils', 'frankincense_oil_1772640621546.png', 'In Stock', 'Premium', true);
