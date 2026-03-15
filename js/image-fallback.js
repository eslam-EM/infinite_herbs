// Image Fallback Handler
class ImageFallback {
    constructor() {
        this.placeholderBase = 'https://via.placeholder.com/';
        this.colors = {
            herbs: '4CAF50',
            seeds: '8BC34A',
            spices: 'FF9800'
        };
    }

    // دالة لمعالجة أخطاء الصور
    handleImageError(imgElement, product) {
        if (!imgElement || !product) return;

        // منع تكرار الأخطاء
        imgElement.onerror = null;

        // إنشاء صورة placeholder
        const category = product.category || 'herbs';
        const color = this.colors[category] || '4CAF50';
        const productName = product.name_en || 'Product';
        const encodedName = encodeURIComponent(productName);

        // رابط الصورة البديلة
        const fallbackUrl = `${this.placeholderBase}600x400/${color}/FFFFFF?text=${encodedName}`;

        // تعيين الصورة البديلة
        imgElement.src = fallbackUrl;

        // إضافة كلاس للإشارة أنها صورة بديلة
        imgElement.classList.add('image-fallback');

        // إضافة atribut للتصحيح
        imgElement.setAttribute('data-fallback', 'true');
        imgElement.setAttribute('title', `Image not available: ${productName}`);
    }

    // دالة لتحميل جميع الصور مع fallback
    loadAllImages() {
        const productImages = document.querySelectorAll('.product-img, .modal-img');

        productImages.forEach(img => {
            const productId = img.closest('.product-card') ? .dataset ? .id ||
                img.closest('[data-id]') ? .dataset ? .id;

            if (productId) {
                // إضافة event listener للأخطاء
                img.addEventListener('error', () => {
                    const product = productsData.find(p => p.id == productId);
                    if (product) {
                        this.handleImageError(img, product);
                    }
                });
            }
        });
    }

    // دالة للتحقق من وجود الصور
    checkMissingImages() {
        console.log('Checking for missing images...');

        productsData.forEach(product => {
            if (!product.image || !product.image.startsWith('images/')) {
                console.warn(`Product "${product.name_en}" has no local image`);
            }
        });
    }
}

// إنشاء instance واحدة
const imageFallback = new ImageFallback();

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    imageFallback.loadAllImages();
    imageFallback.checkMissingImages();
});