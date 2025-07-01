// Shopping Cart Management

class ShoppingCart {
    constructor() {
        this.items = this.loadCart();
        this.init();
    }

    init() {
        this.updateCartDisplay();
        this.updateCartCount();
    }

    loadCart() {
        const cartData = localStorage.getItem('premium_store_cart');
        return cartData ? JSON.parse(cartData) : [];
    }

    saveCart() {
        localStorage.setItem('premium_store_cart', JSON.stringify(this.items));
        this.updateCartCount();
    }

    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image_url: product.image_url,
                category: product.category,
                quantity: 1
            });
        }
        
        this.saveCart();
        this.showAddedToCartMessage(product.name);
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartDisplay();
    }

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeItem(productId);
            } else {
                item.quantity = quantity;
                this.saveCart();
                this.updateCartDisplay();
            }
        }
    }

    getTotalItems() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    getTotalPrice() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    updateCartCount() {
        const cartCounts = document.querySelectorAll('.cart-count');
        const totalItems = this.getTotalItems();
        
        cartCounts.forEach(count => {
            count.textContent = totalItems;
            count.style.display = totalItems > 0 ? 'inline' : 'none';
        });
    }

    updateCartDisplay() {
        const cartItemsContainer = document.getElementById('cart-items');
        const emptyCart = document.getElementById('empty-cart');
        const cartSummary = document.getElementById('cart-summary');

        if (!cartItemsContainer) return;

        if (this.items.length === 0) {
            cartItemsContainer.style.display = 'none';
            cartSummary.style.display = 'none';
            emptyCart.style.display = 'block';
            return;
        }

        emptyCart.style.display = 'none';
        cartItemsContainer.style.display = 'block';
        cartSummary.style.display = 'block';

        cartItemsContainer.innerHTML = this.items.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-image">
                    <img src="${item.image_url}" alt="${item.name}">
                </div>
                <div class="cart-item-info">
                    <h3 class="cart-item-name">${item.name}</h3>
                    <p class="cart-item-category">${item.category}</p>
                    <p class="cart-item-price">${this.formatPrice(item.price)}</p>
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-controls">
                        <button onclick="cart.updateQuantity(${item.id}, ${item.quantity - 1})" class="quantity-btn">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button onclick="cart.updateQuantity(${item.id}, ${item.quantity + 1})" class="quantity-btn">+</button>
                    </div>
                    <button onclick="cart.removeItem(${item.id})" class="remove-btn">Удалить</button>
                </div>
                <div class="cart-item-total">
                    ${this.formatPrice(item.price * item.quantity)}
                </div>
            </div>
        `).join('');

        // Update summary
        document.getElementById('total-items').textContent = this.getTotalItems();
        document.getElementById('total-price').textContent = this.formatPrice(this.getTotalPrice());
    }

    formatPrice(price) {
        return `${price.toLocaleString('ru-RU')} сум`;
    }

    showAddedToCartMessage(productName) {
        // Create temporary message
        const message = document.createElement('div');
        message.className = 'cart-notification';
        message.innerHTML = `
            <div class="notification-content">
                ✓ ${productName} добавлен в корзину
                <button onclick="this.parentElement.parentElement.remove()" class="notification-close">×</button>
            </div>
        `;
        
        document.body.appendChild(message);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            if (message.parentNode) {
                message.remove();
            }
        }, 3000);
    }

    clear() {
        this.items = [];
        this.saveCart();
        this.updateCartDisplay();
    }
}

// Initialize cart
const cart = new ShoppingCart();

// Cart functions for global use
function addToCart(product, buttonElement) {
    if (!buttonElement) {
        cart.addItem(product);
        return;
    }
    
    const existingItem = cart.items.find(item => item.id === product.id);
    const originalText = buttonElement.innerHTML;
    
    if (existingItem) {
        // Item already in cart, just update quantity
        cart.updateQuantity(product.id, existingItem.quantity + 1);
        
        // Update button to show "Already in Cart"
        buttonElement.innerHTML = 'Уже в корзине';
        buttonElement.style.background = '#28a745';
        buttonElement.disabled = true;
        
        // Reset button after 2 seconds
        setTimeout(() => {
            buttonElement.innerHTML = originalText;
            buttonElement.style.background = '';
            buttonElement.disabled = false;
        }, 2000);
    } else {
        // Add new item
        cart.addItem(product);
        
        // Update button temporarily
        buttonElement.innerHTML = 'Добавлено!';
        buttonElement.style.background = '#28a745';
        buttonElement.disabled = true;
        
        // Reset button after 2 seconds
        setTimeout(() => {
            buttonElement.innerHTML = originalText;
            buttonElement.style.background = '';
            buttonElement.disabled = false;
        }, 2000);
    }
}

function checkoutCart() {
    const modal = document.getElementById('checkoutModal');
    const checkoutItems = document.getElementById('checkout-items');
    const checkoutTotal = document.getElementById('checkout-total');
    
    if (cart.items.length === 0) {
        alert('Корзина пуста');
        return;
    }
    
    // Populate checkout items
    checkoutItems.innerHTML = cart.items.map(item => `
        <div class="checkout-item">
            <span>${item.name} × ${item.quantity}</span>
            <span>${cart.formatPrice(item.price * item.quantity)}</span>
        </div>
    `).join('');
    
    checkoutTotal.textContent = cart.formatPrice(cart.getTotalPrice());
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeCheckoutModal() {
    const modal = document.getElementById('checkoutModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

async function confirmOrder() {
    const tg = window.Telegram.WebApp;
    const user = tg?.initDataUnsafe?.user;

    if (!user) {
        alert("Ошибка: не удалось получить данные пользователя.");
        return;
    }

    const orderItems = cart.items.map(item => 
        `📦 ${item.name} — ${item.quantity} шт. × ${item.price} сум`
    ).join('\n');

    const total = cart.getTotalPrice();

    const message = `
🛍 Новый заказ
👤 Пользователь: ${user.first_name} (@${user.username || 'без username'})
🧾 Состав заказа:
${orderItems}

💰 Общая сумма: ${total.toLocaleString('ru-RU')} сум
    `;

    // Отправка на сервер
    const res = await fetch('/order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message
        })
    });

    if (res.ok) {
        alert('✅ Заказ оформлен! Мы свяжемся с вами в ближайшее время.');
        cart.clear();
        closeCheckoutModal();
    } else {
        alert('❌ Ошибка при оформлении заказа.');
    }
}


function clearCart() {
    if (confirm('Вы уверены, что хотите очистить корзину?')) {
        cart.clear();
        closeCheckoutModal();
    }
}

// Update cart count on page load
document.addEventListener('DOMContentLoaded', function() {
    cart.updateCartCount();
});
