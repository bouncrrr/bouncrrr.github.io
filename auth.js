/**
 * Bouncrrr Global Auth & Nav Utility
 */

document.addEventListener('DOMContentLoaded', () => {
    updateNavbarState();
    setupGlobalListeners();
});

function updateNavbarState() {
    const userEmail = localStorage.getItem('userEmail');
    const loginLink = document.getElementById('login-link');
    const loginStatus = document.getElementById('login-status');
    const logoutBtn = document.getElementById('logout-button');
    const accountLink = document.getElementById('account-link');

    if (userEmail) {
        if (loginLink) loginLink.style.display = 'none';
        if (loginStatus) {
            loginStatus.textContent = `logged in as ${userEmail} | `;
            loginStatus.style.display = 'inline';
        }
        if (logoutBtn) logoutBtn.style.display = 'inline';
        if (accountLink) accountLink.style.display = 'inline';
    } else {
        if (loginLink) loginLink.style.display = 'inline';
        if (loginStatus) loginStatus.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'none';
        if (accountLink) accountLink.style.display = 'none';
    }
}

function setupGlobalListeners() {
    const logoutBtn = document.getElementById('logout-button');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Dynamic copyright year
    const yearEl = document.getElementById('current-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
}

function handleLogout(e) {
    if (e) e.preventDefault();
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userToken');
    localStorage.removeItem('paddleCustomerId');
    window.location.href = 'index.html';
}

// Export for use in specific pages if needed
window.bouncrrrAuth = {
    updateNavbarState,
    handleLogout
};
