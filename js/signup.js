const cities = [
    "Alcantara", "Alcoy", "Alegria", "Aloguinsan", "Argao", "Asturias", "Badian", "Balamban", "Bantayan", "Barili",
    "Bogo", "Boljoon", "Borbon", "Carcar", "Carmen", "Catmon", "Cebu City", "Compostela", "Consolacion", "Cordova",
    "Daanbantayan", "Dalaguete", "Danao", "Dumanjug", "Ginatilan", "Lapu-lapu", "Liloan", "Madridejos", "Malabuyoc",
    "Mandaue", "Medellin", "Minglanilla", "Moalboal", "Naga", "Oslob", "Pilar", "Pinamungahan", "Poro", "Ronda",
    "Samboan", "San Fernando", "San Francisco", "San Remegio", "Santa Fe", "Santander", "Sibonga", "Sogod", "Tabogon",
    "Tabuelan", "Talisay", "Toledo", "Tuburan", "Tudela"
];

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

    const citySelect = document.getElementById('city');
    const message = document.getElementById('message');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (currentUser) {
        window.location.href = 'dashboard.html';
        return;
    }

    cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        citySelect.appendChild(option);
    });

    citySelect.addEventListener('change', function() {
        if (citySelect.value) {
            message.textContent = `Great choice! ${citySelect.value} is now selected.`;
            message.classList.add('alert');
        } else {
            message.textContent = '';
            message.classList.remove('alert');
        }
    });

    const form = document.getElementById('signupForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const city = document.getElementById('city').value;
        const userType = document.getElementById('userType').value;

        const users = JSON.parse(localStorage.getItem('users')) || [];
        if (users.find(u => u.email === email)) {
            message.textContent = 'User already exists!';
            message.classList.add('alert');
            return;
        }

        const newUser = { name, email, password, city, userType, crops: 'No crops listed yet' };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        localStorage.setItem('toastMessage', `Welcome, ${name}! You are now logged in.`);
        localStorage.setItem('toastType', 'success');
        form.reset();
        window.location.href = 'dashboard.html';
    });
});