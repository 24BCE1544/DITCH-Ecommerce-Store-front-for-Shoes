/* ============================================
   DITCH FOOTWEAR - MAIN JAVASCRIPT
   All interactive functionality and DOM manipulation
   ============================================ */

// ============================================
// GLOBAL VARIABLES & DATA
// ============================================

// Product Database (Dummy Data)
const productsDatabase = [
    { id: 1, name: "Urban Runner", category: "runners", price: 189, sizes: ["7-9", "10-12"], image: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", imgFile: "images/Urban_Runner-removebg-preview 1.png" },
    { id: 2, name: "Classic Oxford", category: "formal", price: 249, sizes: ["7-9", "10-12", "13-15"], image: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", imgFile: "images/Dress_formal-removebg-preview 1.png" },
    { id: 3, name: "Trail Blazer", category: "runners", price: 219, sizes: ["10-12", "13-15"], image: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)", imgFile: "images/Trail_blazer-removebg-preview 1.png" },
    { id: 4, name: "Metro Boot", category: "boots", price: 279, sizes: ["7-9", "10-12", "13-15"], image: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)", imgFile: "images/Metro_Boot-removebg-preview 1.png" },
    { id: 5, name: "Casual Loafer", category: "casual", price: 159, sizes: ["7-9", "10-12"], image: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)", imgFile: "images/Casual_loffer-removebg-preview 1.png" },
    { id: 6, name: "Sport Elite", category: "runners", price: 199, sizes: ["7-9", "10-12", "13-15"], image: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)", imgFile: "images/Sport_elite-removebg-preview 1.png" },
    { id: 7, name: "Dress Formal", category: "formal", price: 269, sizes: ["10-12", "13-15"], image: "linear-gradient(135deg, #c3cfe2 0%, #c3cfe2 100%)", imgFile: "images/Business_classic-removebg-preview 1.png" },
    { id: 8, name: "Street Sneaker", category: "casual", price: 139, sizes: ["7-9", "10-12"], image: "linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)", imgFile: "images/Street_sneaker-removebg-preview 1.png" },
    { id: 9, name: "Hiking Pro", category: "boots", price: 299, sizes: ["10-12", "13-15"], image: "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)", imgFile: "images/Hiking_pro-removebg-preview 1.png" },
    { id: 10, name: "Business Classic", category: "formal", price: 259, sizes: ["7-9", "10-12", "13-15"], image: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)", imgFile: "images/Business_classic-removebg-preview 1.png" },
    { id: 11, name: "Weekend Walker", category: "casual", price: 169, sizes: ["7-9", "10-12"], image: "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)", imgFile: "images/Weekend_walker-removebg-preview 1.png" },
    { id: 12, name: "Marathon Max", category: "runners", price: 229, sizes: ["10-12", "13-15"], image: "linear-gradient(135deg, #fdcbf1 0%, #e6dee9 100%)", imgFile: "images/Marathon_max-removebg-preview 1.png" }
];

// Shopping Cart (stored in localStorage)
let cart = [];

/** Base shoe images for customize flow (matches productsDatabase gradients / PNGs) */
const customizeModelAssets = {
    'urban-runner': {
        image: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        imgFile: 'images/Urban_Runner-removebg-preview 1.png'
    },
    'classic-oxford': {
        image: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        imgFile: 'images/Dress_formal-removebg-preview 1.png'
    },
    'trail-blazer': {
        image: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        imgFile: 'images/Trail_blazer-removebg-preview 1.png'
    },
    'metro-boot': {
        image: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        imgFile: 'images/Metro_Boot-removebg-preview 1.png'
    }
};

function getCartItemImageSrc(item) {
    if (item.imgFile && item.imgFile.trim()) {
        return item.imgFile.trim();
    }
    const idNum = typeof item.id === 'number' ? item.id : parseInt(String(item.id), 10);
    if (!Number.isNaN(idNum)) {
        const p = productsDatabase.find((x) => x.id === idNum);
        if (p && p.imgFile) {
            return p.imgFile;
        }
    }
    if (item.name) {
        const p = productsDatabase.find(
            (x) => x.name.toLowerCase() === String(item.name).toLowerCase()
        );
        if (p && p.imgFile) {
            return p.imgFile;
        }
    }
    return 'images/Urban_Runner-removebg-preview 1.png';
}

// Promo Codes
// Promo: 10% off subtotal when code matches (trimmed; not case-sensitive for letters)
const promoCodes = {
    '123456': 10
};

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Dynamic auth UI toggle
    if (localStorage.getItem('userLoggedIn') === 'true') {
        document.querySelectorAll('.main-nav a[href="signup.html"]').forEach((link) => {
            const li = link.closest('li');
            if (li) {
                li.hidden = true;
            }
        });
        document.querySelectorAll('a[href="login.html"]').forEach(link => {
            link.textContent = 'Sign Out';
            link.href = '#';
            link.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('userLoggedIn');
                localStorage.removeItem('userEmail');
                window.location.reload();
            });
        });
    }

    // Load cart from localStorage
    loadCart();
    updateCartCount();
    
    // Initialize page-specific functionality
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    if (currentPage === 'shop.html' || currentPage === '') {
        initShopPage();
    } else if (currentPage === 'customize.html') {
        initCustomizePage();
    } else if (currentPage === 'repair.html') {
        initRepairPage();
    } else if (currentPage === 'cart.html') {
        initCartPage();
    } else if (currentPage === 'index.html' || currentPage === '/') {
        initHomePage();
    }
});

// ============================================
// CART MANAGEMENT
// ============================================

function loadCart() {
    const savedCart = localStorage.getItem('ditchCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

function saveCart() {
    localStorage.setItem('ditchCart', JSON.stringify(cart));
}

function addToCart(item) {
    // Authentication Wall
    if (localStorage.getItem('userLoggedIn') !== 'true') {
        alert('Authentication required: Please sign in to begin shopping.');
        window.location.href = 'login.html';
        return false;
    }

    // Check if item already exists in cart
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        item.quantity = 1;
        cart.push(item);
    }
    
    saveCart();
    updateCartCount();
    showNotification('Item added to cart!');
    return true;
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    saveCart();
    updateCartCount();
    if (window.location.pathname.includes('cart.html')) {
        renderCartItems();
    }
}

function updateQuantity(itemId, newQuantity) {
    const item = cart.find(cartItem => cartItem.id === itemId);
    if (item) {
        item.quantity = Math.max(1, newQuantity);
        saveCart();
        if (window.location.pathname.includes('cart.html')) {
            renderCartItems();
        }
    }
}

function updateCartCount() {
    const cartCounts = document.querySelectorAll('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    cartCounts.forEach(count => {
        count.textContent = totalItems;
    });
}

function clearCart() {
    cart = [];
    saveCart();
    updateCartCount();
}

// ============================================
// HOME PAGE
// ============================================

function initHomePage() {
    // Animate statistics counter
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => observer.observe(stat));
    
    // Initialize Hero Shoe Slider Animation
    initHeroSlider();
}

function initHeroSlider() {
    const slides = document.querySelectorAll('.shoe-slide');
    if (slides.length === 0) return;
    
    let currentSlide = 0;
    
    // Switch slides every 3.5 seconds
    setInterval(() => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }, 3500);
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// ============================================
// SHOP PAGE
// ============================================

function initShopPage() {
    renderProducts(productsDatabase);
    setupFilters();
    setupSorting();
    
    // Add event listeners for "Add to Cart" buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart-btn')) {
            const productId = parseInt(e.target.getAttribute('data-product-id'));
            const product = productsDatabase.find(p => p.id === productId);
            if (product) {
                addToCart({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    category: product.category,
                    image: product.image,
                    imgFile: product.imgFile
                });
            }
        }
    });
}

function renderProducts(products) {
    const grid = document.getElementById('productsGrid');
    const noResults = document.getElementById('noResults');
    const productCount = document.getElementById('productCount');
    
    if (!grid) return;
    
    if (products.length === 0) {
        grid.style.display = 'none';
        noResults.style.display = 'block';
        productCount.textContent = '0';
        return;
    }
    
    grid.style.display = 'grid';
    noResults.style.display = 'none';
    productCount.textContent = products.length;
    
    grid.innerHTML = '';
    
    // Loop through products and create cards
    for (let i = 0; i < products.length; i++) {
        const product = products[i];
        const card = createProductCard(product);
        grid.appendChild(card);
    }
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-product-id', product.id);
    
    const shoeImgFile = product.imgFile || 'images/Urban_Runner-removebg-preview 1.png';
    
    card.innerHTML = `
        <div class="product-image">
            <div class="product-placeholder" style="background: ${product.image};">
                <img src="${shoeImgFile}" alt="${product.name}" class="shoe-display-img">
            </div>
        </div>
        <div class="product-info">
            <h3>${product.name}</h3>
            <p class="product-category">${product.category}</p>
            <p class="price">$${product.price}</p>
        </div>
        <div class="product-actions">
            <button class="btn btn-secondary btn-full add-to-cart-btn" data-product-id="${product.id}">
                Add to Cart
            </button>
        </div>
    `;
    
    return card;
}

function setupFilters() {
    const filterInputs = document.querySelectorAll('input[data-filter-type]');
    const resetBtn = document.getElementById('resetFilters');
    
    if (!filterInputs.length) return;
    
    filterInputs.forEach(input => {
        input.addEventListener('change', applyFilters);
    });
    
    if (resetBtn) {
        resetBtn.addEventListener('click', resetFilters);
    }
}

function applyFilters() {
    const categoryFilters = getCheckedValues('category');
    const priceFilters = getCheckedValues('price');
    const sizeFilters = getCheckedValues('size');
    
    let filtered = [...productsDatabase];
    
    // Filter by category
    if (categoryFilters.length > 0 && !categoryFilters.includes('all')) {
        filtered = filtered.filter(product => categoryFilters.includes(product.category));
    }
    
    // Filter by price
    if (priceFilters.length > 0 && !priceFilters.includes('all')) {
        filtered = filtered.filter(product => {
            for (let i = 0; i < priceFilters.length; i++) {
                const range = priceFilters[i];
                if (range === '0-150' && product.price < 150) return true;
                if (range === '150-250' && product.price >= 150 && product.price <= 250) return true;
                if (range === '250-500' && product.price > 250) return true;
            }
            return false;
        });
    }
    
    // Filter by size
    if (sizeFilters.length > 0 && !sizeFilters.includes('all')) {
        filtered = filtered.filter(product => {
            for (let i = 0; i < sizeFilters.length; i++) {
                if (product.sizes.includes(sizeFilters[i])) return true;
            }
            return false;
        });
    }
    
    renderProducts(filtered);
}

function getCheckedValues(filterType) {
    const checked = [];
    const inputs = document.querySelectorAll(`input[data-filter-type="${filterType}"]:checked`);
    
    inputs.forEach(input => {
        checked.push(input.value);
    });
    
    return checked;
}

function resetFilters() {
    const allCheckboxes = document.querySelectorAll('input[data-filter-type]');
    
    allCheckboxes.forEach(checkbox => {
        if (checkbox.value === 'all') {
            checkbox.checked = true;
        } else {
            checkbox.checked = false;
        }
    });
    
    renderProducts(productsDatabase);
}

function setupSorting() {
    const sortSelect = document.getElementById('sortSelect');
    if (!sortSelect) return;
    
    sortSelect.addEventListener('change', function() {
        const sortValue = this.value;
        let sorted = [...productsDatabase];
        
        if (sortValue === 'price-low') {
            sorted.sort((a, b) => a.price - b.price);
        } else if (sortValue === 'price-high') {
            sorted.sort((a, b) => b.price - a.price);
        } else if (sortValue === 'name') {
            sorted.sort((a, b) => a.name.localeCompare(b.name));
        }
        
        renderProducts(sorted);
    });
}

// ============================================
// CUSTOMIZE PAGE
// ============================================

function initCustomizePage() {
    const form = document.getElementById('customizeForm');
    const resetBtn = document.getElementById('resetCustomization');
    
    if (!form) return;
    
    // Bind full form interactions
    const allInputs = form.querySelectorAll('input, select');
    allInputs.forEach(input => {
        input.addEventListener('change', () => {
            calculateCustomPrice();
            const checkedModel = form.querySelector('input[name="model"]:checked');
            updatePreview(checkedModel ? checkedModel.value : '');
        });
    });
    
    // Setup initials input listener
    const initialsInput = document.getElementById('initials');
    if (initialsInput) {
        initialsInput.addEventListener('input', calculateCustomPrice);
    }
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateCustomizeForm(form)) {
            submitCustomization(form);
        }
    });
    
    // Reset button
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            form.reset();
            updatePreview('');
            document.getElementById('totalPrice').textContent = '$0';
        });
    }
}

function calculateCustomPrice() {
    const form = document.getElementById('customizeForm');
    let total = 0;
    
    // Base model price
    const selectedModel = form.querySelector('input[name="model"]:checked');
    if (selectedModel) {
        total += parseInt(selectedModel.getAttribute('data-price'));
        updatePreview(selectedModel.value);
    }
    
    // Material price
    const selectedMaterial = form.querySelector('input[name="material"]:checked');
    if (selectedMaterial) {
        total += parseInt(selectedMaterial.getAttribute('data-price'));
    }
    
    // Sole type price
    const selectedSole = document.getElementById('soleType');
    if (selectedSole && selectedSole.value) {
        const selectedOption = selectedSole.options[selectedSole.selectedIndex];
        total += parseInt(selectedOption.getAttribute('data-price') || 0);
    }
    
    // Additional features
    const features = form.querySelectorAll('input[name="features"]:checked');
    for (let i = 0; i < features.length; i++) {
        total += parseInt(features[i].getAttribute('data-price'));
    }
    
    // Initials personalization
    const initials = document.getElementById('initials');
    if (initials && initials.value.length > 0) {
        total += 15;
    }
    
    document.getElementById('totalPrice').textContent = '$' + total;
}

function updatePreview(modelValue) {
    const previewModel = document.getElementById('previewModel');
    const previewColorText = document.getElementById('previewColor');
    const customShoeImg = document.getElementById('customShoeImg');
    
    if (!modelValue) {
        previewModel.textContent = 'Select a model to start';
        previewColorText.textContent = '';
        if (customShoeImg) customShoeImg.style.opacity = '0';
        return;
    }
    
    const modelProps = {
        'urban-runner': { name: 'Urban Runner', file: 'Urban_Runner-removebg-preview 1.png' },
        'classic-oxford': { name: 'Classic Oxford', file: 'Business_classic-removebg-preview 1.png' },
        'trail-blazer': { name: 'Trail Blazer', file: 'Trail_blazer-removebg-preview 1.png' },
        'metro-boot': { name: 'Metro Boot', file: 'Metro_Boot-removebg-preview 1.png' }
    };
    
    const model = modelProps[modelValue] || modelProps['urban-runner'];
    previewModel.textContent = model.name;
    
    // Update image
    if (customShoeImg) {
        customShoeImg.src = 'images/' + model.file;
        customShoeImg.style.opacity = '1';
    }
    
    const selectedColor = document.querySelector('input[name="primaryColor"]:checked');
    if (selectedColor) {
        previewColorText.textContent = 'Color: ' + selectedColor.value;
        if (customShoeImg) {
            // Apply a hue rotation filter based on color string
            const colorFilters = {
                'black': 'grayscale(100%) brightness(40%)',
                'white': 'grayscale(100%) brightness(180%)',
                'navy': 'sepia(100%) hue-rotate(180deg) saturate(300%) brightness(70%)',
                'brown': 'sepia(100%) hue-rotate(30deg) saturate(200%) brightness(80%)',
                'gray': 'grayscale(100%) brightness(100%)',
                'olive': 'sepia(100%) hue-rotate(50deg) saturate(200%) brightness(70%)'
            };
            customShoeImg.style.filter = colorFilters[selectedColor.value] || 'none';
        }
    } else {
        if (customShoeImg) customShoeImg.style.filter = 'none';
    }
}

function validateCustomizeForm(form) {
    // Check required fields
    const model = form.querySelector('input[name="model"]:checked');
    const color = form.querySelector('input[name="primaryColor"]:checked');
    const material = form.querySelector('input[name="material"]:checked');
    const soleType = document.getElementById('soleType');
    const size = document.getElementById('size');
    
    if (!model) {
        alert('Please select a shoe model');
        return false;
    }
    
    if (!color) {
        alert('Please select a primary color');
        return false;
    }
    
    if (!material) {
        alert('Please select a material');
        return false;
    }
    
    if (!soleType.value) {
        alert('Please select a sole type');
        return false;
    }
    
    if (!size.value) {
        alert('Please select your size');
        return false;
    }
    
    return true;
}

function submitCustomization(form) {
    const formData = new FormData(form);
    const totalPrice = document.getElementById('totalPrice').textContent.replace('$', '');
    
    const modelKey = formData.get('model');
    const assets = customizeModelAssets[modelKey] || customizeModelAssets['urban-runner'];

    const customItem = {
        id: 'custom-' + Date.now(),
        name: 'Custom ' + formData.get('model').split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        price: parseInt(totalPrice),
        category: 'custom',
        image: assets.image,
        imgFile: assets.imgFile,
        customization: {
            model: formData.get('model'),
            color: formData.get('primaryColor'),
            material: formData.get('material'),
            sole: formData.get('soleType'),
            size: formData.get('size'),
            features: formData.getAll('features'),
            initials: formData.get('initials')
        }
    };
    
    const wasAdded = addToCart(customItem);
    
    if (wasAdded) {
        // Redirect to cart
        setTimeout(() => {
            window.location.href = 'cart.html';
        }, 500);
    }
}

// ============================================
// REPAIR PAGE
// ============================================

function initRepairPage() {
    const form = document.getElementById('repairForm');
    
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateRepairForm(form)) {
            submitRepairForm(form);
        }
    });
}

function validateRepairForm(form) {
    // Validate required text fields
    const requiredFields = form.querySelectorAll('input[required], select[required], textarea[required]');
    
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!field.value.trim()) {
            alert('Please fill in all required fields');
            field.focus();
            return false;
        }
    }
    
    // Validate email
    const email = document.getElementById('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
        alert('Please enter a valid email address');
        email.focus();
        return false;
    }
    
    // Validate phone number
    const phone = document.getElementById('phone');
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone.value)) {
        alert('Please enter a valid 10-digit phone number');
        phone.focus();
        return false;
    }
    
    // Validate ZIP code
    const zipCode = document.getElementById('zipCode');
    const zipRegex = /^[0-9]{5}$/;
    if (!zipRegex.test(zipCode.value)) {
        alert('Please enter a valid 5-digit ZIP code');
        zipCode.focus();
        return false;
    }
    
    // Validate issue description length
    const description = document.getElementById('issueDescription');
    if (description.value.length < 20) {
        alert('Please provide a more detailed description (minimum 20 characters)');
        description.focus();
        return false;
    }
    
    // Check if at least one repair type is selected
    const repairTypes = form.querySelectorAll('input[name="repairType"]:checked');
    if (repairTypes.length === 0) {
        alert('Please select at least one type of repair needed');
        return false;
    }
    
    // Validate consent checkbox
    const consent = document.getElementById('consent');
    if (!consent.checked) {
        alert('Please agree to the repair terms to continue');
        consent.focus();
        return false;
    }
    
    return true;
}

async function submitRepairForm(form) {
    const formData = new FormData(form);
    const repairData = Object.fromEntries(formData.entries());
    
    // Also get all checked repair types (FormData only gets the last one if same name)
    const repairTypes = [];
    form.querySelectorAll('input[name="repairType"]:checked').forEach(cb => {
        repairTypes.push(cb.value);
    });
    repairData.repairTypes = repairTypes;
    
    try {
        const response = await fetch('http://localhost:3001/api/repair', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(repairData)
        });
        
        const result = await response.json();
        if (result.success) {
            // Hide form, show success message
            form.style.display = 'none';
            const successMessage = document.getElementById('formSuccess');
            successMessage.classList.add('show');
            successMessage.style.display = 'block';
            
            // Scroll to success message
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            alert('Failed to submit repair request. Please try again.');
        }
    } catch (error) {
        console.error('Error sending repair form:', error);
        alert('Network error. Is the local backend server running on port 3001? Check your terminal.');
    }
}

// ============================================
// CART PAGE
// ============================================

function initCartPage() {
    renderCartItems();
    setupShippingOptions();
    setupPromoCode();
    setupCheckout();
    setupQuickAdd();
}

function renderCartItems() {
    const container = document.getElementById('cartItemsContainer');
    const emptyCart = document.getElementById('emptyCart');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    if (!container) return;
    
    if (cart.length === 0) {
        container.style.display = 'none';
        emptyCart.style.display = 'block';
        checkoutBtn.disabled = true;
        updateOrderSummary();
        return;
    }
    
    container.style.display = 'block';
    emptyCart.style.display = 'none';
    checkoutBtn.disabled = false;
    
    container.innerHTML = '';
    
    // Loop through cart items
    for (let i = 0; i < cart.length; i++) {
        const item = cart[i];
        const cartItem = createCartItemElement(item);
        container.appendChild(cartItem);
    }
    
    updateOrderSummary();
}

function createCartItemElement(item) {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.setAttribute('data-item-id', item.id);
    
    const shoeImgFile = getCartItemImageSrc(item);
    const bgStyle = item.image && String(item.image).includes('gradient') ? item.image : 'var(--color-off-white)';

    div.innerHTML = `
        <div class="cart-item-image">
            <div class="product-placeholder cart-item-photo" style="background: ${bgStyle};">
                <img src="${shoeImgFile}" alt="${item.name}" class="shoe-display-img cart-item-shoe-img" width="200" height="200" loading="lazy">
            </div>
        </div>
        <div class="cart-item-details">
            <h3>${item.name}</h3>
            <p>Category: ${item.category}</p>
            ${item.customization ? '<p>Custom Design</p>' : ''}
            <div class="cart-item-actions">
                <div class="quantity-controls">
                    <button class="quantity-btn decrease-qty" data-item-id="${item.id}">-</button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn increase-qty" data-item-id="${item.id}">+</button>
                </div>
                <button class="remove-btn" data-item-id="${item.id}">Remove</button>
            </div>
        </div>
        <div class="cart-item-price">
            $${item.price * item.quantity}
        </div>
    `;
    
    // Add event listeners
    const decreaseBtn = div.querySelector('.decrease-qty');
    const increaseBtn = div.querySelector('.increase-qty');
    const removeBtn = div.querySelector('.remove-btn');
    
    decreaseBtn.addEventListener('click', () => {
        updateQuantity(item.id, item.quantity - 1);
    });
    
    increaseBtn.addEventListener('click', () => {
        updateQuantity(item.id, item.quantity + 1);
    });
    
    removeBtn.addEventListener('click', () => {
        removeFromCart(item.id);
    });
    
    return div;
}

function updateOrderSummary() {
    let subtotal = 0;
    
    // Calculate subtotal using loop
    for (let i = 0; i < cart.length; i++) {
        subtotal += cart[i].price * cart[i].quantity;
    }
    
    // Get shipping cost
    const shippingRadio = document.querySelector('input[name="shipping"]:checked');
    const shipping = shippingRadio ? parseInt(shippingRadio.value) : 15;
    
    // Calculate tax (8%)
    const tax = subtotal * 0.08;
    
    // Apply promo code discount if any
    const promoMessage = document.getElementById('promoMessage');
    let discount = 0;
    if (promoMessage && promoMessage.classList.contains('success')) {
        const discountText = promoMessage.textContent;
        const match = discountText.match(/(\d+)%/);
        if (match) {
            discount = subtotal * (parseInt(match[1]) / 100);
        }
    }
    
    const total = subtotal - discount + shipping + tax;
    
    // Update UI
    document.getElementById('subtotalAmount').textContent = '$' + subtotal.toFixed(2);
    document.getElementById('shippingAmount').textContent = '$' + shipping.toFixed(2);
    document.getElementById('taxAmount').textContent = '$' + tax.toFixed(2);
    document.getElementById('totalAmount').textContent = '$' + total.toFixed(2);
}

function setupShippingOptions() {
    const shippingRadios = document.querySelectorAll('input[name="shipping"]');
    
    shippingRadios.forEach(radio => {
        radio.addEventListener('change', updateOrderSummary);
    });
}

function setupPromoCode() {
    const applyBtn = document.getElementById('applyPromo');
    const promoInput = document.getElementById('promoCode');
    const promoMessage = document.getElementById('promoMessage');
    
    if (!applyBtn) return;
    
    applyBtn.addEventListener('click', function() {
        const raw = promoInput.value.trim();
        const code = raw.toUpperCase();

        if (promoCodes[code] !== undefined) {
            promoMessage.textContent = `Promo code applied! ${promoCodes[code]}% discount`;
            promoMessage.className = 'promo-message success';
            updateOrderSummary();
        } else if (code === '') {
            promoMessage.textContent = 'Please enter a promo code';
            promoMessage.className = 'promo-message error';
        } else {
            promoMessage.textContent = 'Invalid promo code';
            promoMessage.className = 'promo-message error';
        }
    });
}

function setupCheckout() {
    const checkoutBtn = document.getElementById('checkoutBtn');
    const checkoutModal = document.getElementById('checkoutModal');
    const successModal = document.getElementById('successModal');
    const simulateBtn = document.getElementById('simulateOrder');
    const closeButtons = document.querySelectorAll('.modal-close');
    
    if (!checkoutBtn) return;
    
    checkoutBtn.addEventListener('click', function() {
        // Populate modal with order details
        const subtotal = document.getElementById('subtotalAmount').textContent;
        const shipping = document.getElementById('shippingAmount').textContent;
        const tax = document.getElementById('taxAmount').textContent;
        const total = document.getElementById('totalAmount').textContent;
        
        document.getElementById('modalItemCount').textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
        document.getElementById('modalSubtotal').textContent = subtotal;
        document.getElementById('modalShipping').textContent = shipping;
        document.getElementById('modalTax').textContent = tax;
        document.getElementById('modalTotal').textContent = total;
        
        checkoutModal.classList.add('show');
    });
    
    if (simulateBtn) {
        simulateBtn.addEventListener('click', async function() {
            checkoutModal.classList.remove('show');
            const orderNum = Math.floor(100000 + Math.random() * 900000);
            document.getElementById('orderNumber').textContent = orderNum;
            
            // Post to order backend datastore
            try {
                await fetch('http://localhost:3001/api/order', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        orderId: orderNum,
                        totalPrice: document.getElementById('modalTotal').textContent,
                        items: cart
                    })
                });
            } catch (e) { console.error('Failed to log order network error:', e); }
            
            successModal.classList.add('show');
            
            // Clear cart completely securely
            clearCart();
        });
    }
    
    closeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').classList.remove('show');
        });
    });
    
    // Close modal on outside click
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('show');
        }
    });
}

function setupQuickAdd() {
    const quickAddButtons = document.querySelectorAll('.quick-add');
    
    quickAddButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const name = this.getAttribute('data-name');
            const price = parseInt(this.getAttribute('data-price'));
            const category = this.getAttribute('data-category');
            
            const match = productsDatabase.find((p) => p.name === name);
            const item = {
                id: match ? match.id : 'quick-' + Date.now(),
                name: name,
                price: price,
                category: category,
                image: match ? match.image : 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                imgFile: match ? match.imgFile : 'images/Casual_loffer-removebg-preview 1.png'
            };
            
            addToCart(item);
            renderCartItems();
        });
    });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #00d9ff;
        color: #0a0a0a;
        padding: 1rem 2rem;
        border-radius: 8px;
        font-weight: 700;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
