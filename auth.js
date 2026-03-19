/**
 * Bouncrrr Global Auth & Nav Utility
 */

// Initialize global namespace early
window.bouncrrrAuth = window.bouncrrrAuth || {};

document.addEventListener('DOMContentLoaded', () => {
    console.log('Bouncrrr Auth: Initializing navbar state...');
    window.bouncrrrAuth.updateNavbarState();
    setupGlobalListeners();
});

window.bouncrrrAuth.updateNavbarState = function() {
    const userEmail = localStorage.getItem('userEmail');
    const loginLink = document.getElementById('login-link');
    const userMenu = document.getElementById('user-menu-container');
    const dropdownEmail = document.getElementById('dropdown-email');
    const getStartedElements = document.querySelectorAll('[data-get-started]');

    console.log('Bouncrrr Auth: Updating state for', userEmail || 'guest');

    if (userEmail) {
        if (loginLink) loginLink.style.display = 'none';
        if (userMenu) {
            userMenu.style.display = 'block';
            userMenu.style.visibility = 'visible'; // Ensure visibility
            userMenu.style.opacity = '1';
        }
        if (dropdownEmail) dropdownEmail.textContent = userEmail;
        
        // Hide get started buttons if logged in
        getStartedElements.forEach(el => el.style.display = 'none');
    } else {
        if (loginLink) {
            loginLink.style.display = 'inline-block';
            loginLink.style.visibility = 'visible';
        }
        if (userMenu) userMenu.style.display = 'none';
        
        getStartedElements.forEach(el => el.style.display = '');
    }
};

/**
 * Global utility to hide Get Started elements based on subscription status
 */
window.bouncrrrAuth.updateSubscriptionUI = function(hasValidSubscription) {
    console.log('Bouncrrr Auth: Updating subscription UI, hasValidSubscription:', hasValidSubscription);
    const getStartedElements = document.querySelectorAll('[data-get-started]');
    if (hasValidSubscription) {
        getStartedElements.forEach(el => {
            el.dataset.forceHide = "true";
            el.style.display = 'none';
        });
        window.bouncrrrAuth.updateSubscribedCTA(true);
    } else {
        const userEmail = localStorage.getItem('userEmail');
        getStartedElements.forEach(el => {
            delete el.dataset.forceHide;
            el.style.display = userEmail ? 'none' : '';
        });
        window.bouncrrrAuth.updateSubscribedCTA(false);
    }
};

/**
 * Update the bottom CTA text for subscribed users
 */
window.bouncrrrAuth.updateSubscribedCTA = function(isSubscribed) {
    const ctaTitle = document.getElementById('cta-title');
    const ctaSubtitle = document.getElementById('cta-subtitle');
    
    if (ctaTitle && ctaSubtitle) {
        if (isSubscribed) {
            ctaTitle.textContent = "thank you for being part of the bouncrrr community!";
            ctaSubtitle.style.display = 'none';
        } else {
            ctaTitle.textContent = "ready to stop babysitting?";
            ctaSubtitle.style.display = 'block';
        }
    }
};

function setupGlobalListeners() {
    const logoutBtn = document.getElementById('dropdown-logout');
    if (logoutBtn) {
        logoutBtn.removeEventListener('click', window.bouncrrrAuth.handleLogout);
        logoutBtn.addEventListener('click', window.bouncrrrAuth.handleLogout);
    }

    // Dropdown toggle
    const menuBtn = document.getElementById('user-menu-button');
    const dropdown = document.getElementById('user-menu-dropdown');
    
    if (menuBtn && dropdown) {
        // Robust toggle for mobile
        const toggleDropdown = (e) => {
            if (e) e.stopPropagation();
            const isHidden = dropdown.classList.contains('hidden');
            if (isHidden) {
                dropdown.classList.remove('hidden');
                dropdown.style.display = 'block';
            } else {
                dropdown.classList.add('hidden');
                dropdown.style.display = 'none';
            }
        };

        menuBtn.addEventListener('mousedown', toggleDropdown); // Use mousedown for faster response on some mobile touch wrappers
        menuBtn.addEventListener('click', (e) => e.preventDefault()); // Prevent default to avoid side effects

        document.addEventListener('click', (e) => {
            if (!menuBtn.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.classList.add('hidden');
                dropdown.style.display = 'none';
            }
        });
    }

    // Dynamic copyright year
    const yearEl = document.getElementById('current-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
}

window.bouncrrrAuth.handleLogout = function(e) {
    if (e) e.preventDefault();
    console.log('Bouncrrr Auth: Logging out...');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userToken');
    localStorage.removeItem('paddleCustomerId');
    // Ensure login link is visible again before redirecting or on reload
    const loginLink = document.getElementById('login-link');
    if (loginLink) loginLink.style.display = 'inline-block';
    window.location.href = 'index.html';
};
