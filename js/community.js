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

    document.getElementById('forumForm').addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Forum form submitted');

        const topic = document.getElementById('forumTopic').value;
        const message = document.getElementById('forumMessage').value;

        console.log('Forum form values:', { topic, message });

        if (!topic.trim()) {
            alert('Please enter a topic');
            return;
        }

        if (!message.trim()) {
            alert('Please enter a message');
            return;
        }

        const posts = JSON.parse(localStorage.getItem('forumPosts')) || [];
        posts.push({ user: currentUser.name, topic, message, date: new Date().toISOString() });
        localStorage.setItem('forumPosts', JSON.stringify(posts));
        loadForum();
        document.getElementById('forumForm').reset();
        console.log('Forum post added successfully');
    });

    function loadForum() {
        const posts = JSON.parse(localStorage.getItem('forumPosts')) || [];
        const list = document.getElementById('forumList');
        list.innerHTML = '';
        posts.slice().reverse().forEach(p => {
            const li = document.createElement('li');
            li.className = 'post-card';
            li.innerHTML = `
                <div class="post-header">
                    <strong>${p.topic}</strong>
                    <span>${new Date(p.date).toLocaleDateString()}</span>
                </div>
                <p class="post-text">${p.message}</p>
                <p class="post-caption">Posted by ${p.user}</p>`;
            list.appendChild(li);
        });
    }

    loadForum();
});