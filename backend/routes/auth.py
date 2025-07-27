import jwt
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import create_access_token
from werkzeug.security import check_password_hash
from datetime import datetime, timedelta
from models import User
import crud

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json or {}
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"message": "Email y contraseña requeridos"}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"message": "Usuario no encontrado"}), 401

    if not check_password_hash(user.password_hash, password):
        return jsonify({"message": "Contraseña incorrecta"}), 401

    # Generar JWT con flask-jwt-extended
    additional_claims = {
        "email": user.email,
        "full_name": user.full_name,
        "role": user.role,
    }
    token = create_access_token(
        identity=user.id,
        additional_claims=additional_claims,
        expires_delta=timedelta(hours=4),
    )

    return jsonify({
        "user": user.to_dict(),
        "token": token,
    })


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json or {}
    # Validación mínima (puedes mejorarla)
    if not data.get("email") or not data.get("password") or not data.get("full_name"):
        return jsonify({"message": "Faltan datos obligatorios"}), 400

    # Chequea que el email no esté registrado (puedes tener esto dentro de crud.create_user si prefieres)
    from models import User
    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"message": "El correo ya está registrado"}), 400

    try:
        user = crud.create_user(data)
        return jsonify(user.to_dict()), 201
    except Exception as e:
        return jsonify({"message": str(e)}), 500
