from flask import Blueprint, jsonify, request, current_app
import jwt
from functools import wraps
from models import Product, User, Order, db  # <-- Importa db aquí
from sqlalchemy import func

stats_bp = Blueprint("stats", __name__)

# Decorador para requerir admin en el JWT
def admin_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            return jsonify({"message": "Token requerido"}), 401

        token = auth_header.replace("Bearer ", "")
        try:
            payload = jwt.decode(token, current_app.config["JWT_SECRET_KEY"], algorithms=["HS256"])
            if payload.get("role") != "admin":
                return jsonify({"message": "No autorizado"}), 403
        except Exception:
            return jsonify({"message": "Token inválido o expirado"}), 401

        return fn(*args, **kwargs)
    return wrapper

@stats_bp.route("/admin/stats", methods=["GET"])
@admin_required
def get_admin_stats():
    total_products = Product.query.count()
    total_users = User.query.count()
    total_orders = Order.query.count()

    # Sumar todos los totales de las órdenes (con IGV ya incluido en total_amount)
    total_revenue = db.session.query(func.coalesce(func.sum(Order.total_amount), 0)).scalar()
    total_revenue = float(total_revenue or 0)

    return jsonify({
        "totalProducts": total_products,
        "totalUsers": total_users,
        "totalOrders": total_orders,
        "totalRevenue": total_revenue,
    })
