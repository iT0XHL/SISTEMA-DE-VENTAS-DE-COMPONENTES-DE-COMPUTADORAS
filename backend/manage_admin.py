import sys
import uuid
from app import app, db
from models import User
from werkzeug.security import generate_password_hash

def create_admin(email, password, full_name="Administrador", role="admin"):
    with app.app_context():
        if User.query.filter_by(email=email).first():
            print(f"Ya existe un usuario con email {email}.")
            return
        user = User(
            id=str(uuid.uuid4()),  # Genera un UUID
            email=email,
            password_hash=generate_password_hash(password),
            full_name=full_name,
            role=role
        )
        db.session.add(user)
        db.session.commit()
        print("¡Admin creado exitosamente!")

def delete_admin(email):
    with app.app_context():
        user = User.query.filter_by(email=email, role='admin').first()
        if user:
            db.session.delete(user)
            db.session.commit()
            print(f"Usuario admin con email {email} eliminado.")
        else:
            print("No se encontró un admin con ese email.")

def update_admin(email, new_password=None, new_name=None):
    with app.app_context():
        user = User.query.filter_by(email=email, role='admin').first()
        if not user:
            print("No se encontró un admin con ese email.")
            return
        if new_password:
            user.password_hash = generate_password_hash(new_password)
            print("Contraseña actualizada.")
        if new_name:
            user.full_name = new_name
            print("Nombre actualizado.")
        db.session.commit()
        print("Actualización completada.")

if __name__ == "__main__":
    # Uso: python manage_admin.py create email password [full_name]
    #      python manage_admin.py delete email
    #      python manage_admin.py update email new_password [nuevo_nombre]

    if len(sys.argv) < 3:
        print("Uso:")
        print("  python manage_admin.py create email password [full_name]")
        print("  python manage_admin.py delete email")
        print("  python manage_admin.py update email new_password [nuevo_nombre]")
        sys.exit(1)

    action = sys.argv[1]
    if action == "create":
        _, _, email, password, *name = sys.argv
        create_admin(email, password, " ".join(name) if name else "Administrador")
    elif action == "delete":
        _, _, email = sys.argv
        delete_admin(email)
    elif action == "update":
        if len(sys.argv) < 4:
            print("Uso para update: python manage_admin.py update email new_password [nuevo_nombre]")
            sys.exit(1)
        _, _, email, new_password, *name = sys.argv
        update_admin(email, new_password, " ".join(name) if name else None)
    else:
        print("Acción no reconocida. Usa create, delete o update.")
