from models import db, User, Category, Product, Cart, CartItem, Order, OrderItem, Invoice
from datetime import datetime
from werkzeug.security import generate_password_hash
from sqlalchemy import or_
import uuid
import random
import string
import pytz

# Función helper para la hora de Lima
def now_lima():
    return datetime.now(pytz.timezone('America/Lima'))

# ------------------------- USERS -------------------------
def get_all_users():
    return User.query.all()

def get_user_by_id(user_id):
    return User.query.get(user_id)

def create_user(data):
    # Solo acepta campos explícitos
    password = data.get("password")
    if not password:
        raise ValueError("No se proporcionó contraseña")
    user = User(
        id=str(uuid.uuid4()),
        email=data.get("email"),
        password_hash=generate_password_hash(password),
        full_name=data.get("full_name"),
        role=data.get("role", "customer"),
        created_at=now_lima(),
    )
    db.session.add(user)
    db.session.commit()
    return user

def update_user(user_id, data):
    user = get_user_by_id(user_id)
    if user:
        for key in ['email', 'full_name', 'role']:
            if key in data:
                setattr(user, key, data[key])
        user.updated_at = now_lima()
        db.session.commit()
    return user

def delete_user(user_id):
    user = get_user_by_id(user_id)
    if user:
        db.session.delete(user)
        db.session.commit()
    return user

# --------------------- CATEGORIES ------------------------
def get_all_categories():
    return Category.query.all()

def get_category_by_id(category_id):
    return Category.query.get(category_id)

def create_category(data):
    cat = Category(
        id=data.get("id", str(uuid.uuid4())),
        name=data.get("name"),
        description=data.get("description"),
        is_active=data.get("is_active", True),
        sort_order=data.get("sort_order", 0),
        created_at=now_lima(),
    )
    db.session.add(cat)
    db.session.commit()
    return cat

def update_category(category_id, data):
    category = get_category_by_id(category_id)
    if category:
        for key in ['name', 'description', 'is_active', 'sort_order']:
            if key in data:
                setattr(category, key, data[key])
        category.updated_at = now_lima()
        db.session.commit()
    return category

def delete_category(category_id):
    category = get_category_by_id(category_id)
    if category:
        db.session.delete(category)
        db.session.commit()
    return category

# ---------------------- PRODUCTS -------------------------
def get_all_products():
    return Product.query.all()

def get_product_by_id(product_id):
    return Product.query.get(product_id)

def create_product(data):
    product = Product(
        id=data.get("id", str(uuid.uuid4())),
        product_code=data.get("product_code"),
        name=data.get("name"),
        description=data.get("description"),
        long_description=data.get("long_description"),
        price=data.get("price"),
        stock=data.get("stock"),
        min_stock=data.get("min_stock", 5),
        category_id=data.get("category_id"),
        brand=data.get("brand"),
        model=data.get("model"),
        image_url=data.get("image_url"),
        image_urls=data.get("image_urls"),
        specifications=data.get("specifications"),
        features=data.get("features"),
        is_active=data.get("is_active", True),
        weight=data.get("weight"),
        dimensions=data.get("dimensions"),
        warranty_months=data.get("warranty_months", 12),
        created_at=now_lima(),
    )
    db.session.add(product)
    db.session.commit()
    return product

def update_product(product_id, data):
    product = get_product_by_id(product_id)
    if product:
        for key in [
            'product_code', 'name', 'description', 'long_description', 'price', 'stock', 'min_stock',
            'category_id', 'brand', 'model', 'image_url', 'image_urls', 'specifications', 'features',
            'is_active', 'weight', 'dimensions', 'warranty_months'
        ]:
            if key in data:
                setattr(product, key, data[key])
        product.updated_at = now_lima()
        db.session.commit()
    return product

def delete_product(product_id):
    product = get_product_by_id(product_id)
    if product:
        db.session.delete(product)
        db.session.commit()
    return product

# ----------------------- CARTS ---------------------------
def get_all_carts():
    return Cart.query.all()

def get_cart_by_id(cart_id):
    return Cart.query.get(cart_id)

def create_cart(data):
    cart = Cart(
        id=data.get("id", str(uuid.uuid4())),
        user_id=data.get("user_id"),
        created_at=now_lima(),
    )
    db.session.add(cart)
    db.session.commit()
    return cart

def update_cart(cart_id, updates):
    cart = get_cart_by_id(cart_id)
    if cart and 'user_id' in updates:
        cart.user_id = updates['user_id']
        cart.updated_at = now_lima()
        db.session.commit()
    return cart

def delete_cart(cart_id):
    cart = get_cart_by_id(cart_id)
    if cart:
        db.session.delete(cart)
        db.session.commit()
    return cart

def get_cart_by_user_id(user_id):
    return Cart.query.filter_by(user_id=user_id).first()

def get_or_create_cart_by_user(user_id):
    cart = get_cart_by_user_id(user_id)
    if not cart:
        cart = Cart(id=str(uuid.uuid4()), user_id=user_id, created_at=now_lima())
        db.session.add(cart)
        db.session.commit()
    return cart

# --------------------- CART ITEMS ------------------------
def get_all_cart_items():
    return CartItem.query.all()

def get_cart_item_by_id(cart_item_id):
    return CartItem.query.get(cart_item_id)

def create_cart_item(data):
    cart_item = CartItem(
        id=data.get("id", str(uuid.uuid4())),
        cart_id=data.get("cart_id"),
        product_id=data.get("product_id"),
        quantity=data.get("quantity", 1),
        price=data.get("price"),
        created_at=now_lima(),
    )
    db.session.add(cart_item)
    db.session.commit()
    return cart_item

def update_cart_item(cart_item_id, updates):
    cart_item = get_cart_item_by_id(cart_item_id)
    if cart_item:
        for key in ['quantity', 'price']:
            if key in updates:
                setattr(cart_item, key, updates[key])
        cart_item.updated_at = now_lima()
        db.session.commit()
    return cart_item

def delete_cart_item(cart_item_id):
    cart_item = get_cart_item_by_id(cart_item_id)
    if cart_item:
        db.session.delete(cart_item)
        db.session.commit()
    return cart_item

def get_cart_item_by_cart_and_product(cart_id, product_id):
    return CartItem.query.filter_by(cart_id=cart_id, product_id=product_id).first()

def add_product_to_cart(user_id, product_id, quantity):
    cart = get_or_create_cart_by_user(user_id)
    item = get_cart_item_by_cart_and_product(cart.id, product_id)
    product = get_product_by_id(product_id)
    if not product:
        raise ValueError("Producto no encontrado")
    if product.stock is None:
        raise ValueError("Producto sin stock definido")
    new_quantity = quantity if not item else item.quantity + quantity
    if new_quantity > product.stock:
        raise ValueError(f"Sólo quedan {product.stock} unidades disponibles")
    price_with_igv = float(product.price) * 1.18
    if item:
        item.quantity = new_quantity
        item.price = price_with_igv
        item.updated_at = now_lima()
    else:
        item = CartItem(
            id=str(uuid.uuid4()),
            cart_id=cart.id,
            product_id=product_id,
            quantity=quantity,
            price=price_with_igv,
            created_at=now_lima(),
        )
        db.session.add(item)
    db.session.commit()
    return item

# ----------------------- ORDERS --------------------------
def get_all_orders(search=None, status=None, payment_method=None, date_from=None, date_to=None):
    # Empieza el query
    query = Order.query

    # Join con usuario para buscar nombre/email si search está definido
    if search:
        search = search.strip().lower()
        query = query.join(User, Order.user_id == User.id)
        like_pattern = f"%{search}%"
        query = query.filter(
            or_(
                Order.order_number.ilike(like_pattern),
                User.full_name.ilike(like_pattern),
                User.email.ilike(like_pattern),
            )
        )
    # Filtro por status
    if status:
        query = query.filter(Order.status == status)
    # Filtro por payment_method
    if payment_method:
        query = query.filter(Order.payment_method == payment_method)
    # Filtro por fecha de inicio
    if date_from:
        try:
            date_from_dt = datetime.strptime(date_from, "%Y-%m-%d")
            query = query.filter(Order.created_at >= date_from_dt)
        except Exception:
            pass
    # Filtro por fecha de fin
    if date_to:
        try:
            date_to_dt = datetime.strptime(date_to, "%Y-%m-%d")
            # Incluye todo ese día hasta las 23:59:59
            date_to_dt = date_to_dt.replace(hour=23, minute=59, second=59)
            query = query.filter(Order.created_at <= date_to_dt)
        except Exception:
            pass

    query = query.order_by(Order.created_at.desc())
    return query.all()

def get_order_by_id(order_id):
    return Order.query.get(order_id)

def get_order_items_by_order_id(order_id):
    return OrderItem.query.filter_by(order_id=order_id).all()

def generate_tracking_number():
    today = now_lima().strftime("%Y%m%d")
    random_part = ''.join(random.choices(string.ascii_uppercase + string.digits, k=7))
    return f"PCDOS2-{today}-{random_part}"

def create_order(data):
    items = data.pop('items', [])
    payment_method = data.get("payment_method", None)

    today = now_lima().strftime("%Y%m%d")
    order_number = f"ORD-{today}-{str(uuid.uuid4())[:8]}"

    tracking_number = data.get("tracking_number")
    if not tracking_number:
        tracking_number = generate_tracking_number()

    total_amount = data.get("total_amount")
    if not total_amount:
        total_amount = sum(item["price"] * item["quantity"] for item in items)

    # Usar los mismos valores de payment_method que en frontend para status
    status = data.get("status")
    if not status:
        if payment_method in ("efectivo", "cash", "cash_on_delivery", "transferencia", "bank_transfer"):
            status = "pending"
        elif payment_method in ("tarjeta", "tarjeta_credito", "credit_card", "tarjeta_debito", "debit_card"):
            status = "paid"
        else:
            status = "pending"

    order = Order(
        id=data.get("id", str(uuid.uuid4())),
        order_number=order_number,
        user_id=data.get("user_id"),
        total_amount=total_amount,
        status=status,
        payment_method=payment_method,
        shipping_address=data.get("shipping_address"),
        tracking_number=tracking_number,
        notes=data.get("notes"),
        created_at=now_lima(),
    )
    db.session.add(order)
    db.session.flush()  # Para obtener order.id antes del commit

    # --- Descuento de stock y creación de OrderItems ---
    for item in items:
        product = Product.query.get(item['product_id'])
        if not product:
            continue
        # Descuento de stock automático
        if product.stock is not None:
            new_stock = product.stock - item['quantity']
            if new_stock < 0:
                raise ValueError(f"No hay suficiente stock para el producto {product.name}. Quedan {product.stock}.")
            product.stock = new_stock
            product.updated_at = now_lima()
        order_item = OrderItem(
            id=str(uuid.uuid4()),
            order_id=order.id,
            product_id=product.id,
            product_code=product.product_code,
            product_name=product.name,
            quantity=item['quantity'],
            unit_price=item['price'],
            total_price=item['price'] * item['quantity'],
            created_at=now_lima(),
        )
        db.session.add(order_item)
    db.session.commit()
    
    return order

def update_order(order_id, data):
    order = get_order_by_id(order_id)
    if order:
        for key in ['total_amount', 'status', 'payment_method', 'tracking_number', 'shipping_address', 'notes']:
            if key in data and data[key] is not None:
                setattr(order, key, data[key])
        order.updated_at = now_lima()
        db.session.commit()
    return order

def delete_order(order_id):
    order = get_order_by_id(order_id)
    if order:
        # --- Devuelve stock antes de eliminar la orden ---
        for item in order.order_items:
            product = Product.query.get(item.product_id)
            if product and product.stock is not None:
                product.stock = product.stock + item.quantity
                product.updated_at = now_lima()
        db.session.delete(order)
        db.session.commit()
    return order

# -------------------- ORDER ITEMS ------------------------
def get_all_order_items():
    return OrderItem.query.all()

def get_order_item_by_id(order_item_id):
    return OrderItem.query.get(order_item_id)

def create_order_item(data):
    order_item = OrderItem(
        id=data.get("id", str(uuid.uuid4())),
        order_id=data.get("order_id"),
        product_id=data.get("product_id"),
        product_code=data.get("product_code"),
        product_name=data.get("product_name"),
        quantity=data.get("quantity"),
        unit_price=data.get("unit_price"),
        total_price=data.get("total_price"),
        created_at=now_lima(),
    )
    db.session.add(order_item)
    db.session.commit()
    return order_item

def update_order_item(order_item_id, data):
    order_item = get_order_item_by_id(order_item_id)
    if order_item:
        for key in ['quantity', 'unit_price', 'total_price']:
            if key in data:
                setattr(order_item, key, data[key])
        order_item.updated_at = now_lima()
        db.session.commit()
    return order_item

def delete_order_item(order_item_id):
    order_item = get_order_item_by_id(order_item_id)
    if order_item:
        db.session.delete(order_item)
        db.session.commit()
    return order_item

# --------------------- INVOICES --------------------------
def get_all_invoices():
    return Invoice.query.all()

def get_invoice_by_id(invoice_id):
    return Invoice.query.get(invoice_id)

def create_invoice(data):
    invoice = Invoice(
        id=data.get("id", str(uuid.uuid4())),
        order_id=data.get("order_id"),
        invoice_number=data.get("invoice_number"),
        customer_name=data.get("customer_name"),
        customer_dni=data.get("customer_dni"),
        pdf_data=data.get("pdf_data"),  # ESTA LÍNEA ES LA CLAVE QUE FALTABA
        created_at=now_lima(),
    )
    db.session.add(invoice)
    db.session.commit()
    return invoice


def update_invoice(invoice_id, data):
    invoice = get_invoice_by_id(invoice_id)
    if invoice:
        for key in ['total']:
            if key in data:
                setattr(invoice, key, data[key])
        invoice.updated_at = now_lima()
        db.session.commit()
    return invoice

def delete_invoice(invoice_id):
    invoice = get_invoice_by_id(invoice_id)
    if invoice:
        db.session.delete(invoice)
        db.session.commit()
    return invoice
