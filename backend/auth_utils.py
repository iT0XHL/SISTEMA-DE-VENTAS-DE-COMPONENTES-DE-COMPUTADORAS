from functools import wraps
from flask import request, jsonify
import jwt
import os

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")

def admin_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            parts = request.headers['Authorization'].split(" ")
            if len(parts) == 2 and parts[0] == "Bearer":
                token = parts[1]
        if not token:
            return jsonify({"message": "Token requerido"}), 401
        try:
            data = jwt.decode(token, JWT_SECRET_KEY, algorithms=["HS256"])
            if data.get('role') != 'admin':
                return jsonify({"message": "Solo administradores"}), 403
        except Exception as e:
            return jsonify({"message": f"Token inválido: {str(e)}"}), 401
        return f(*args, **kwargs)
    return decorated
