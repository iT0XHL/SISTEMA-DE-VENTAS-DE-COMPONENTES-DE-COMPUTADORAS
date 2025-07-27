from flask import Blueprint, jsonify, request
import crud

users_bp = Blueprint('users', __name__, url_prefix='/users')

@users_bp.route('/', methods=['GET'])
def get_users():
    users = crud.get_all_users()
    return jsonify([u.to_dict() for u in users])

@users_bp.route('/<user_id>', methods=['GET'])
def get_user(user_id):
    user = crud.get_user_by_id(user_id)
    return (jsonify(user.to_dict()), 200) if user else ('', 404)

@users_bp.route('/', methods=['POST'])
def add_user():
    data = request.json
    user = crud.create_user(data)
    return jsonify(user.to_dict()), 201

@users_bp.route('/<user_id>', methods=['PUT'])
def update_user(user_id):
    data = request.json
    user = crud.update_user(user_id, data)
    return (jsonify(user.to_dict()), 200) if user else ('', 404)

@users_bp.route('/<user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = crud.delete_user(user_id)
    return ('', 204) if user else ('', 404)
