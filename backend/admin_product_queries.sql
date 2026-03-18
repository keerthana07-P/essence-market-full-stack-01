-- Essence Market: Admin Product Management SQL Utilities
-- Use these snippets in the Supabase SQL Editor for advanced management.

-- 1. VIEW CURRENT INVENTORY SUMMARY
-- Get a quick count by category and average price.
SELECT 
    category, 
    COUNT(*) as total_products, 
    ROUND(AVG(price), 2) as avg_price,
    SUM(CASE WHEN status = 'In Stock' THEN 1 ELSE 0 END) as in_stock_count,
    SUM(CASE WHEN status = 'Out of Stock' THEN 1 ELSE 0 END) as out_of_stock_count
FROM products
GROUP BY category
ORDER BY total_products DESC;


-- 2. BULK PRICE UPDATE (Category-wise)
-- Example: Increase price of all 'Relaxation Oils' by 10% for a seasonal sale.
-- UPDATE products 
-- SET price = price * 1.10
-- WHERE category = 'Relaxation Oils';


-- 3. MANAGE STOCK STATUS
-- Set specific products to 'Low Stock' based on custom logic.
UPDATE products
SET status = 'Low Stock'
WHERE title ILIKE '%Lavender%' AND status = 'In Stock';


-- 4. TOGGLE FEATURED PRODUCTS
-- Feature all high-rated products on the homepage.
-- Note: Assuming you track rating in a 'rating' column (optional field).
UPDATE products
SET is_featured = true
WHERE price > 500 AND status = 'In Stock';


-- 5. DATA CLEANUP & VALIDATION
-- Find products missing descriptions or images.
SELECT id, title, category FROM products
WHERE description IS NULL OR image_url IS NULL OR image_url = '';


-- 6. TOP SELLERS ANALYTICS (Requires Orders table join)
-- This shows which products are most popular.
SELECT 
    p.title, 
    COUNT(o.id) as order_count, 
    SUM(o.total_amount) as total_revenue
FROM products p
JOIN orders o ON o.product = p.title
GROUP BY p.title
ORDER BY total_revenue DESC
LIMIT 5;


-- 7. DELETE / ARCHIVE PRODUCTS
-- Use with caution!
-- DELETE FROM products WHERE status = 'Out of Stock' AND created_at < now() - interval '6 months';


-- 8. CATALOG EXPANSION (Run these to add more biological diversity to the store)
INSERT INTO products (title, description, price, category, image_url, status, badge, is_featured)
VALUES 
('Rosemary Essential Oil', 'Natural hair growth stimulator and cognitive enhancer.', 550.00, 'Hair Oils', 'rosemary_oil_1772640563345.png', 'In Stock', 'New', true),
('Sandalwood Essential Oil', 'Woody, sweet aroma for deep meditation and skin repair.', 750.00, 'Relaxation Oils', 'sandalwood_oil_1772640579938.png', 'In Stock', 'Premium', true),
('Jasmine Essential Oil', 'Exotic floral scent for emotional balance and skin elasticity.', 650.00, 'Relaxation Oils', 'jasmine_oil_1772640603190.png', 'In Stock', 'Premium', false),
('Frankincense Oil', 'The "King of Oils" for immunity and youthful skin.', 800.00, 'Aromatherapy Oils', 'frankincense_oil_1772640621546.png', 'In Stock', 'Premium', true),
('Eucalyptus Oil', 'Refreshing scent for respiratory support and clearing mind.', 380.00, 'Aromatherapy Oils', 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&q=80&w=800', 'In Stock', '', false);
