from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.platypus import Table, TableStyle
from io import BytesIO
from datetime import datetime
import pytz

def generar_boleta_pdf(data):
    buffer = BytesIO()
    c = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4

    # COLORES CORPORATIVOS
    azul = colors.Color(59/255, 130/255, 246/255)
    verde = colors.Color(34/255, 197/255, 94/255)
    gris_oscuro = colors.Color(55/255, 65/255, 81/255)
    gris_claro = colors.Color(243/255, 244/255, 246/255)
    blanco = colors.white

    MARGIN_LEFT = 30
    HEADER_HEIGHT = 120

    # --- HEADER azul
    c.setFillColor(azul)
    c.rect(0, height-HEADER_HEIGHT, width, HEADER_HEIGHT, fill=1, stroke=0)
    c.setFillColor(verde)
    c.rect(0, height-HEADER_HEIGHT-10, width, 20, fill=1, stroke=0)

    # Ícono PC
    c.setFillColor(blanco)
    c.roundRect(22, height-HEADER_HEIGHT+35, 40, 30, 5, fill=1)
    c.setFillColor(azul)
    c.rect(35, height-HEADER_HEIGHT+32, 18, 4, fill=1)

    # Empresa
    c.setFont("Helvetica-Bold", 32)
    c.setFillColor(blanco)
    c.drawString(80, height-HEADER_HEIGHT+60, "PCDos2")
    c.setFont("Helvetica", 15)
    c.drawString(80, height-HEADER_HEIGHT+35, "Componentes de PC")
    c.drawString(80, height-HEADER_HEIGHT+18, "RUC: 20123456789")

    # Boleta de venta
    c.setFillColor(verde)
    c.rect(width-180, height-HEADER_HEIGHT+60, 150, 36, fill=1, stroke=0)
    c.setFont("Helvetica-Bold", 15)
    c.setFillColor(blanco)
    c.drawCentredString(width-105, height-HEADER_HEIGHT+80, "BOLETA DE VENTA")

    # --- Boleta Nº y Fecha (más abajo)
    block_y = height-HEADER_HEIGHT-65
    lima_now = datetime.now(pytz.timezone("America/Lima")).strftime("%Y-%m-%d %H:%M")
    c.setFillColor(gris_claro)
    c.rect(MARGIN_LEFT, block_y, width - 2*MARGIN_LEFT, 48, fill=1, stroke=0)
    c.setFillColor(gris_oscuro)
    c.setFont("Helvetica-Bold", 14)
    c.drawString(MARGIN_LEFT + 20, block_y + 30, f"Boleta N°: {data['invoiceNumber']}")
    c.drawString(MARGIN_LEFT + 20, block_y + 12, f"Fecha: {lima_now}")

    current_y = block_y - 50

    # --- Datos del cliente
    c.setFillColor(azul)
    c.rect(MARGIN_LEFT, current_y, width - 2*MARGIN_LEFT, 22, fill=1, stroke=0)
    c.setFont("Helvetica-Bold", 13)
    c.setFillColor(blanco)
    c.drawString(MARGIN_LEFT + 12, current_y + 7, "DATOS DEL CLIENTE")
    current_y -= 35

    c.setFillColor(gris_oscuro)
    c.setFont("Helvetica", 11)
    c.drawString(MARGIN_LEFT + 20, current_y + 16, f"Nombre: {data.get('customerName', '')}")
    c.drawString(width/2 + 25, current_y + 16, f"DNI: {data.get('customerDni', '')}")
    current_y -= 17
    c.drawString(MARGIN_LEFT + 20, current_y + 16, f"Correo: {data.get('customerEmail', '')}")
    phone = data.get('customerPhone')
    if phone:
        c.drawString(width/2 + 25, current_y + 16, f"Teléfono: {phone}")
    current_y -= 38

    # --- Detalle productos
    c.setFillColor(verde)
    c.rect(MARGIN_LEFT, current_y, width - 2*MARGIN_LEFT, 22, fill=1, stroke=0)
    c.setFont("Helvetica-Bold", 13)
    c.setFillColor(blanco)
    c.drawString(MARGIN_LEFT + 12, current_y + 7, "DETALLE DE PRODUCTOS")
    current_y -= 30

    # --- Tabla
    table_data = [["Producto", "Cant.", "Precio Unit.", "Total"]]
    for item in data["items"]:
        table_data.append([
            item["name"],
            str(item["quantity"]),
            f"S/{item['price']:.2f}",
            f"S/{item['total']:.2f}",
        ])

    style = TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), azul),
        ('TEXTCOLOR', (0, 0), (-1, 0), blanco),
        ('ALIGN', (1, 0), (-1, -1), 'CENTER'),
        ('GRID', (0, 0), (-1, -1), 0.3, colors.lightgrey),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 8),
        ('BACKGROUND', (0, 1), (-1, -1), colors.white),
    ])
    table = Table(table_data, colWidths=[260, 55, 90, 90])
    table.setStyle(style)
    table.wrapOn(c, width, height)

    table_y = current_y - len(table_data)*24
    table.drawOn(c, MARGIN_LEFT, table_y)

    # --- Totales alineados y mejor centrado el TOTAL
    totales_y = table_y - 110
    box_x = width - 215
    rect_y = totales_y + 28
    rect_height = 40

    c.setFont("Helvetica", 12)
    c.setFillColor(gris_oscuro)
    c.drawRightString(box_x + 185, totales_y + 98, f"Subtotal: S/{data['subtotal']:.2f}")
    c.drawRightString(box_x + 185, totales_y + 78, f"IGV (18%): S/{data['tax']:.2f}")

    # Rectángulo verde (NO SE MUEVE)
    c.setFillColor(verde)
    c.rect(box_x, rect_y, 180, rect_height, fill=1, stroke=0)

    # Texto TOTAL más pequeño y más abajo, centrado
    c.setFont("Helvetica-Bold", 17)
    c.setFillColor(blanco)
    # Centramos verticalmente con un pequeño "empuje" hacia abajo
    c.drawCentredString(box_x + 90, rect_y + rect_height/2 + 4, f"TOTAL: S/{data['total']:.2f}")

    # --- Footer
    c.setFont("Helvetica-Bold", 13)
    c.setFillColor(verde)
    c.drawCentredString(width/2, 70, "¡Gracias por tu compra!")
    c.setFont("Helvetica", 10)
    c.setFillColor(gris_oscuro)
    c.drawCentredString(width/2, 55, "PCDos2 - Tu tienda de confianza para componentes de PC")

    c.showPage()
    c.save()
    pdf = buffer.getvalue()
    buffer.close()
    return pdf
