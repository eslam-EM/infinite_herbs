document.addEventListener('DOMContentLoaded', function() {
    initLanguage();
    initProducts();
    initModal();
    initMobileMenu();
});

let currentLanguage = 'en';

/* ================= LANGUAGE ================= */
function initLanguage() {
    const savedLang = localStorage.getItem('infinityHerbsLang');
    if (savedLang) {
        setLanguage(savedLang);
    }
}

function toggleLanguage() {
    currentLanguage = currentLanguage === 'en' ? 'ar' : 'en';
    setLanguage(currentLanguage);
    localStorage.setItem('infinityHerbsLang', currentLanguage);
}

function setLanguage(lang) {
    currentLanguage = lang;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
}

/* ================= MOBILE MENU ================= */
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (!menuToggle || !navLinks) return;

    menuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
        });
    });

    document.addEventListener('click', function(e) {
        if (!e.target.closest('.navbar')) {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
        }
    });
}

/* ================= PRODUCTS ================= */
function initProducts() {
    if (typeof productsData === 'undefined') return;

    if (document.querySelector('.products-grid')) {
        displayFeaturedProducts();
        setupProductTabs();
    }

    if (document.querySelector('#allProductsGrid')) {
        displayAllProducts('all');
        setupAllProductTabs();
    }
}

function displayFeaturedProducts() {
    const grid = document.querySelector('.products-grid');
    if (!grid) return;

    const featured = productsData.filter(p => p.featured).slice(0, 8);
    grid.innerHTML = '';
    featured.forEach(product => grid.appendChild(createProductCard(product)));
}

function displayAllProducts(category) {
    const grid = document.querySelector('#allProductsGrid');
    if (!grid) return;

    const filtered = category === 'all' ? productsData : productsData.filter(p => p.category === category);
    grid.innerHTML = '';
    filtered.forEach(product => grid.appendChild(createProductCard(product)));
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';

    const name = currentLanguage === 'en' ? product.name_en : product.name_ar;

    card.innerHTML = `
        <img src="${product.image}" alt="${name}" class="product-img">
        <div class="product-info">
            <h3 class="product-name">${name}</h3>
            <span class="product-category">${product.category.toUpperCase()}</span>
            <button class="btn-primary view-details" onclick="window.location.href='product-detail.html?id=${product.id}'">
                ${currentLanguage === 'en' ? 'View Details' : 'عرض التفاصيل'}
            </button>
        </div>
    `;

    return card;
}

function setupProductTabs() {
    const tabs = document.querySelectorAll('.product-tabs .tab-btn');
    if (!tabs.length) return;

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            const category = this.dataset.category;
            const filtered = category === 'all' ?
                productsData.filter(p => p.featured).slice(0, 8) :
                productsData.filter(p => p.featured && p.category === category).slice(0, 8);

            const grid = document.querySelector('.products-grid');
            if (!grid) return;

            grid.innerHTML = '';
            filtered.forEach(product => grid.appendChild(createProductCard(product)));
        });
    });
}

function setupAllProductTabs() {
    const tabs = document.querySelectorAll('.all-products .tab-btn');
    if (!tabs.length) return;

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            displayAllProducts(this.dataset.category);
        });
    });
}

/* ================= MODAL ================= */
function initModal() {
    const modal = document.querySelector('.modal-overlay');
    const closeBtn = document.querySelector('.modal-close');

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (modal) modal.addEventListener('click', e => e.target === modal && closeModal());
    document.addEventListener('keydown', e => e.key === 'Escape' && closeModal());
}

function openProductModal(productId) {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;

    const modal = document.querySelector('.modal-overlay');
    const body = document.querySelector('.modal-body');
    if (!modal || !body) return;

    const name = currentLanguage === 'en' ? product.name_en : product.name_ar;
    const desc = currentLanguage === 'en' ? product.description_en : product.description_ar;
    
    const fullDesc = currentLanguage === 'en' 
        ? product.fullDescription_en || desc 
        : product.fullDescription_ar || desc;
    
    const healthBenefits = currentLanguage === 'en'
        ? product.healthBenefits_en || 'Premium quality product with numerous health benefits.'
        : product.healthBenefits_ar || 'منتج عالي الجودة مع فوائد صحية متعددة.';
    
    const howToUse = currentLanguage === 'en'
        ? product.howToUse_en || 'Suitable for culinary and medicinal applications.'
        : product.howToUse_ar || 'مناسب للاستخدامات culinary والطبية.';

    body.innerHTML = `
        <img src="${product.image}" alt="${name}" onerror="this.src='images/placeholder.jpg'">
        <div class="modal-details">
            <h2>${name}</h2>
            <span class="product-category">${product.category.toUpperCase()}</span>
            
            <div class="product-full-description">
                <h3><i class="fas fa-info-circle"></i> ${currentLanguage === 'en' ? 'About this Product' : 'عن هذا المنتج'}</h3>
                <p>${fullDesc}</p>
            </div>
            
            <div class="health-benefits">
                <h3><i class="fas fa-heartbeat"></i> ${currentLanguage === 'en' ? 'Health Benefits' : 'الفوائد الصحية'}</h3>
                <p>${healthBenefits}</p>
            </div>
            
            <div class="how-to-use">
                <h3><i class="fas fa-utensils"></i> ${currentLanguage === 'en' ? 'How to Use' : 'طريقة الاستخدام'}</h3>
                <p>${howToUse}</p>
            </div>
            
            <div class="details">
                <p><strong>${currentLanguage === 'en' ? 'Origin:' : 'المنشأ:'}</strong> ${product.origin}</p>
                <p><strong>${currentLanguage === 'en' ? 'Quality:' : 'الجودة:'}</strong> ${product.quality}</p>
                <p><strong>${currentLanguage === 'en' ? 'Packaging:' : 'التغليف:'}</strong> ${product.packaging}</p>
                <p><strong>${currentLanguage === 'en' ? 'Availability:' : 'التوافر:'}</strong> ${product.availability}</p>
            </div>
            
            ${product.wikipedia ? `
            <a href="${product.wikipedia}" target="_blank" class="wikipedia-btn">
                <i class="fab fa-wikipedia-w"></i> ${currentLanguage === 'en' ? 'Learn More on Wikipedia' : 'تعرف أكثر على ويكيبيديا'}
            </a>
            ` : ''}
            
            <button class="btn-primary inquire-btn" onclick="inquireAboutProduct(${product.id})">
                <i class="fas fa-envelope"></i> ${currentLanguage === 'en' ? 'Inquire' : 'استفسر'}
            </button>
        </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

/* ================= INQUIRY ================= */
function inquireAboutProduct(productId) {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;

    const name = currentLanguage === 'en' ? product.name_en : product.name_ar;
    window.location.href = `mailto:eslamalhsawy@gmail.com?subject=Inquiry%20about%20${encodeURIComponent(name)}&body=I'm%20interested%20in%20${encodeURIComponent(name)}.%20Please%20send%20more%20information.`;
    /* ================= INQUIRY ================= */
function inquireAboutProduct(productId) {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;

    const name = currentLanguage === 'en' ? product.name_en : product.name_ar;
    
    // فتح عميل البريد الإلكتروني
    window.location.href = `mailto:eslamalhsawy@gmail.com?subject=Inquiry%20about%20${encodeURIComponent(name)}&body=I'm%20interested%20in%20${encodeURIComponent(name)}.%20Please%20send%20more%20information.`;
    
    // عرض رسالة التأكيد
    showEmailSentMessage();
}

/* ================= EMAIL CONFIRMATION ================= */
function showEmailSentMessage() {
    // إنشاء عنصر الرسالة إذا لم يكن موجوداً
    let messageDiv = document.getElementById('emailSentMessage');
    
    if (!messageDiv) {
        messageDiv = document.createElement('div');
        messageDiv.id = 'emailSentMessage';
        messageDiv.className = 'email-sent-message';
        document.body.appendChild(messageDiv);
    }
    
    // تعيين محتوى الرسالة (بالانجليزي فقط كما طلبت)
    messageDiv.innerHTML = `
        <div class="message-content">
            <i class="fas fa-check-circle"></i>
            <h3>Email Sent Successfully!</h3>
            <p>Your email client has been opened. Please check your email to complete the process.</p>
            <button class="close-message" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // إظهار الرسالة
    setTimeout(() => {
        messageDiv.classList.add('show');
    }, 100);
    
    // إخفاء الرسالة بعد 5 ثواني
    setTimeout(() => {
        if (messageDiv) {
            messageDiv.classList.remove('show');
            setTimeout(() => {
                if (messageDiv && messageDiv.parentNode) {
                    messageDiv.remove();
                }
            }, 300);
        }
    }, 5000);
}
}

/* ================= GLOBAL ================= */
window.openProductModal = openProductModal;
window.closeModal = closeModal;
window.inquireAboutProduct = inquireAboutProduct;