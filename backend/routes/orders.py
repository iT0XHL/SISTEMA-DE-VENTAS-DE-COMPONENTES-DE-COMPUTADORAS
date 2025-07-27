from flask import Blueprint, jsonify, request
import crud

orders_bp = Blueprint('orders', __name__, url_prefix='/orders')

@orders_bp.route('/', methods=['GET'])
def get_orders():
    orders = crud.get_all_orders()
    return jsonify([o.to_dict() for o in orders])

@orders_bp.route('/<order_id>', methods=['GET'])
def get_order(order_id):
    order = crud.get_order_by_id(order_id)
    return (jsonify(order.to_dict()), 200) if order else ('', 404)

@orders_bp.route('/', methods=['POST'])
def add_order():
    data = request.json
    order = crud.create_order(data)
    return jsonify(order.to_dict()), 201

@orders_bp.route('/<order_id>', methods=['PUT'])
def update_order(order_id):
    data = request.json
    order = crud.update_order(order_id, data)
    return (jsonify(order.to_dict()), 200) if order else ('', 404)

@orders_bp.route('/<order_id>', methods=['DELETE'])
def delete_order(order_id):
    order = crud.delete_order(order_id)
    return ('', 204) if order else ('', 404)
