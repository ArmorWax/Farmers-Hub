function get(id) {
    return document.getElementById(id);
}

document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    const getLocal = id => document.getElementById(id);
    const userName = getLocal('userName');
    const userCity = getLocal('userCity');
    const userType = getLocal('userType');

    if (userName) userName.textContent = currentUser.name;
    if (userCity) userCity.textContent = currentUser.city;
    if (userType) userType.textContent = currentUser.userType;

    const logoutBtn = get('logoutBtn');
    const logoutLink = get('logoutLink');
    [logoutBtn, logoutLink].forEach(element => {
        if (element) {
            element.addEventListener('click', function() {
                localStorage.removeItem('currentUser');
                window.location.href = 'index.html';
            });
        }
    });

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

    const profileName = get('profileName');
    const profileLocation = get('profileLocation');
    const profileRole = get('profileRole');
    const profileCrops = get('profileCrops');
    const profilePic = get('profilePic');

    // Load profile data
    function loadProfile() {
        if (profileName) profileName.textContent = currentUser.name || '';
        if (profileLocation) profileLocation.textContent = currentUser.city || '';
        if (profileRole) profileRole.textContent = currentUser.userType || '';
        if (profileCrops) profileCrops.textContent = currentUser.crops || 'None';
        if (profilePic && currentUser.profilePic) {
            profilePic.src = currentUser.profilePic;
        } else if (profilePic) {
            profilePic.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNTAiIGZpbGw9IiMxMjVhNTMiLz48dGV4dCB4PSI1MCIgeT0iNTUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjQwIj5VP0wvdGV4dD48L3N2Zz4='; // Default avatar
        }
    }
    loadProfile();

    const editProfileBtn = get('editProfile');
    const profileDisplay = get('profileDisplay');
    const profileEdit = get('profileEdit');
    const editName = get('editName');
    const editCity = get('editCity');
    const editUserType = get('editUserType');
    const editCrops = get('editCrops');
    const saveProfileBtn = get('saveProfile');
    const cancelEditBtn = get('cancelEdit');

    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', function() {
            // Show edit form, hide display
            if (profileDisplay) profileDisplay.style.display = 'none';
            if (profileEdit) profileEdit.style.display = 'block';
            // Populate edit fields
            if (editName) editName.value = currentUser.name || '';
            if (editCity) editCity.value = currentUser.city || '';
            if (editUserType) editUserType.value = currentUser.userType || 'farmer';
            if (editCrops) editCrops.value = currentUser.crops || '';
        });
    }

    if (saveProfileBtn) {
        saveProfileBtn.addEventListener('click', function() {
            // Update currentUser
            currentUser.name = editName.value;
            currentUser.city = editCity.value;
            currentUser.userType = editUserType.value;
            currentUser.crops = editCrops.value;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            // Update display
            loadProfile();
            // Update welcome section
            if (userName) userName.textContent = currentUser.name;
            if (userCity) userCity.textContent = currentUser.city;
            if (userType) userType.textContent = currentUser.userType;
            // Hide edit, show display
            if (profileEdit) profileEdit.style.display = 'none';
            if (profileDisplay) profileDisplay.style.display = 'block';
        });
    }

    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', function() {
            // Hide edit, show display
            if (profileEdit) profileEdit.style.display = 'none';
            if (profileDisplay) profileDisplay.style.display = 'block';
        });
    }

    // Profile picture handling
    const changePicBtn = get('changePicBtn');
    const profilePicInput = get('profilePicInput');

    if (changePicBtn && profilePicInput) {
        changePicBtn.addEventListener('click', function() {
            profilePicInput.click();
        });

        profilePicInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    const dataUrl = event.target.result;
                    profilePic.src = dataUrl;
                    currentUser.profilePic = dataUrl;
                    localStorage.setItem('currentUser', JSON.stringify(currentUser));
                };
                reader.readAsDataURL(file);
            }
        });
    }

    const harvestForm = get('harvestForm');
    if (harvestForm) {
        harvestForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const crop = get('crop').value;
            const date = get('harvestDate').value;
            const harvests = JSON.parse(localStorage.getItem('harvests')) || [];
            harvests.push({ user: currentUser.email, crop, date });
            localStorage.setItem('harvests', JSON.stringify(harvests));
            loadHarvestCalendar();
            harvestForm.reset();
        });
    }

    const searchBtn = get('searchBtn');
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            const query = get('productQuery').value;
            const prices = { 'rice': 50, 'corn': 30, 'banana': 20 };
            const price = prices[query.toLowerCase()] || 'Not found';
            const output = get('averagePrice');
            if (output) output.textContent = `Average price: ₱${price}`;
        });
    }

    const market1 = get('market1');
    const market2 = get('market2');
    if (market1 && market2) {
        const markets = ['Market A', 'Market B', 'Market C'];
        markets.forEach(m => {
            const opt1 = document.createElement('option');
            opt1.value = m;
            opt1.textContent = m;
            market1.appendChild(opt1);
            const opt2 = document.createElement('option');
            opt2.value = m;
            opt2.textContent = m;
            market2.appendChild(opt2);
        });
        const compareBtn = get('compareBtn');
        if (compareBtn) {
            compareBtn.addEventListener('click', function() {
                const m1 = market1.value;
                const m2 = market2.value;
                const output = get('comparisonResult');
                if (output) {
                    if (m1 && m2 && m1 !== m2) {
                        output.textContent = `${m1} has lower prices for rice.`;
                    } else {
                        output.textContent = 'Select different markets.';
                    }
                }
            });
        }
    }

    const reportBtn = get('reportBtn');
    if (reportBtn) {
        reportBtn.addEventListener('click', function() {
            const vendor = get('vendor').value;
            const product = get('productReported').value;
            const price = get('reportedPrice').value;
            const reportMessage = get('reportMessage');
            if (vendor && product && price) {
                const reports = JSON.parse(localStorage.getItem('reports')) || [];
                reports.push({ vendor, product, price, reporter: currentUser.email });
                localStorage.setItem('reports', JSON.stringify(reports));
                if (reportMessage) reportMessage.textContent = 'Report submitted!';
            } else if (reportMessage) {
                reportMessage.textContent = 'Fill all fields.';
            }
        });
    }

    const historyBtn = get('historyBtn');
    if (historyBtn) {
        historyBtn.addEventListener('click', function() {
            const history = [40, 45, 50, 48, 52];
            drawChart(history);
        });
    }

    const predictBtn = get('predictBtn');
    if (predictBtn) {
        predictBtn.addEventListener('click', function() {
            const product = get('predictProduct').value;
            const prediction = Math.floor(Math.random() * 20) + 50;
            const output = get('prediction');
            if (output) output.textContent = `Predicted price for ${product}: ₱${prediction}`;
        });
    }

    const ideaImage = get('ideaImage');
    const imagePreview = get('imagePreview');
    if (ideaImage && imagePreview) {
        ideaImage.addEventListener('change', function() {
            const file = this.files[0];
            imagePreview.innerHTML = '';
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    const img = document.createElement('img');
                    img.src = event.target.result;
                    img.alt = 'Preview';
                    img.className = 'preview-img';
                    imagePreview.appendChild(img);
                };
                reader.readAsDataURL(file);
            }
        });
    }

    const ideaForm = get('ideaForm');
    if (ideaForm) {
        ideaForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const idea = get('ideaText').value;
            const caption = get('ideaCaption').value;
            const file = get('ideaImage').files[0];
            const ideas = JSON.parse(localStorage.getItem('ideas')) || [];
            const newIdea = {
                user: currentUser.name,
                idea,
                caption,
                image: '',
                date: new Date().toISOString()
            };
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    newIdea.image = event.target.result;
                    ideas.push(newIdea);
                    localStorage.setItem('ideas', JSON.stringify(ideas));
                    loadFarmIdeas();
                    ideaForm.reset();
                    if (imagePreview) imagePreview.innerHTML = '';
                };
                reader.readAsDataURL(file);
            } else {
                ideas.push(newIdea);
                localStorage.setItem('ideas', JSON.stringify(ideas));
                loadFarmIdeas();
                ideaForm.reset();
                if (imagePreview) imagePreview.innerHTML = '';
            }
        });
    }

    const forumForm = get('forumForm');
    if (forumForm) {
        forumForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const topic = get('forumTopic').value;
            const message = get('forumMessage').value;
            const posts = JSON.parse(localStorage.getItem('forumPosts')) || [];
            posts.push({ user: currentUser.name, topic, message, date: new Date().toISOString() });
            localStorage.setItem('forumPosts', JSON.stringify(posts));
            loadForum();
            forumForm.reset();
        });
    }

    // Product management
    const productForm = get('productForm');
    if (productForm) {
        productForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Product form submitted');

            const name = get('productName').value;
            const description = get('productDescription').value;
            const price = parseFloat(get('productPrice').value);
            const quantity = parseInt(get('productQuantity').value);
            const imageFile = get('productImage').files[0];

            console.log('Product form values:', { name, description, price, quantity, imageFile });

            if (!name.trim()) {
                alert('Please enter a product name');
                return;
            }

            if (isNaN(price) || price <= 0) {
                alert('Please enter a valid price');
                return;
            }

            if (isNaN(quantity) || quantity <= 0) {
                alert('Please enter a valid quantity');
                return;
            }

            if (imageFile && imageFile.size > 1024 * 1024) {
                alert('Image file is too large. Please choose an image smaller than 1MB.');
                return;
            }

            const newProduct = {
                id: Date.now(),
                name,
                description,
                price,
                quantity,
                image: '',
                dateAdded: new Date().toISOString()
            };

            if (imageFile) {
                console.log('Processing product image');
                const reader = new FileReader();
                reader.onload = function(event) {
                    console.log('Product image loaded successfully');
                    newProduct.image = event.target.result;
                    saveProduct(newProduct);
                };
                reader.onerror = function() {
                    console.error('Error reading product image file');
                    alert('Error processing image. Please try again.');
                };
                reader.readAsDataURL(imageFile);
            } else {
                console.log('Adding product without image');
                saveProduct(newProduct);
            }
        });
    }

    // Product image preview
    const productImageInput = get('productImage');
    const productImagePreview = get('productImagePreview');

    if (productImageInput && productImagePreview) {
        productImageInput.addEventListener('change', function() {
            const file = this.files[0];
            productImagePreview.innerHTML = '';
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
                    img.alt = 'Product preview';
                    img.style.maxWidth = '100px';
                    img.style.maxHeight = '100px';
                    img.style.objectFit = 'cover';
                    productImagePreview.appendChild(img);
                };
                reader.readAsDataURL(file);
            }
        });
    }

    if (get('ideasList')) loadFarmIdeas();
    if (get('forumList')) loadForum();
    if (get('productsContainer')) loadProducts();
    if (get('cartContainer')) loadCart();
    if (get('ordersContainer')) loadOrders();
    updateCartSummary();

    const checkoutBtn = get('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            checkoutCart();
        });
    }

    const confirmCheckoutBtn = get('confirmCheckoutBtn');
    const cancelCheckoutBtn = get('cancelCheckoutBtn');
    const closeCheckoutModal = get('closeCheckoutModal');
    if (confirmCheckoutBtn) confirmCheckoutBtn.addEventListener('click', confirmCheckout);
    [cancelCheckoutBtn, closeCheckoutModal].forEach(btn => {
        if (btn) {
            btn.addEventListener('click', hideModal);
        }
    });
});

function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const container = get('cartContainer');
    container.innerHTML = '';
    if (!cart.length) {
        container.innerHTML = '<p>Your shopping cart is empty.</p>';
        updateCartSummary();
        return;
    }

    cart.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.style.marginBottom = '1rem';
        card.innerHTML = `
            <div style="display: flex; gap: 1rem; align-items: center;">
                <img src="${item.image}" alt="${item.name}" style="width: 70px; height: 70px; object-fit: cover; border-radius: 6px;">
                <div style="flex: 1;">
                    <h5>${item.name}</h5>
                    <p>Price: ₱${item.price.toFixed(2)}</p>
                    <p>Qty: ${item.quantity}</p>
                    <p>Subtotal: ₱${(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <button class="btn btn-secondary" onclick="removeCartItem('${item.id}')"><i class="fas fa-trash"></i> Remove</button>
            </div>
        `;
        container.appendChild(card);
    });
    updateCartSummary();
}

function removeCartItem(itemId) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const updated = cart.filter(item => item.id !== itemId);
    localStorage.setItem('cart', JSON.stringify(updated));
    loadCart();
}

function updateCartSummary() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCount = get('cartCount');
    if (cartCount) cartCount.textContent = totalCount;
    const navCartCount = get('navCartCount');
    if (navCartCount) navCartCount.textContent = totalCount;
}

function renderCheckoutSummary(cart) {
    const summary = get('checkoutSummary');
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    if (!summary) return;
    summary.innerHTML = `<ul>${cart.map(item => `<li>${item.name} x${item.quantity} - ₱${(item.price * item.quantity).toFixed(2)}</li>`).join('')}</ul>`;
    const totalLabel = get('checkoutTotal');
    if (totalLabel) totalLabel.textContent = total.toFixed(2);
}

function showModal() {
    const modal = get('checkoutModal');
    if (modal) modal.classList.add('active');
}

function hideModal() {
    const modal = get('checkoutModal');
    if (modal) modal.classList.remove('active');
}

function checkoutCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (!cart.length) {
        alert('Your cart is empty. Add items from the produce shop first.');
        return;
    }
    renderCheckoutSummary(cart);
    showModal();
}

function confirmCheckout() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (!cart.length) {
        alert('Your cart is empty.');
        hideModal();
        return;
    }
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const order = {
        id: Date.now(),
        user: currentUser.email,
        items: cart,
        total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
        date: new Date().toISOString()
    };
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    localStorage.setItem('cart', JSON.stringify([]));
    hideModal();
    loadCart();
    loadOrders();
    alert('Checkout successful! Your order has been created.');
}

function loadOrders() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const userOrders = orders.filter(order => order.user === currentUser.email);
    const container = get('ordersContainer');
    container.innerHTML = '';
    if (!userOrders.length) {
        container.innerHTML = '<p>No orders yet. Buy something from the produce shop.</p>';
        return;
    }
    userOrders.reverse().forEach(order => {
        const card = document.createElement('div');
        card.className = 'card';
        card.style.marginBottom = '1rem';
        card.innerHTML = `
            <h5>Order #${order.id}</h5>
            <p>Date: ${new Date(order.date).toLocaleDateString()}</p>
            <p>Total: ₱${order.total.toFixed(2)}</p>
            <div>${order.items.map(i => `<p>${i.name} x${i.quantity} - ₱${(i.price * i.quantity).toFixed(2)}</p>`).join('')}</div>
        `;
        container.appendChild(card);
    });
}


function loadFarmerProfile() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    document.getElementById('profileName').textContent = currentUser.name;
    document.getElementById('profileLocation').textContent = currentUser.city;
    document.getElementById('profileCrops').textContent = currentUser.crops || 'None';
}

function loadHarvestCalendar() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const harvests = JSON.parse(localStorage.getItem('harvests')) || [];
    const userHarvests = harvests.filter(h => h.user === currentUser.email);
    const list = document.getElementById('harvestList');
    list.innerHTML = '';
    userHarvests.forEach(h => {
        const li = document.createElement('li');
        li.textContent = `${h.crop} - ${h.date}`;
        list.appendChild(li);
    });
}

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
                <span>${new Date(i.date).toLocaleDateString()}</span>
            </div>
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
}

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

function drawChart(data) {
    const canvas = document.getElementById('historyChart');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const width = canvas.width / data.length;
    const max = Math.max(...data);
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - (data[0] / max) * canvas.height);
    data.forEach((val, i) => {
        const x = i * width + width / 2;
        const y = canvas.height - (val / max) * canvas.height;
        ctx.lineTo(x, y);
    });
    ctx.stroke();
}

function saveProduct(product) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const products = JSON.parse(localStorage.getItem('products')) || [];
    product.user = currentUser.email;
    products.push(product);
    localStorage.setItem('products', JSON.stringify(products));
    loadProducts();
    // Reset form
    get('productForm').reset();
    get('productImagePreview').innerHTML = '';
}

function loadProducts() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const userProducts = products.filter(p => p.user === currentUser.email);
    const container = get('productsContainer');
    container.innerHTML = '';

    if (userProducts.length === 0) {
        container.innerHTML = '<p>No products listed yet.</p>';
        return;
    }

    userProducts.reverse().forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'card';
        productCard.style.marginBottom = '1rem';

        let imageHtml = '';
        if (product.image) {
            imageHtml = `<img src="${product.image}" alt="${product.name}" style="max-width: 100px; max-height: 100px; object-fit: cover; border-radius: 4px; margin-bottom: 0.5rem;">`;
        }

        productCard.innerHTML = `
            <div style="display: flex; gap: 1rem;">
                <div style="flex: 1;">
                    ${imageHtml}
                </div>
                <div style="flex: 2;">
                    <h5>${product.name}</h5>
                    <p><strong>Description:</strong> ${product.description || 'No description'}</p>
                    <p><strong>Price:</strong> ₱${product.price.toFixed(2)}</p>
                    <p><strong>Quantity:</strong> ${product.quantity}</p>
                    <p><strong>Added:</strong> ${new Date(product.dateAdded).toLocaleDateString()}</p>
                    <button class="btn btn-secondary" onclick="deleteProduct(${product.id})"><i class="fas fa-trash"></i> Delete</button>
                </div>
            </div>
        `;
        container.appendChild(productCard);
    });
}

function deleteProduct(productId) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const updatedProducts = products.filter(p => p.id !== productId);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    loadProducts();
}