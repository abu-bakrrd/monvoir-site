from app import db
from datetime import datetime

class Category(db.Model):
    """Category model for product organization"""
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    description = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationship with products
    products = db.relationship('Product', backref='category_obj', lazy=True)
    
    def __repr__(self):
        return f'<Category {self.name}>'

class Product(db.Model):
    """Product model for the store"""
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    price = db.Column(db.Float, nullable=False)
    category = db.Column(db.String(100), nullable=False)  # Keep string for backward compatibility
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=True)  # New foreign key
    description = db.Column(db.Text, nullable=False)
    image_url = db.Column(db.String(500), nullable=True)
    image_gallery = db.Column(db.Text, nullable=True)  # JSON string for multiple images
    color = db.Column(db.String(50), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<Product {self.name}>'
    
    def formatted_price(self):
        return f"{self.price:,.0f}".replace(",", " ") + " сум"

    
    def get_image_gallery(self):
        """Return list of gallery images"""
        if self.image_gallery:
            import json
            try:
                return json.loads(self.image_gallery)
            except:
                return []
        return []
    
    def get_all_images(self):
        """Return all images including main image and gallery"""
        images = []
        if self.image_url:
            images.append(self.image_url)
        images.extend(self.get_image_gallery())
        return images
