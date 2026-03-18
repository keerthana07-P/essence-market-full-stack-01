/**
 * auth.js — Centralized role-based navigation for EssenceMarket
 *
 * Usage: Include AFTER app.js on every page.
 *   <script src="app.js"></script>
 *   <script src="js/auth.js"></script>
 *
 * Exposed globals:
 *   goToProfile()   – navigate to the correct page based on role
 *   handleLogout()  – clear auth state and go home
 */

// ── Role helpers ─────────────────────────────────────────────────────────────
function getRole() {
    return localStorage.getItem('currentUserRole') || '';
}

/**
 * Returns the URL the profile button should navigate to.
 *   admin  → admin-dashboard.html
 *   user   → user-profile.html
 *   (none) → settings.html   (ask user to log in)
 */
/**
 * Returns the URL the profile button should navigate to.
 *   admin    → admin-dashboard.html
 *   customer → user-profile.html
 *   user     → user-profile.html
 *   (none)   → settings.html
 */
function getProfileUrl() {
    const role = getRole();
    if (role === 'admin') return 'admin-dashboard.html';
    if (role === 'user' || role === 'customer') return 'user-profile.html';
    return 'settings.html';
}

/** Navigate to the role-appropriate profile / dashboard page. */
function goToProfile() {
    window.location.href = getProfileUrl();
}

/** Clear auth state and return to entry page. */
function handleLogout() {
    localStorage.removeItem('currentUserRole');
    localStorage.removeItem('adminData');
    window.location.href = 'index.html';
}

/** Check if user is authenticated, otherwise redirect to entry. */
function checkAuth() {
    const role = getRole();
    const isPublicPage = window.location.pathname.endsWith('index.html') || 
                         window.location.pathname.endsWith('admin-login.html');
                         
    if (!role && !isPublicPage) {
        window.location.href = 'index.html';
    }
}

// ── Auto-wire all [data-profile-btn] elements on page load ────────────────────
document.addEventListener('DOMContentLoaded', function () {
    // Convert any <a data-profile-btn> to smart-routing buttons
    document.querySelectorAll('[data-profile-btn]').forEach(function (el) {
        el.addEventListener('click', function (e) {
            e.preventDefault();
            goToProfile();
        });
        // Update href too (for right-click / open-in-new-tab)
        if (el.tagName === 'A') el.href = getProfileUrl();
    });
});
