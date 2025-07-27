from database import db
from sqlalchemy.dialects.mysql import JSON, LONGBLOB
from sqlalchemy.sql import func
import uuid

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.String(36), primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    full_name = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), default='customer')
    created_at = db.Column(db.DateTime, server_default=func.now())
    updated_at = db.Column(db.DateTime, server_default=func.now(), onupdate=func.now())
    carts = db.relationship("Cart", back_populates="user", cascade="all, delete-orphan")
    orders = db.relationship("Order", back_populates="user", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "email": self.email,
            "full_name": self.full_name,
            "role": self.role,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }

class Category(db.Model):
    __tablename__ = 'categories'
    id = db.Column(db.String(36), primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    description = db.Column(db.Text)
    is_active = db.Column(db.Boolean, default=True)
    sort_order = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, server_default=func.now())
    updated_at = db.Column(db.DateTime, server_default=func.now(), onupdate=func.now())
    products = db.relationship("Product", back_populates="category", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "is_active": self.is_active,
            "sort_order": self.sort_order,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }

class Product(db.Model):
    __tablename__ = 'products'
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    product_code = db.Column(db.String(50), unique=True, nullable=False)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    long_description = db.Column(db.Text)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    stock = db.Column(db.Integer, default=0)
    min_stock = db.Column(db.Integer, default=5)
    category_id = db.Column(db.String(36), db.ForeignKey('categories.id'))
    brand = db.Column(db.String(100))
    model = db.Column(db.String(100))
    image_url = db.Column(db.Text)
    image_urls = db.Column(JSON)
    specifications = db.Column(JSON)
    features = db.Column(JSON)
    is_active = db.Column(db.Boolean, default=True)
    weight = db.Column(db.Numeric(8, 2))
    dimensions = db.Column(db.String(100))
    warranty_months = db.Column(db.Integer, default=12)
    created_at = db.Column(db.DateTime, server_default=func.now())
    updated_at = db.Column(db.DateTime, server_default=func.now(), onupdate=func.now())
    category = db.relationship("Category", back_populates="products")
    cart_items = db.relationship("CartItem", back_populates="product")
    order_items = db.relationship("OrderItem", back_populates="product")

    def to_dict(self):
        return {
            "id": self.id,
            "product_code": self.product_code,
            "name": self.name,
            "description": self.description or "",
            "long_description": self.long_description or "",
            "price": float(self.price) if self.price is not None else None,
            "stock": self.stock,
            "min_stock": self.min_stock,
            "category_id": self.category_id,
            "brand": self.brand,
            "model": self.model,
            "image_url": self.image_url,
            "image_urls": self.image_urls,
            "specifications": self.specifications,
            "features": self.features,
            "is_active": self.is_active,
            "weight": float(self.weight) if self.weight is not None else None,
            "dimensions": self.dimensions,
            "warranty_months": self.warranty_months,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }

class Cart(db.Model):
    __tablename__ = 'carts'
    id = db.Column(db.String(36), primary_key=True)
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, server_default=func.now())
    updated_at = db.Column(db.DateTime, server_default=func.now(), onupdate=func.now())
    user = db.relationship("User", back_populates="carts")
    cart_items = db.relationship("CartItem", back_populates="cart", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }

class CartItem(db.Model):
    __tablename__ = 'cart_items'
    id = db.Column(db.String(36), primary_key=True)
    cart_id = db.Column(db.String(36), db.ForeignKey('carts.id'))
    product_id = db.Column(db.String(36), db.ForeignKey('products.id'))
    quantity = db.Column(db.Integer, default=1, nullable=False)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    created_at = db.Column(db.DateTime, server_default=func.now())
    cart = db.relationship("Cart", back_populates="cart_items")
    product = db.relationship("Product", back_populates="cart_items")

    def to_dict(self):
        return {
            "id": self.id,
            "cart_id": self.cart_id,
            "product_id": self.product_id,
            "quantity": self.quantity,
            "price": float(self.price) if self.price is not None else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "name": self.product.name if self.product else None,         # nombre del producto
            "image_url": self.product.image_url if self.product else None, # imagen del producto
            "stock": self.product.stock if self.product else None,       # stock actual del producto
        }

class Order(db.Model):
    __tablename__ = 'orders'
    id = db.Column(db.String(36), primary_key=True)
    order_number = db.Column(db.String(50), unique=True, nullable=False)
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'))
    total_amount = db.Column(db.Numeric(10, 2), nullable=False)
    status = db.Column(db.String(50), default='pending')
    payment_method = db.Column(db.String(50))
    shipping_address = db.Column(JSON)
    tracking_number = db.Column(db.String(100))
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, server_default=func.now())
    updated_at = db.Column(db.DateTime, server_default=func.now(), onupdate=func.now())
    user = db.relationship("User", back_populates="orders")
    order_items = db.relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
    invoices = db.relationship("Invoice", back_populates="order", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "order_number": self.order_number,
            "user_id": self.user_id,
            "total_amount": float(self.total_amount) if self.total_amount is not None else None,
            "status": self.status,
            "payment_method": self.payment_method,
            "shipping_address": self.shipping_address,
            "tracking_number": self.tracking_number,
            "notes": self.notes,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }

class OrderItem(db.Model):
    __tablename__ = 'order_items'
    id = db.Column(db.String(36), primary_key=True)
    order_id = db.Column(db.String(36), db.ForeignKey('orders.id'))
    product_id = db.Column(db.String(36), db.ForeignKey('products.id'))
    product_code = db.Column(db.String(50), nullable=False)
    product_name = db.Column(db.String(255), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    unit_price = db.Column(db.Numeric(10,2), nullable=False)
    total_price = db.Column(db.Numeric(10,2), nullable=False)
    created_at = db.Column(db.DateTime, server_default=func.now())
    order = db.relationship("Order", back_populates="order_items")
    product = db.relationship("Product", back_populates="order_items")

    def to_dict(self):
        return {
            "id": self.id,
            "order_id": self.order_id,
            "product_id": self.product_id,
            "product_code": self.product_code,
            "product_name": self.product_name,
            "quantity": self.quantity,
            "unit_price": float(self.unit_price) if self.unit_price is not None else None,
            "total_price": float(self.total_price) if self.total_price is not None else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }

class Invoice(db.Model):
    __tablename__ = 'invoices'
    id = db.Column(db.String(36), primary_key=True)
    order_id = db.Column(db.String(36), db.ForeignKey('orders.id'))
    invoice_number = db.Column(db.String(50), unique=True, nullable=False)
    customer_name = db.Column(db.String(255))
    customer_dni = db.Column(db.String(20))
    pdf_data = db.Column(LONGBLOB)
    created_at = db.Column(db.DateTime, server_default=func.now())
    order = db.relationship("Order", back_populates="invoices")

    def to_dict(self):
        return {
            "id": self.id,
            "order_id": self.order_id,
            "invoice_number": self.invoice_number,
            "customer_name": self.customer_name,
            "customer_dni": self.customer_dni,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }

