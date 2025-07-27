from flask import Blueprint, jsonify, request
import crud

cart_items_bp = Blueprint('cart_items', __name__, url_prefix='/cart_items')

@cart_items_bp.route('/', methods=['GET'])
def get_cart_items():
    items = crud.get_all_cart_items()
    return jsonify([i.to_dict() for i in items])

@cart_items_bp.route('/<cart_item_id>', methods=['GET'])
def get_cart_item(cart_item_id):
    item = crud.get_cart_item_by_id(cart_item_id)
    return (jsonify(item.to_dict()), 200) if item else ('', 404)

@cart_items_bp.route('/add', methods=['POST'])
def add_or_update_cart_item():
    data = request.json
    print("DEBUG POST /cart_items/add:", data)  # <-- AGREGA ESTO
    user_id = data.get('user_id')
    product_id = data.get('product_id')
    quantity = data.get('quantity', 1)
    if not user_id or not product_id:
        return jsonify({"message": "Falta user_id o product_id"}), 400
    try:
        item = crud.add_product_to_cart(user_id, product_id, quantity)
        return jsonify(item.to_dict()), 200
    except Exception as e:
        print("ERROR en add_or_update_cart_item:", e)  # <-- AGREGA ESTO
        return jsonify({"message": str(e)}), 400


@cart_items_bp.route('/<cart_item_id>', methods=['PUT'])
def update_cart_item(cart_item_id):
    data = request.json
    # Solo acepta fields válidos, y los filtra
    allowed_fields = {'quantity', 'price'}
    updates = {k: v for k, v in data.items() if k in allowed_fields}
    item = crud.update_cart_item(cart_item_id, updates)
    return (jsonify(item.to_dict()), 200) if item else ('', 404)

@cart_items_bp.route('/<cart_item_id>', methods=['DELETE'])
def delete_cart_item(cart_item_id):
    item = crud.delete_cart_item(cart_item_id)
    return ('', 204) if item else ('', 404)
