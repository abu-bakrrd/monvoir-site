import os
import logging
from flask import Flask, render_template, request, redirect, url_for, flash
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase
from werkzeug.utils import secure_filename
from werkzeug.middleware.proxy_fix import ProxyFix
import sqlite3
from datetime import datetime
from dotenv import load_dotenv
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.DEBUG)

class Base(DeclarativeBase):
    pass

db = SQLAlchemy(model_class=Base)

# Create the app
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "default_secret_key_for_development")
app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)

# Configure the database
import os

render_db = os.environ.get("RENDER_DATABASE_URL")
local_fallback = "sqlite:///local.db"

app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("RENDER_DATABASE_URL")

app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
    "pool_recycle": 300,
    "pool_pre_ping": True,
}

app.config['UPLOAD_FOLDER'] = 'static/images'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB


# Initialize the app with the extension
db.init_app(app)

# Import models after db initialization
from models import Product

def init_db():
    """Initialize database and create sample data"""
    with app.app_context():
        db.create_all()
        
        # Create tables if they don't exist
        try:
            # Check if tables exist by trying to query
            Product.query.first()
        except Exception:
            # Tables don't exist or there's a schema mismatch, create them
            db.create_all()
        
        # Check if we already have categories
        from models import Category
        if Category.query.first() is None:
            # Create default categories
            default_categories = [
                Category(name="Верхняя одежда", description="Пальто, куртки, плащи"),
                Category(name="Обувь", description="Ботинки, туфли, кроссовки"),
                Category(name="Рубашки", description="Рубашки и блузы"),
                Category(name="Джинсы", description="Джинсы и брюки"),
                Category(name="Платья", description="Платья и сарафаны"),
                Category(name="Аксессуары", description="Сумки, ремни, украшения")
            ]
            
            for category in default_categories:
                db.session.add(category)
            
            db.session.commit()
        
        # Check if we already have products
        if Product.query.first() is None:
            # Create sample products
            sample_products = [
                Product(
                    name="Черное элегантное пальто",
                    price=1599000.0,
                    category="Верхняя одежда",
                    description="Стильное черное пальто из премиальной шерсти. Идеально для осенне-зимнего сезона. Классический крой подчеркнет вашу элегантность.",
                    image_url="https://via.placeholder.com/400x500/2C2C2C/FFFFFF?text=Черное+пальто",
                    image_gallery='["https://via.placeholder.com/400x500/1A1A1A/FFFFFF?text=Пальто+2", "https://via.placeholder.com/400x500/333333/FFFFFF?text=Пальто+3"]',
                    color="black"
                )
            ]
            
            for product in sample_products:
                db.session.add(product)
            
            db.session.commit()
            logging.info("Sample products created successfully")

@app.route('/')
def index():
    """Main catalog page"""
    search = request.args.get('search', '').strip()
    category = request.args.get('category', '')
    color = request.args.get('color', '')
    sort_by = request.args.get('sort', 'name')
    min_price = request.args.get('min_price', type=float)
    max_price = request.args.get('max_price', type=float)
    
    query = Product.query
    from models import Category
    categories = Category.query.all()
    category_names = [cat.name for cat in categories]
    
    # Search filter
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            db.or_(
                Product.name.ilike(search_term),
                Product.description.ilike(search_term),
                Product.category.ilike(search_term)
            )
        )
    
    # Filter by category
    if category:
        query = query.filter(Product.category == category)
    
    # Filter by color (assuming colors are mentioned in product names or descriptions)
    if color:
        color_terms = {
            'black': ['черн', 'black', 'чёрн'],
            'white': ['бел', 'white'],
            'brown': ['коричнев', 'brown', 'шоколад'],
            'beige': ['беж', 'beige', 'песочн', 'телесн'],
            'gray': ['сер', 'gray', 'grey', 'графит'],
            'blue': ['син', 'blue', 'голуб', 'лазур', 'небесн'],
            'red': ['красн', 'red', 'бордов', 'малинов'],
            'green': ['зел', 'green', 'хаки', 'изумруд'],
            'yellow': ['желт', 'yellow', 'золот', 'янтар'],
            'orange': ['оранж', 'orange', 'апельсин'],
            'purple': ['фиолет', 'purple', 'сиренев', 'лилов'],
            'pink': ['розов', 'pink', 'пудров'],
            'gold': ['золот', 'gold'],
            'silver': ['серебр', 'silver'],
        }
        if color in color_terms:
            color_filter = db.or_(*[
                Product.name.ilike(f"%{term}%") 
                for term in color_terms[color]
            ] + [
                Product.description.ilike(f"%{term}%") 
                for term in color_terms[color]
            ])
            query = query.filter(color_filter)

    
    # Filter by price range
    if min_price is not None:
        query = query.filter(Product.price >= min_price)
    if max_price is not None:
        query = query.filter(Product.price <= max_price)
    
    # Sort products
    if sort_by == 'price_asc':
        query = query.order_by(Product.price.asc())
    elif sort_by == 'price_desc':
        query = query.order_by(Product.price.desc())
    elif sort_by == 'newest':
        query = query.order_by(Product.created_at.desc())
    else:  # name
        query = query.order_by(Product.name.asc())
    
    products = query.all()
    
    return render_template('index.html', 
                         products=products, 
                         categories=category_names)

@app.route('/product/<int:product_id>')
def product_detail(product_id):
    """Product detail page"""
    product = Product.query.get_or_404(product_id)
    return render_template('product.html', product=product)

import requests
from flask import request, jsonify

BOT_TOKEN = "7751530491:AAGmzfztRlNOUJ5CPMvkDMSmBSj6a3Xph_U"
ADMIN_CHAT_ID = 5644397480  # твой Telegram ID

@app.route('/order', methods=['POST'])
def receive_order():
    data = request.get_json()
    message = data.get("message")

    if not message:
        return jsonify({"success": False}), 400

    url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"
    r = requests.post(url, json={
        "chat_id": ADMIN_CHAT_ID,
        "text": message
    })

    if r.ok:
        return jsonify({"success": True})
    return jsonify({"success": False}), 500


@app.route('/cart')
def cart():
    """Shopping cart page"""
    return render_template('cart.html')

@app.route('/favorites')
def favorites():
    """Favorites page"""
    return render_template('favorites.html')

# Initialize database when app starts
with app.app_context():
    init_db()
