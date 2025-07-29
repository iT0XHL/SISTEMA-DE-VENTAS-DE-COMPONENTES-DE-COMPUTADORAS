from flask import Blueprint, jsonify, request
import crud

orders_bp = Blueprint('orders', __name__, url_prefix='/orders')

@orders_bp.route('/', methods=['GET'])
def get_orders():
    """
    Obtiene todas las órdenes, con filtros opcionales:
    - search: texto libre (número de orden, correo de usuario)
    - status: estado de la orden (pending, paid, etc.)
    - payment_method: método de pago
    - date_from, date_to: rango de fechas (YYYY-MM-DD)
    """
    filters = {
        'search': request.args.get('search', type=str),
        'status': request.args.get('status', type=str),
        'payment_method': request.args.get('payment_method', type=str),
        'date_from': request.args.get('date_from', type=str),
        'date_to': request.args.get('date_to', type=str),
    }
    orders = crud.get_all_orders(**filters)
    return jsonify([order.to_dict() for order in orders]), 200

@orders_bp.route('/<order_id>', methods=['GET'])
def get_order(order_id):
    """Obtiene una orden específica por su ID."""
    order = crud.get_order_by_id(order_id)
    if not order:
        return jsonify({'error': 'Orden no encontrada'}), 404
    return jsonify(order.to_dict()), 200

@orders_bp.route('/', methods=['POST'])
def add_order():
    """Crea una nueva orden con los datos proporcionados en el cuerpo de la petición."""
    data = request.get_json() or {}
    try:
        order = crud.create_order(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    return jsonify(order.to_dict()), 201

@orders_bp.route('/<order_id>', methods=['PUT'])
def update_order(order_id):
    """Actualiza una orden existente."""
    data = request.get_json() or {}
    order = crud.update_order(order_id, data)
    if not order:
        return jsonify({'error': 'Orden no encontrada'}), 404
    return jsonify(order.to_dict()), 200

@orders_bp.route('/<order_id>', methods=['DELETE'])
def delete_order(order_id):
    """Elimina una orden por su ID."""
    success = crud.delete_order(order_id)
    if not success:
        return jsonify({'error': 'Orden no encontrada'}), 404
    return '', 204
