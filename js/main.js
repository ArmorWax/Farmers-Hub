// Main JavaScript file for SugbUma
document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation toggle
    const navToggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('nav');

    if (navToggle && nav) {
        navToggle.addEventListener('click', function(e) {
            e.preventDefault();
            nav.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        nav.addEventListener('click', function(e) {
            if (e.target.closest('a')) {
                nav.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!nav.contains(e.target) && !navToggle.contains(e.target)) {
                nav.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });

        // Prevent mobile menu from interfering with form interactions
        document.addEventListener('touchstart', function(e) {
            if (nav.classList.contains('active') && !nav.contains(e.target) && !navToggle.contains(e.target)) {
                nav.classList.remove('active');
                navToggle.classList.remove('active');
            }
        }, { passive: true });
    }

    function setActiveNavLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('nav a[href]').forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage || (currentPage === '' && href === 'index.html')) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            }
        });
    }

    function createToastContainer() {
        if (!document.getElementById('toastContainer')) {
            const container = document.createElement('div');
            container.id = 'toastContainer';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
    }

    function showToast(message, type = 'success') {
        createToastContainer();
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        container.appendChild(toast);
        requestAnimationFrame(() => toast.classList.add('visible'));
        setTimeout(() => toast.classList.remove('visible'), 3600);
        setTimeout(() => toast.remove(), 4200);
    }

    window.showToast = showToast;

    function consumeToast() {
        const message = localStorage.getItem('toastMessage');
        if (message) {
            showToast(message, localStorage.getItem('toastType') || 'success');
            localStorage.removeItem('toastMessage');
            localStorage.removeItem('toastType');
        }
    }

    function getCurrentUser() {
        return JSON.parse(localStorage.getItem('currentUser'));
    }

    function handleLogout(event) {
        if (event) event.preventDefault();
        localStorage.removeItem('currentUser');
        localStorage.setItem('toastMessage', 'You have been logged out.');
        localStorage.setItem('toastType', 'success');
        window.location.href = 'index.html';
    }

    function updateAuthNav() {
        const currentUser = getCurrentUser();
        const loginLink = document.querySelector('nav a[href="login.html"]');
        const signupLink = document.querySelector('nav a[href="signup.html"]');
        const cartLink = document.querySelector('nav #navCartLink');
        const logoutLink = document.querySelector('nav a#globalLogout') || document.querySelector('nav a#logoutLink');

        if (currentUser) {
            if (loginLink) loginLink.style.display = 'none';
            if (signupLink) signupLink.style.display = 'none';
            if (cartLink) cartLink.style.display = '';
            if (!logoutLink) {
                const navLink = document.createElement('a');
                navLink.href = '#';
                navLink.id = 'globalLogout';
                navLink.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout';
                nav.appendChild(navLink);
                navLink.addEventListener('click', handleLogout);
            } else {
                logoutLink.style.display = '';
                logoutLink.addEventListener('click', handleLogout);
            }
        } else {
            if (loginLink) loginLink.style.display = '';
            if (signupLink) signupLink.style.display = '';
            if (cartLink) cartLink.style.display = 'none';
            if (logoutLink) logoutLink.remove();
        }
    }

    function getCartItems() {
        const user = getCurrentUser();
        const key = user ? `cart_${user.email}` : 'cart_guest';
        return JSON.parse(localStorage.getItem(key)) || [];
    }

    function updateCartCount() {
        const cartCount = document.getElementById('navCartCount');
        if (cartCount) {
            const items = getCartItems();
            const qty = items.reduce((sum, item) => sum + item.qty, 0);
            cartCount.textContent = qty;
        }
    }

    setActiveNavLink();
    updateAuthNav();
    consumeToast();
    updateCartCount();

    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.style.display = 'block';
            } else {
                backToTopBtn.style.display = 'none';
            }
        });

        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});