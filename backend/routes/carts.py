from flask import Blueprint, jsonify, request
import crud

carts_bp = Blueprint('cart', __name__, url_prefix='/cart')

@carts_bp.route('/', methods=['GET'])
def get_carts():
    carts = crud.get_all_carts()
    return jsonify([c.to_dict() for c in carts])

@carts_bp.route('/<cart_id>', methods=['GET'])
def get_cart(cart_id):
    cart = crud.get_cart_by_id(cart_id)
    return (jsonify(cart.to_dict()), 200) if cart else ('', 404)

@carts_bp.route('/user/<user_id>', methods=['GET'])
def get_cart_by_user(user_id):
    cart = crud.get_or_create_cart_by_user(user_id)
    return (jsonify(cart.to_dict()), 200) if cart else ('', 404)

@carts_bp.route('/', methods=['POST'])
def add_cart():
    data = request.json
    # Solo permite fields válidos
    allowed_fields = {'id', 'user_id', 'created_at', 'updated_at'}
    safe_data = {k: v for k, v in data.items() if k in allowed_fields}
    cart = crud.create_cart(safe_data)
    return jsonify(cart.to_dict()), 201

@carts_bp.route('/<cart_id>', methods=['PUT'])
def update_cart(cart_id):
    data = request.json
    allowed_fields = {'user_id'}
    safe_data = {k: v for k, v in data.items() if k in allowed_fields}
    cart = crud.update_cart(cart_id, safe_data)
    return (jsonify(cart.to_dict()), 200) if cart else ('', 404)

@carts_bp.route('/<cart_id>', methods=['DELETE'])
def delete_cart(cart_id):
    cart = crud.delete_cart(cart_id)
    return ('', 204) if cart else ('', 404)
