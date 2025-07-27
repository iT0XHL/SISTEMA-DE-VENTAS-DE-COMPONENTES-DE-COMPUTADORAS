from flask import Blueprint, jsonify, request, send_file, abort
from io import BytesIO
from models import Invoice, Order
from pdf_generator import generar_boleta_pdf
import crud
import uuid

# JWT imports (opcional)
try:
    from flask_jwt_extended import jwt_required, get_jwt_identity
    JWT_ENABLED = True
except ImportError:
    JWT_ENABLED = False

invoices_bp = Blueprint('invoices', __name__, url_prefix='/invoices')

@invoices_bp.route('/', methods=['GET'])
def get_invoices():
    order_id = request.args.get('order_id')
    if order_id:
        invoices = Invoice.query.filter_by(order_id=order_id).all()
        return jsonify([i.to_dict() for i in invoices])
    items = crud.get_all_invoices()
    return jsonify([i.to_dict() for i in items])


# Endpoint: /invoices/mine (solo boletas del usuario autenticado)
@invoices_bp.route('/mine', methods=['GET'])
def get_my_invoices():
    if JWT_ENABLED:
        from flask_jwt_extended import jwt_required, get_jwt_identity
        @jwt_required()
        def secured():
            user_id = get_jwt_identity()
            invoices = (
                Invoice.query
                .join(Order)
                .filter(Order.user_id == user_id)
                .order_by(Invoice.created_at.desc())
                .all()
            )
            data = []
            for inv in invoices:
                order = inv.order
                data.append({
                    "invoice_id": inv.id,
                    "invoice_number": inv.invoice_number,
                    "customer_name": inv.customer_name,
                    "customer_dni": inv.customer_dni,
                    "created_at": inv.created_at.isoformat() if inv.created_at else None,
                    "pdf_available": bool(inv.pdf_data),
                    "order_number": order.order_number,
                    "order_status": order.status,
                    "payment_method": order.payment_method,
                    "total_amount": float(order.total_amount),
                    "items": [
                        {
                            "product_name": item.product_name,
                            "quantity": item.quantity,
                            "unit_price": float(item.unit_price),
                            "total_price": float(item.total_price),
                        }
                        for item in order.order_items
                    ]
                })
            return jsonify(data)
        return secured()
    else:
        invoices = crud.get_all_invoices()
        return jsonify([i.to_dict() for i in invoices])

@invoices_bp.route('/<invoice_id>', methods=['GET'])
def get_invoice(invoice_id):
    item = crud.get_invoice_by_id(invoice_id)
    return (jsonify(item.to_dict()), 200) if item else ('', 404)

@invoices_bp.route('/', methods=['POST'])
def add_invoice():
    data = request.json

    order_id = data.get("order_id")
    customer_name = data.get("customer_name")
    customer_dni = data.get("customer_dni")

    if not order_id or not customer_name or not customer_dni:
        return jsonify({"error": "Faltan datos obligatorios"}), 400

    # Busca la orden
    order = Order.query.get(order_id)
    if not order:
        return jsonify({"error": "Orden no encontrada"}), 404

    # Busca los items de la orden
    items = []
    subtotal = 0.0
    for item in order.order_items:
        items.append({
            "name": item.product_name,
            "quantity": item.quantity,
            "price": float(item.unit_price),
            "total": float(item.total_price),
        })
        subtotal += float(item.total_price)
    tax = round(subtotal * 0.18, 2)
    total = round(subtotal + tax, 2)

    # Generar número de boleta si quieres autogenerarlo
    from datetime import datetime
    invoice_number = f"INV-{datetime.utcnow().strftime('%Y%m%d')}-{str(uuid.uuid4())[:8]}"

    # Generar el PDF con los datos de la orden y del cliente
    pdf_bytes = generar_boleta_pdf({
    "invoiceNumber": invoice_number,
    "date": datetime.utcnow().strftime('%Y-%m-%d %H:%M'),
    "customerName": customer_name,
    "customerDni": customer_dni,
    "customerEmail": order.user.email,
    "customerPhone": order.shipping_address.get("phone", ""),  # si es un dict
    "items": items,
    "subtotal": subtotal,
    "tax": tax,
    "total": total,
})


    # Guarda la boleta/factura
    invoice_data = {
        "order_id": order_id,
        "invoice_number": invoice_number,
        "customer_name": customer_name,
        "customer_dni": customer_dni,
        "pdf_data": pdf_bytes,
        "created_at": datetime.utcnow(),
    }
    invoice = crud.create_invoice(invoice_data)
    return jsonify(invoice.to_dict()), 201


@invoices_bp.route('/<invoice_id>', methods=['PUT'])
def update_invoice(invoice_id):
    data = request.json
    item = crud.update_invoice(invoice_id, data)
    return (jsonify(item.to_dict()), 200) if item else ('', 404)

@invoices_bp.route('/<invoice_id>', methods=['DELETE'])
def delete_invoice(invoice_id):
    item = crud.delete_invoice(invoice_id)
    return ('', 204) if item else ('', 404)

# Endpoint: /invoices/<invoice_id>/download
@invoices_bp.route('/<invoice_id>/download', methods=['GET'])
def download_invoice(invoice_id):
    invoice = Invoice.query.get(invoice_id)
    if not invoice or not invoice.pdf_data:
        abort(404, description="Boleta no encontrada")

    if JWT_ENABLED:
        from flask_jwt_extended import jwt_required, get_jwt_identity
        from models import User
        @jwt_required()
        def secured_download():
            user_id = get_jwt_identity()
            user = User.query.get(user_id)
            # Permite si es el dueño de la orden o si es admin
            if invoice.order.user_id != user_id and (not user or user.role != "admin"):
                abort(403, description="No autorizado para descargar esta boleta")
            return send_file(
                BytesIO(invoice.pdf_data),
                download_name=f"boleta-{invoice.invoice_number}.pdf",
                as_attachment=True,
                mimetype="application/pdf"
            )
        return secured_download()


    return send_file(
        BytesIO(invoice.pdf_data),
        download_name=f"boleta-{invoice.invoice_number}.pdf",
        as_attachment=True,
        mimetype="application/pdf"
    )
