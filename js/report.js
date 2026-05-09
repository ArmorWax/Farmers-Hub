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
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    document.getElementById('reportForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const vendor = document.getElementById('vendor').value;
        const product = document.getElementById('productReported').value;
        const price = document.getElementById('reportedPrice').value;
        const reports = JSON.parse(localStorage.getItem('reports')) || [];
        reports.push({
            vendor,
            product,
            price,
            reporter: currentUser.name,
            date: new Date().toISOString()
        });
        localStorage.setItem('reports', JSON.stringify(reports));
        document.getElementById('reportMessage').textContent = 'Report submitted successfully.';
        loadReports();
        document.getElementById('reportForm').reset();
    });

    function loadReports() {
        const reports = JSON.parse(localStorage.getItem('reports')) || [];
        const list = document.getElementById('reportList');
        list.innerHTML = '';
        reports.slice().reverse().forEach(r => {
            const li = document.createElement('li');
            li.className = 'post-card';
            li.innerHTML = `
                <div class="post-header">
                    <strong>${r.vendor}</strong>
                    <span>${new Date(r.date).toLocaleDateString()}</span>
                </div>
                <p class="post-text">${r.product} reported at ₱${r.price} by ${r.reporter}.</p>`;
            list.appendChild(li);
        });
    }

    loadReports();
});