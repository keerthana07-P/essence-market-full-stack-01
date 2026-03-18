// app.js - Centralized State Management

const getCart = () => JSON.parse(localStorage.getItem('cart') || '[]');
const saveCart = (cart) => localStorage.setItem('cart', JSON.stringify(cart));

const getWishlist = () => JSON.parse(localStorage.getItem('wishlist') || '[]');
const saveWishlist = (wishlist) => localStorage.setItem('wishlist', JSON.stringify(wishlist));

const formatINR = (num) => '₹' + num.toLocaleString('en-IN');

const updateCartBadge = () => {
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badges = document.querySelectorAll('.cart-badge, #cart-badge'); // Support multiple badges
    
    badges.forEach(badge => {
        if (count > 0) {
            badge.textContent = count;
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    });
};

const updateWishlistBadge = async () => {
    const d = JSON.parse(localStorage.getItem('userData') || '{}');
    const email = d.userEmail || '';
    
    let count = getWishlist().length;

    // If logged in, sync with Supabase and update count
    if (email && window.SupabaseClient) {
        try {
            const remoteWishlist = await window.SupabaseClient.fetchWishlist(email);
            if (remoteWishlist && remoteWishlist.length > 0) {
                // Merge/Sync logic: for now, remote takes precedence if it exists
                saveWishlist(remoteWishlist.map(item => ({
                    title: item.product_title,
                    price: item.product_price,
                    image: item.product_image,
                    category: item.product_category
                })));
                count = remoteWishlist.length;
            }
        } catch (err) {
            console.error('Wishlist Sync Error:', err);
        }
    }

    const badges = document.querySelectorAll('.wishlist-badge, #wishlist-badge-nav');
    
    badges.forEach(badge => {
        if (count > 0) {
            badge.textContent = count;
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    });
};

const syncWishlistItem = async (product, action) => {
    const d = JSON.parse(localStorage.getItem('userData') || '{}');
    const email = d.userEmail || '';

    if (email && window.SupabaseClient) {
        try {
            if (action === 'add') {
                await window.SupabaseClient.saveWishlistItem({
                    user_email: email,
                    product_title: product.title,
                    product_price: product.price,
                    product_image: product.image,
                    product_category: product.category
                });
            } else {
                await window.SupabaseClient.deleteWishlistItem(email, product.title);
            }
        } catch (err) {
            console.error('Wishlist Remote Sync Error:', err);
        }
    }
};

// Calculate Cart Totals
const getCartTotals = () => {
    const cart = getCart();
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = Math.round(subtotal * 0.08); // 8% mock tax
    const total = subtotal + tax;
    
    return { subtotal, tax, total };
};

// Global init to ensure badges are correct across all pages
document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge();
    updateWishlistBadge();
});
