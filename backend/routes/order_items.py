from flask import Blueprint, jsonify, request
import crud

order_items_bp = Blueprint('order_items', __name__, url_prefix='/order_items')

@order_items_bp.route('/', methods=['GET'])
def get_order_items():
    order_id = request.args.get('order_id')
    if order_id:
        items = crud.get_order_items_by_order_id(order_id)
        return jsonify([i.to_dict() for i in items])
    items = crud.get_all_order_items()
    return jsonify([i.to_dict() for i in items])

@order_items_bp.route('/<item_id>', methods=['GET'])
def get_order_item(item_id):
    item = crud.get_order_item_by_id(item_id)
    return (jsonify(item.to_dict()), 200) if item else ('', 404)

@order_items_bp.route('/', methods=['POST'])
def add_order_item():
    data = request.json
    item = crud.create_order_item(data)
    return jsonify(item.to_dict()), 201

@order_items_bp.route('/<item_id>', methods=['PUT'])
def update_order_item(item_id):
    data = request.json
    item = crud.update_order_item(item_id, data)
    return (jsonify(item.to_dict()), 200) if item else ('', 404)

@order_items_bp.route('/<item_id>', methods=['DELETE'])
def delete_order_item(item_id):
    item = crud.delete_order_item(item_id)
    return ('', 204) if item else ('', 404)
