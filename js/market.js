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

    const market1 = document.getElementById('market1');
    const market2 = document.getElementById('market2');
    const markets = ['Cebu City Market', 'Mandaue Market', 'Lapu-lapu Market', 'Toledo Market'];
    markets.forEach(m => {
        const option1 = document.createElement('option');
        option1.value = m;
        option1.textContent = m;
        market1.appendChild(option1);
        const option2 = document.createElement('option');
        option2.value = m;
        option2.textContent = m;
        market2.appendChild(option2);
    });

    document.getElementById('searchBtn').addEventListener('click', function() {
        const query = document.getElementById('productQuery').value.toLowerCase();
        const prices = { 'rice': 50, 'corn': 30, 'banana': 20, 'mango': 60, 'coconut': 18 };
        const price = prices[query];
        document.getElementById('averagePrice').textContent = price ? `Average market price: ₱${price}` : 'Product not found in sample data.';
    });

    document.getElementById('compareBtn').addEventListener('click', function() {
        const m1 = market1.value;
        const m2 = market2.value;
        if (m1 && m2 && m1 !== m2) {
            document.getElementById('comparisonResult').textContent = `Comparison shows ${m1} is currently stronger for rice pricing than ${m2}.`;
        } else {
            document.getElementById('comparisonResult').textContent = 'Please select two different markets to compare.';
        }
    });

    document.getElementById('historyBtn').addEventListener('click', function() {
        const product = document.getElementById('historyProduct').value.toLowerCase();
        const histories = {
            'rice': [42, 44, 48, 50, 47, 51, 49, 52],
            'corn': [25, 27, 29, 30, 28, 32, 31, 33],
            'banana': [18, 20, 22, 20, 19, 21, 20, 22],
            'mango': [55, 58, 60, 62, 59, 61, 63, 65],
            'coconut': [15, 17, 16, 18, 17, 19, 18, 20]
        };
        const data = histories[product] || [42, 44, 48, 50, 47, 51, 49, 52];
        drawHistoryChart(data, product);
    });

    document.getElementById('predictBtn').addEventListener('click', function() {
        const product = document.getElementById('predictProduct').value || 'Selected crop';
        const current = Math.floor(Math.random() * 20) + 40;
        const predicted = Math.floor(Math.random() * 20) + 45;
        drawPredictionChart(current, predicted, product);
        document.getElementById('prediction').textContent = `Predicted next market price for ${product}: ₱${predicted}`;
    });

    function drawHistoryChart(data, product) {
        const ctx = document.getElementById('historyChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                datasets: [{
                    label: `${product} Price History (₱)`,
                    data: data,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: `${product.charAt(0).toUpperCase() + product.slice(1)} Price Trend`
                    }
                }
            }
        });
    }

    function drawPredictionChart(current, predicted, product) {
        const ctx = document.getElementById('predictChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Current Price', 'Predicted Price'],
                datasets: [{
                    label: `${product} Price (₱)`,
                    data: [current, predicted],
                    backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)'],
                    borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: `${product.charAt(0).toUpperCase() + product.slice(1)} Price Prediction`
                    }
                }
            }
        });
    }
});