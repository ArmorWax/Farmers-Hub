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

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        window.location.href = 'dashboard.html';
        return;
    }

    const form = document.getElementById('loginForm');
    const message = document.getElementById('message');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    [emailInput, passwordInput].forEach(input => {
        input.addEventListener('input', function() {
            message.textContent = '';
        });
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = emailInput.value;
        const password = passwordInput.value;

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            localStorage.setItem('toastMessage', `Welcome back, ${user.name}!`);
            localStorage.setItem('toastType', 'success');
            window.location.href = 'dashboard.html';
        } else {
            message.textContent = 'Invalid credentials! Please check email and password.';
            message.classList.add('alert');
        }
    });
});