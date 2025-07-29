from flask import Blueprint, jsonify, request
import crud
from auth_utils import admin_required
from sqlalchemy import or_, func
from models import Product

products_bp = Blueprint('products', __name__, url_prefix='/products')

@products_bp.route('/', methods=['GET'])
def get_products():
    search = request.args.get("search", type=str)
    category = request.args.get("category", type=str)
    brand = request.args.get("brand", type=str)
    sortBy = request.args.get("sortBy", type=str)
    is_active_param = request.args.get("is_active", type=str)

    query = Product.query

    # Filtrar activos/inactivos si se manda el filtro
    if is_active_param is not None and is_active_param.lower() != "all":
        if is_active_param.lower() in ("true", "1"):
            query = query.filter_by(is_active=True)
        elif is_active_param.lower() in ("false", "0"):
            query = query.filter_by(is_active=False)

    # Búsqueda general: código, nombre, descripción, modelo, marca
    if search:
        like_str = f"%{search.lower()}%"
        query = query.filter(
            or_(
                func.lower(Product.product_code).like(like_str),
                func.lower(Product.name).like(like_str),
                func.lower(Product.description).like(like_str),
                func.lower(Product.long_description).like(like_str),
                func.lower(Product.model).like(like_str),
                func.lower(Product.brand).like(like_str)
            )
        )

    # Filtrar por categoría
    if category and category != "all":
        query = query.filter_by(category_id=category)

    # Filtrar por marca
    if brand and brand != "all":
        query = query.filter(func.lower(Product.brand) == brand.lower())

    # Ordenar
    if sortBy == "name":
        query = query.order_by(Product.name.asc())
    elif sortBy == "price_asc":
        query = query.order_by(Product.price.asc())
    elif sortBy == "price_desc":
        query = query.order_by(Product.price.desc())
    elif sortBy == "stock":
        query = query.order_by(Product.stock.desc())
    else:
        query = query.order_by(Product.created_at.desc())

    productos = query.all()
    return jsonify([p.to_dict() for p in productos])

@products_bp.route('/brands', methods=['GET'])
def get_brands():
    brands = Product.query.with_entities(Product.brand).filter(Product.is_active == True).distinct().all()
    # Devuelve solo la lista de nombres
    return jsonify([b[0] for b in brands if b[0]])

@products_bp.route('/<product_id>', methods=['GET'])
def get_product(product_id):
    product = crud.get_product_by_id(product_id)
    return (jsonify(product.to_dict()), 200) if product else ('', 404)

@products_bp.route('/', methods=['POST'])
@admin_required
def add_product():
    data = request.json
    # Validar que el stock no sea negativo
    if 'stock' in data and data['stock'] < 0:
        return jsonify({"message": "El stock no puede ser negativo."}), 400
    product = crud.create_product(data)
    return jsonify(product.to_dict()), 201

@products_bp.route('/<product_id>', methods=['PUT'])
@admin_required
def update_product(product_id):
    data = request.json
    # Validar que el stock no sea negativo
    if 'stock' in data and data['stock'] < 0:
        return jsonify({"message": "El stock no puede ser negativo."}), 400
    product = crud.update_product(product_id, data)
    return (jsonify(product.to_dict()), 200) if product else ('', 404)

@products_bp.route('/<product_id>', methods=['DELETE'])
@admin_required
def delete_product(product_id):
    product = crud.delete_product(product_id)
    return ('', 204) if product else ('', 404)
