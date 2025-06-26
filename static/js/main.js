// Premium Store JavaScript

// Initialize Telegram WebApp
if (window.Telegram && window.Telegram.WebApp) {
    const tg = window.Telegram.WebApp;
    tg.ready();
    tg.expand();
    
    // Apply Telegram theme colors if available
    if (tg.themeParams) {
        document.documentElement.style.setProperty('--tg-theme-bg-color', tg.themeParams.bg_color);
        document.documentElement.style.setProperty('--tg-theme-text-color', tg.themeParams.text_color);
    }
}

// Search functionality
let searchTimeout;

function handleSearchInput() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        performSearch();
    }, 500); // Debounce search for 500ms
}

function performSearch() {
    filterProducts();
}

function clearSearch() {
    document.getElementById('search-input').value = '';
    filterProducts();
}

function clearAllFilters() {
    document.getElementById('search-input').value = '';
    document.getElementById('category-filter').value = '';
    document.getElementById('color-filter').value = '';
    document.getElementById('sort-filter').value = 'name';
    document.getElementById('min-price').value = '';
    document.getElementById('max-price').value = '';
    filterProducts();
}

// Filter and sort products
function filterProducts() {
    const search = document.getElementById('search-input').value.trim();
    const category = document.getElementById('category-filter').value;
    const color = document.getElementById('color-filter').value;
    const sort = document.getElementById('sort-filter').value;
    const minPrice = document.getElementById('min-price').value;
    const maxPrice = document.getElementById('max-price').value;
    
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category) params.append('category', category);
    if (color) params.append('color', color);
    if (sort) params.append('sort', sort);
    if (minPrice) params.append('min_price', minPrice);
    if (maxPrice) params.append('max_price', maxPrice);
    
    const url = `${window.location.pathname}?${params.toString()}`;
    window.location.href = url;
}

// Show order modal
function showOrderInfo() {
    const modal = document.getElementById('orderModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

// Close order modal
function closeOrderModal() {
    const modal = document.getElementById('orderModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('orderModal');
    if (event.target === modal) {
        closeOrderModal();
    }
}

// Handle form validation
document.addEventListener('DOMContentLoaded', function() {
    // Auto-hide flash messages after 5 seconds
    const flashMessages = document.querySelectorAll('.flash-message');
    flashMessages.forEach(message => {
        setTimeout(() => {
            message.style.opacity = '0';
            setTimeout(() => {
                message.remove();
            }, 300);
        }, 5000);
    });
    
    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Handle product form validation
    const productForm = document.querySelector('.product-form');
    if (productForm) {
        productForm.addEventListener('submit', function(e) {
            const name = document.getElementById('name').value.trim();
            const price = document.getElementById('price').value;
            const category = document.getElementById('category').value;
            const description = document.getElementById('description').value.trim();
            
            if (!name || !price || !category || !description) {
                e.preventDefault();
                alert('Пожалуйста, заполните все обязательные поля');
                return false;
            }
            
            if (parseFloat(price) <= 0) {
                e.preventDefault();
                alert('Цена должна быть больше нуля');
                return false;
            }
        });
    }
    
    // Add loading animation to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.type === 'submit') {
                this.style.opacity = '0.7';
                this.textContent = 'Загрузка...';
            }
        });
    });
    
    // Lazy loading for images
    const images = document.querySelectorAll('img[loading="lazy"]');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    // Handle keyboard navigation
    document.addEventListener('keydown', function(e) {
        // Close modal on Escape
        if (e.key === 'Escape') {
            closeOrderModal();
        }
    });
});

// Add touch gestures for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        // Add swipe gestures if needed
        // For now, just log the swipe direction
        console.log(diff > 0 ? 'Swipe left' : 'Swipe right');
    }
}

// Optimize for Telegram WebApp
function optimizeForTelegram() {
    // Set viewport height for mobile browsers
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    
    // Update on resize
    window.addEventListener('resize', () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    });
    
    // Prevent zoom on input focus
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            const viewport = document.querySelector('meta[name=viewport]');
            viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1');
        });
        
        input.addEventListener('blur', function() {
            const viewport = document.querySelector('meta[name=viewport]');
            viewport.setAttribute('content', 'width=device-width, initial-scale=1');
        });
    });
}

// Initialize optimizations
document.addEventListener('DOMContentLoaded', optimizeForTelegram);

// Analytics and performance tracking
function trackPageView() {
    if (window.gtag) {
        gtag('config', 'GA_MEASUREMENT_ID', {
            page_title: document.title,
            page_location: window.location.href
        });
    }
}

// Track product views
function trackProductView(productId) {
    console.log(`Product viewed: ${productId}`);
    // Add analytics tracking here if needed
}

// Image Gallery Functions
function changeImage(button, direction) {
    const card = button.closest('.product-card');
    const slides = card.querySelectorAll('.gallery-slide');
    const indicators = card.querySelectorAll('.indicator');
    
    let currentIndex = Array.from(slides).findIndex(slide => slide.classList.contains('active'));
    
    slides[currentIndex].classList.remove('active');
    indicators[currentIndex].classList.remove('active');
    
    currentIndex += direction;
    if (currentIndex >= slides.length) currentIndex = 0;
    if (currentIndex < 0) currentIndex = slides.length - 1;
    
    slides[currentIndex].classList.add('active');
    indicators[currentIndex].classList.add('active');
}

function goToImage(indicator, index) {
    const card = indicator.closest('.product-card');
    const slides = card.querySelectorAll('.gallery-slide');
    const indicators = card.querySelectorAll('.indicator');
    
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(ind => ind.classList.remove('active'));
    
    slides[index].classList.add('active');
    indicators[index].classList.add('active');
}

function changeDetailImage(button, direction) {
    const container = button.closest('.product-detail-image-container');
    const slides = container.querySelectorAll('.detail-gallery-slide');
    const thumbnails = container.querySelectorAll('.thumbnail');
    
    let currentIndex = Array.from(slides).findIndex(slide => slide.classList.contains('active'));
    
    slides[currentIndex].classList.remove('active');
    thumbnails[currentIndex].classList.remove('active');
    
    currentIndex += direction;
    if (currentIndex >= slides.length) currentIndex = 0;
    if (currentIndex < 0) currentIndex = slides.length - 1;
    
    slides[currentIndex].classList.add('active');
    thumbnails[currentIndex].classList.add('active');
}

function goToDetailImage(thumbnail, index) {
    const container = thumbnail.closest('.product-detail-image-container');
    const slides = container.querySelectorAll('.detail-gallery-slide');
    const thumbnails = container.querySelectorAll('.thumbnail');
    
    slides.forEach(slide => slide.classList.remove('active'));
    thumbnails.forEach(thumb => thumb.classList.remove('active'));
    
    slides[index].classList.add('active');
    thumbnails[index].classList.add('active');
}

// Touch/Swipe support for galleries
let galleryTouchStartX = 0;
let galleryTouchEndX = 0;
let galleryTouchStartY = 0;
let galleryTouchEndY = 0;

document.addEventListener('touchstart', function(e) {
    const container = e.target.closest('.product-image-container') || e.target.closest('.product-detail-image-container');
    if (container) {
        galleryTouchStartX = e.changedTouches[0].screenX;
        galleryTouchStartY = e.changedTouches[0].screenY;
        container.classList.add('swiping');
    }
}, { passive: true });

document.addEventListener('touchmove', function(e) {
    const container = e.target.closest('.product-image-container') || e.target.closest('.product-detail-image-container');
    if (container) {
        // Prevent default scrolling behavior during horizontal swipe
        const touchX = e.changedTouches[0].screenX;
        const touchY = e.changedTouches[0].screenY;
        const deltaX = Math.abs(touchX - galleryTouchStartX);
        const deltaY = Math.abs(touchY - galleryTouchStartY);
        
        if (deltaX > deltaY && deltaX > 10) {
            e.preventDefault();
        }
    }
}, { passive: false });

document.addEventListener('touchend', function(e) {
    const container = e.target.closest('.product-image-container') || e.target.closest('.product-detail-image-container');
    if (container) {
        galleryTouchEndX = e.changedTouches[0].screenX;
        galleryTouchEndY = e.changedTouches[0].screenY;
        handleImageSwipe(e.target);
        container.classList.remove('swiping');
    }
}, { passive: true });

function handleImageSwipe(target) {
    const swipeThreshold = 50;
    const deltaX = galleryTouchStartX - galleryTouchEndX;
    const deltaY = Math.abs(galleryTouchStartY - galleryTouchEndY);
    
    // Only process horizontal swipes (not vertical scrolling)
    if (Math.abs(deltaX) > swipeThreshold && Math.abs(deltaX) > deltaY) {
        const productCard = target.closest('.product-card');
        const detailContainer = target.closest('.product-detail-image-container');
        
        const direction = deltaX > 0 ? 1 : -1;
        
        if (productCard) {
            const imageContainer = productCard.querySelector('.product-image-container');
            const slides = imageContainer.querySelectorAll('.gallery-slide');
            
            if (slides.length > 1) {
                changeImage(imageContainer.querySelector('.gallery-next'), direction);
            }
        } else if (detailContainer) {
            const slides = detailContainer.querySelectorAll('.detail-gallery-slide');
            
            if (slides.length > 1) {
                changeDetailImage(detailContainer.querySelector('.gallery-next'), direction);
            }
        }
    }
}

// Performance monitoring
window.addEventListener('load', function() {
    const loadTime = performance.now();
    console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
});
