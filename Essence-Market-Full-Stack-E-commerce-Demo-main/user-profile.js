/**
 * user-profile.js
 * Handles: sidebar toggle + profile card display across all pages (index, explore)
 * NOTE: The actual profile form save/load is now embedded inside user-profile.html directly.
 */

// ─── Storage Helpers ─────────────────────────────────────────────────────────
const getCurrentUserRole = () => localStorage.getItem('currentUserRole') || '';

const getUserData = () => {
    const raw = JSON.parse(localStorage.getItem('userData') || '{}');
    // Support both new keys (userName / userEmail) and legacy keys (name / email)
    return {
        name:         raw.userName    || raw.name    || '',
        email:        raw.userEmail   || raw.email   || '',
        phone:        raw.userPhone   || raw.phone   || '',
        address:      raw.userAddress || '',
        profileImage: raw.userAvatar  || raw.profileImage || null,
    };
};

const getAdminData = () => JSON.parse(localStorage.getItem('adminData') || '{}');

// ─── Sidebar open / close ────────────────────────────────────────────────────
function initSidebar() {
    const sidebar = document.getElementById('user-sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const openBtn = document.getElementById('hamburger-btn');
    const closeBtn = document.getElementById('sidebar-close-btn');

    if (!sidebar) return;

    function openSidebar() {
        sidebar.style.transform = 'translateX(0)';
        if (overlay) overlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    function closeSidebar() {
        sidebar.style.transform = 'translateX(-100%)';
        if (overlay) overlay.classList.add('hidden');
        document.body.style.overflow = '';
    }

    openBtn?.addEventListener('click', openSidebar);
    closeBtn?.addEventListener('click', closeSidebar);
    overlay?.addEventListener('click', closeSidebar);

    loadSidebarProfile();
}

// ─── Populate sidebar profile card ───────────────────────────────────────────
function loadSidebarProfile() {
    const role = getCurrentUserRole();
    let profile = {};

    if (role === 'admin') {
        const admin = getAdminData();
        profile = { name: 'Admin', email: admin.email || 'admin@essencemarket.com', profileImage: null };
    } else if (role === 'user') {
        profile = getUserData();
    }

    const cardName     = document.getElementById('sidebar-name');
    const cardEmail    = document.getElementById('sidebar-email');
    const cardPic      = document.getElementById('sidebar-pic');
    const cardInitials = document.getElementById('sidebar-initials');
    const cardPhone    = document.getElementById('sidebar-phone');
    const guestMsg     = document.getElementById('sidebar-guest');
    const profileCard  = document.getElementById('sidebar-profile-card');

    const hasProfile = !!(profile.name || profile.email || role === 'admin');

    if (guestMsg)    guestMsg.classList.toggle('hidden', hasProfile);
    if (profileCard) profileCard.classList.toggle('hidden', !hasProfile);

    if (hasProfile) {
        if (cardName)  cardName.textContent  = profile.name  || (role === 'admin' ? 'Admin' : 'User');
        if (cardEmail) cardEmail.textContent = profile.email || '';

        if (cardPhone) {
            if (profile.phone) {
                cardPhone.textContent = profile.phone;
                cardPhone.parentElement?.classList.remove('hidden');
            } else {
                cardPhone.parentElement?.classList.add('hidden');
            }
        }

        if (profile.profileImage && cardPic && role !== 'admin') {
            cardPic.src = profile.profileImage;
            cardPic.classList.remove('hidden');
            cardInitials && cardInitials.classList.add('hidden');
        } else {
            cardPic && cardPic.classList.add('hidden');
            if (cardInitials) {
                cardInitials.textContent = role === 'admin' ? 'A' : (profile.name ? profile.name.charAt(0).toUpperCase() : '🌿');
                cardInitials.classList.remove('hidden');
            }
        }
    }
}

// ─── Logout ──────────────────────────────────────────────────────────────────
function handleLogout() {
    localStorage.removeItem('currentUserRole');
    window.location.href = 'index.html';
}

// ─── Init on DOMContentLoaded ────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    initSidebar();
});
