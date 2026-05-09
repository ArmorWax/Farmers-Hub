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

    const imagePreview = document.getElementById('imagePreview');
    const ideaImage = document.getElementById('ideaImage');

    ideaImage.addEventListener('change', function() {
        const file = this.files[0];
        imagePreview.innerHTML = '';
        if (file) {
            if (file.size > 1024 * 1024) { // 1MB limit
                alert('Image file is too large. Please choose an image smaller than 1MB.');
                this.value = '';
                return;
            }
            const reader = new FileReader();
            reader.onload = function(event) {
                const img = document.createElement('img');
                img.src = event.target.result;
                img.alt = 'Preview';
                img.className = 'preview-img';
                imagePreview.appendChild(img);
            };
            reader.onerror = function() {
                alert('Error loading image preview. Please try again.');
            };
            reader.readAsDataURL(file);
        }
    });

    document.getElementById('ideaForm').addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Feed form submitted');

        const idea = document.getElementById('ideaText').value;
        const caption = document.getElementById('ideaCaption').value;
        const file = document.getElementById('ideaImage').files[0];

        console.log('Form values:', { idea, caption, file });

        if (!idea.trim()) {
            alert('Please enter some text for your post');
            return;
        }

        const ideas = JSON.parse(localStorage.getItem('ideas')) || [];
        const newIdea = {
            id: Date.now() + Math.random(), // unique id
            user: currentUser.name,
            idea,
            caption,
            image: '',
            date: new Date().toISOString()
        };

        if (file) {
            console.log('Processing image file');
            const reader = new FileReader();
            reader.onload = function(event) {
                console.log('Image loaded successfully');
                newIdea.image = event.target.result;
                ideas.push(newIdea);
                localStorage.setItem('ideas', JSON.stringify(ideas));
                loadFarmIdeas();
                document.getElementById('ideaForm').reset();
                imagePreview.innerHTML = '';
                console.log('Post added with image');
            };
            reader.onerror = function() {
                console.error('Error reading file');
                alert('Error processing image. Please try again.');
            };
            reader.readAsDataURL(file);
        } else {
            console.log('Adding post without image');
            ideas.push(newIdea);
            localStorage.setItem('ideas', JSON.stringify(ideas));
            loadFarmIdeas();
            document.getElementById('ideaForm').reset();
            imagePreview.innerHTML = '';
            console.log('Post added without image');
        }
    });

    loadFarmIdeas();

    function loadFarmIdeas() {
        const ideas = JSON.parse(localStorage.getItem('ideas')) || [];
        const list = document.getElementById('ideasList');
        list.innerHTML = '';
        ideas.slice().reverse().forEach(i => {
            const li = document.createElement('li');
            li.className = 'post-card';
            let html = `
                <div class="post-header">
                    <strong>${i.user}</strong>
                    <span>${new Date(i.date).toLocaleDateString()}</span>`;
            if (i.user === currentUser.name) {
                html += `<button class="delete-btn" data-id="${i.id}"><i class="fas fa-trash"></i> Delete</button>`;
            }
            html += `</div>
                <p class="post-text">${i.idea}</p>`;
            if (i.caption) {
                html += `<p class="post-caption">${i.caption}</p>`;
            }
            if (i.image) {
                html += `<img class="post-image" src="${i.image}" alt="Idea image">`;
            }
            li.innerHTML = html;
            list.appendChild(li);
        });

        // Add event listeners for delete buttons
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseFloat(this.getAttribute('data-id'));
                const ideas = JSON.parse(localStorage.getItem('ideas')) || [];
                const updatedIdeas = ideas.filter(i => i.id !== id);
                localStorage.setItem('ideas', JSON.stringify(updatedIdeas));
                loadFarmIdeas();
            });
        });
    }
});