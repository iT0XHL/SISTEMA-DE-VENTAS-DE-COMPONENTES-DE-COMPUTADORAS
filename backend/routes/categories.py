from flask import Blueprint, jsonify, request
import crud

categories_bp = Blueprint('categories', __name__, url_prefix='/categories')

@categories_bp.route('/', methods=['GET'])
def get_categories():
    categories = crud.get_all_categories()
    return jsonify([c.to_dict() for c in categories])

@categories_bp.route('/<category_id>', methods=['GET'])
def get_category(category_id):
    category = crud.get_category_by_id(category_id)
    return (jsonify(category.to_dict()), 200) if category else ('', 404)

@categories_bp.route('/', methods=['POST'])
def add_category():
    data = request.json
    category = crud.create_category(data)
    return jsonify(category.to_dict()), 201

@categories_bp.route('/<category_id>', methods=['PUT'])
def update_category(category_id):
    data = request.json
    category = crud.update_category(category_id, data)
    return (jsonify(category.to_dict()), 200) if category else ('', 404)

@categories_bp.route('/<category_id>', methods=['DELETE'])
def delete_category(category_id):
    category = crud.delete_category(category_id)
    return ('', 204) if category else ('', 404)
