// Favorites Management

class Favorites {
    constructor() {
        this.items = this.loadFavorites();
        this.init();
    }

    init() {
        this.updateFavoritesDisplay();
        this.updateFavoritesCount();
    }

    loadFavorites() {
        const favoritesData = localStorage.getItem('premium_store_favorites');
        return favoritesData ? JSON.parse(favoritesData) : [];
    }

    saveFavorites() {
        localStorage.setItem('premium_store_favorites', JSON.stringify(this.items));
        this.updateFavoritesCount();
    }

    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (!existingItem) {
            this.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image_url: product.image_url,
                category: product.category,
                description: product.description
            });
            this.saveFavorites();
            this.showAddedToFavoritesMessage(product.name);
        }
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveFavorites();
        this.updateFavoritesDisplay();
        this.updateHeartIcons();
    }

    toggleItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            this.removeItem(product.id);
            return false; // Removed from favorites
        } else {
            this.addItem(product);
            return true; // Added to favorites
        }
    }

    isInFavorites(productId) {
        return this.items.some(item => item.id === productId);
    }

    updateFavoritesCount() {
        const favoritesCounts = document.querySelectorAll('.favorites-count');
        const totalItems = this.items.length;
        
        favoritesCounts.forEach(count => {
            count.textContent = totalItems;
            count.style.display = totalItems > 0 ? 'inline' : 'none';
        });
    }

    updateFavoritesDisplay() {
        const favoritesContainer = document.getElementById('favorites-items');
        const emptyFavorites = document.getElementById('empty-favorites');

        if (!favoritesContainer) return;

        if (this.items.length === 0) {
            favoritesContainer.style.display = 'none';
            emptyFavorites.style.display = 'block';
            return;
        }

        emptyFavorites.style.display = 'none';
        favoritesContainer.style.display = 'grid';

        favoritesContainer.innerHTML = this.items.map(item => `
            <div class="product-card">
                <div class="product-image">
                    <img src="${item.image_url}" alt="${item.name}" loading="lazy">
                    <button class="favorite-btn active" onclick="toggleFavorite({
                        id: ${item.id},
                        name: '${item.name.replace(/'/g, "\\'")}',
                        price: ${item.price},
                        category: '${item.category}',
                        image_url: '${item.image_url}',
                        description: '${item.description.replace(/'/g, "\\'")}'
                    })">
                        <span class="heart-icon">♥</span>
                    </button>
                </div>
                <div class="product-info">
                    <h3 class="product-name">${item.name}</h3>
                    <p class="product-category">${item.category}</p>
                    <p class="product-price">${this.formatPrice(item.price)}</p>
                    <div class="product-actions">
                        <a href="/product/${item.id}" class="btn btn-primary">Подробнее</a>
                        <button class="btn btn-secondary" onclick="addToCart({
                            id: ${item.id},
                            name: '${item.name.replace(/'/g, "\\'")}',
                            price: ${item.price},
                            category: '${item.category}',
                            image_url: '${item.image_url}'
                        })">В корзину</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    updateHeartIcons() {
        const heartButtons = document.querySelectorAll('.favorite-btn');
        heartButtons.forEach(button => {
            const productId = parseInt(button.getAttribute('data-product-id'));
            if (productId && this.isInFavorites(productId)) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }

    formatPrice(price) {
        return `${price.toLocaleString('ru-RU')} сум`;
    }

    showAddedToFavoritesMessage(productName) {
        const message = document.createElement('div');
        message.className = 'favorites-notification';
        message.innerHTML = `
            <div class="notification-content">
                ♥ ${productName} добавлен в избранное
                <button onclick="this.parentElement.parentElement.remove()" class="notification-close">×</button>
            </div>
        `;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            if (message.parentNode) {
                message.remove();
            }
        }, 3000);
    }
}

// Initialize favorites
const favorites = new Favorites();

// Global functions
function toggleFavorite(product) {
    const isAdded = favorites.toggleItem(product);
    
    // Update heart icon for current product
    const button = event.target.closest('.favorite-btn');
    if (button) {
        if (isAdded) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    }
    
    return false; // Prevent link navigation
}

// Update favorites count and heart icons on page load
document.addEventListener('DOMContentLoaded', function() {
    favorites.updateFavoritesCount();
    favorites.updateHeartIcons();
});