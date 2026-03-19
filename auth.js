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
    const accountLink = document.getElementById('account-link') || document.getElementById('manage-account');
    const getStartedElements = document.querySelectorAll('[data-get-started]');

    if (userEmail) {
        if (loginLink) loginLink.style.display = 'none';
        if (loginStatus) {
            loginStatus.textContent = `logged in as ${userEmail} | `;
            loginStatus.style.display = 'inline';
        }
        if (logoutBtn) logoutBtn.style.display = 'inline';
        if (accountLink) accountLink.style.display = 'inline';
        
        // Hide get started buttons if logged in (or if we have more specific subscription state, handle that in updateSubscriptionUI)
        getStartedElements.forEach(el => el.style.display = 'none');
    } else {
        if (loginLink) loginLink.style.display = 'inline';
        if (loginStatus) loginStatus.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'none';
        if (accountLink) accountLink.style.display = 'none';
        
        getStartedElements.forEach(el => el.style.display = '');
    }
}

/**
 * Global utility to hide Get Started elements based on subscription status
 */
window.bouncrrrAuth.updateSubscriptionUI = function(hasValidSubscription) {
    const getStartedElements = document.querySelectorAll('[data-get-started]');
    if (hasValidSubscription) {
        getStartedElements.forEach(el => el.style.display = 'none');
    } else if (!localStorage.getItem('userEmail')) {
        getStartedElements.forEach(el => el.style.display = '');
    }
};

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
