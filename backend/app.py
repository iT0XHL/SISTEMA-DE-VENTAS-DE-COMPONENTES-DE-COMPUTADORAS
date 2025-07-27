from dotenv import load_dotenv
import os

# 1. Carga las variables del .env
load_dotenv() 

from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager  # <--- Asegúrate de tener instalado flask_jwt_extended
from config import Config
from database import db

# Importa los blueprints
from routes.users import users_bp
from routes.categories import categories_bp
from routes.products import products_bp
from routes.carts import carts_bp
from routes.orders import orders_bp
from routes.order_items import order_items_bp
from routes.invoices import invoices_bp
from routes.cart_items import cart_items_bp
from routes.auth import auth_bp
from routes.stats import stats_bp

# 2. Inicializa la app Flask
app = Flask(__name__)

# 3. Configura CORS para los orígenes de tu frontend (localhost y 127.0.0.1)
CORS(app, origins=["http://localhost:3000", "http://127.0.0.1:3000"], supports_credentials=True)

# 4. Carga la configuración general
app.config.from_object(Config)

# 5. Establece las claves secretas desde .env
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")   # Para Flask (sesiones, etc)
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")   # Para JWT

# 6. Configura JWT location (esto arregla el KeyError)
app.config["JWT_TOKEN_LOCATION"] = ["headers"]
app.config["JWT_HEADER_NAME"] = "Authorization"
app.config["JWT_HEADER_TYPE"] = "Bearer"

# 7. Inicializa JWTManager
jwt = JWTManager(app)

# 8. Inicializa la base de datos
db.init_app(app)

# 9. Registra todos los blueprints
app.register_blueprint(users_bp)
app.register_blueprint(categories_bp)
app.register_blueprint(products_bp)
app.register_blueprint(carts_bp)
app.register_blueprint(orders_bp)
app.register_blueprint(order_items_bp)
app.register_blueprint(invoices_bp)
app.register_blueprint(cart_items_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(stats_bp)

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(host="localhost", port=5000, debug=True)
