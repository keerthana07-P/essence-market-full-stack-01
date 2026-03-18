/**
 * supabase_client.js
 * Centralized Supabase configuration and services.
 */

// Initialize Supabase (Using credentials from conversation history)
const SUPABASE_URL = 'https://raxlmffmhdlwmotsdmgm.supabase.co';
const SUPABASE_KEY = 'sb_publishable_nBGQurYSMBw3DfpRw7_vLA_LiIL6KIW'; 

// Note: In a real production app, use the Supabase JS SDK. 
// For this demo, we'll use the REST API via fetch for maximum compatibility.

const supabase = {
    async fetchProducts() {
        try {
            const response = await fetch(`${SUPABASE_URL}/rest/v1/products?select=*`, {
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch products');
            return await response.json();
        } catch (err) {
            console.error('Supabase Product Fetch Error:', err);
            // Fallback to localStorage if Supabase is not configured
            return JSON.parse(localStorage.getItem('products') || '[]');
        }
    },

    async saveProduct(product) {
        try {
            const isNew = !product.id;
            const method = isNew ? 'POST' : 'PATCH';
            const url = isNew ? `${SUPABASE_URL}/rest/v1/products` : `${SUPABASE_URL}/rest/v1/products?id=eq.${product.id}`;
            
            const response = await fetch(url, {
                method: method,
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=representation'
                },
                body: JSON.stringify(product)
            });
            return await response.json();
        } catch (err) {
            console.error('Supabase Save Error:', err);
        }
    },

    async deleteProduct(id) {
        try {
            await fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${id}`, {
                method: 'DELETE',
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`
                }
            });
        } catch (err) {
            console.error('Supabase Delete Error:', err);
        }
    },

    async fetchOrders() {
        try {
            const response = await fetch(`${SUPABASE_URL}/rest/v1/orders?select=*`, {
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch orders');
            const data = await response.json();
            
            let localOrders = JSON.parse(localStorage.getItem('essenceOrders') || '[]');
            const localOrderIds = new Set(localOrders.map(o => String(o.orderId)));
            
            // Merge remote items safely into local orders
            for (const r of data) {
                if (!localOrderIds.has(String(r.orderId))) {
                    localOrders.push(r);
                }
            }
            localStorage.setItem('essenceOrders', JSON.stringify(localOrders));
            return localOrders;
        } catch (err) {
            console.error('Supabase Order Fetch Error:', err);
            return JSON.parse(localStorage.getItem('essenceOrders') || '[]');
        }
    },

    async saveOrder(order) {
        let localOrders = JSON.parse(localStorage.getItem('essenceOrders') || '[]');
        const isNew = !order.id;
        
        if (isNew) {
            order.id = 'LOC-' + Math.random().toString(36).substr(2, 9);
            localOrders.unshift(order);
        } else {
            const index = localOrders.findIndex(o => String(o.id) === String(order.id));
            if (index > -1) {
                localOrders[index] = order;
            } else {
                localOrders.unshift(order);
            }
        }
        localStorage.setItem('essenceOrders', JSON.stringify(localOrders));

        try {
            const method = isNew ? 'POST' : 'PATCH';
            const payload = { ...order };
            if (isNew && typeof payload.id === 'string' && payload.id.startsWith('LOC-')) {
                delete payload.id;
            }
            const url = isNew ? `${SUPABASE_URL}/rest/v1/orders` : `${SUPABASE_URL}/rest/v1/orders?id=eq.${order.id}`;
            
            await fetch(url, {
                method: method,
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=representation'
                },
                body: JSON.stringify(payload)
            });
        } catch (err) {
            console.error('Supabase Save Order Error:', err);
        }
    },

    async deleteOrder(id) {
        let localOrders = JSON.parse(localStorage.getItem('essenceOrders') || '[]');
        localOrders = localOrders.filter(o => String(o.id) !== String(id));
        localStorage.setItem('essenceOrders', JSON.stringify(localOrders));

        try {
            await fetch(`${SUPABASE_URL}/rest/v1/orders?id=eq.${id}`, {
                method: 'DELETE',
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`
                }
            });
        } catch (err) {
            console.error('Supabase Order Delete Error:', err);
        }
    },

    // --- Profile Service ---
    async fetchProfile(email) {
        try {
            const response = await fetch(`${SUPABASE_URL}/rest/v1/profiles?email=eq.${email}&select=*`, {
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`
                }
            });
            const data = await response.json();
            return data[0] || null;
        } catch (err) {
            console.error('Supabase Profile Fetch Error:', err);
            return null;
        }
    },

    async saveProfile(profile) {
        try {
            const existing = await this.fetchProfile(profile.email);
            const method = existing ? 'PATCH' : 'POST';
            const url = existing ? `${SUPABASE_URL}/rest/v1/profiles?email=eq.${profile.email}` : `${SUPABASE_URL}/rest/v1/profiles`;
            
            await fetch(url, {
                method: method,
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=representation'
                },
                body: JSON.stringify(profile)
            });
        } catch (err) {
            console.error('Supabase Profile Save Error:', err);
        }
    },

    // --- Wishlist Service ---
    async fetchWishlist(email) {
        try {
            const response = await fetch(`${SUPABASE_URL}/rest/v1/wishlist?user_email=eq.${email}&select=*`, {
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`
                }
            });
            return await response.json();
        } catch (err) {
            console.error('Supabase Wishlist Fetch Error:', err);
            return [];
        }
    },

    async saveWishlistItem(item) {
        try {
            await fetch(`${SUPABASE_URL}/rest/v1/wishlist`, {
                method: 'POST',
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'resolution=merge-duplicates'
                },
                body: JSON.stringify(item)
            });
        } catch (err) {
            console.error('Supabase Wishlist Save Error:', err);
        }
    },

    async deleteWishlistItem(email, title) {
        try {
            await fetch(`${SUPABASE_URL}/rest/v1/wishlist?user_email=eq.${email}&product_title=eq.${title}`, {
                method: 'DELETE',
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`
                }
            });
        } catch (err) {
            console.error('Supabase Wishlist Delete Error:', err);
        }
    }
};

window.SupabaseClient = supabase;
