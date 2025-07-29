from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.platypus import Table, TableStyle, Paragraph
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.enums import TA_LEFT
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

    # --- Boleta Nº y Fecha
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

    # --- Detalle de productos
    c.setFillColor(verde)
    c.rect(MARGIN_LEFT, current_y, width - 2*MARGIN_LEFT, 22, fill=1, stroke=0)
    c.setFont("Helvetica-Bold", 13)
    c.setFillColor(blanco)
    c.drawString(MARGIN_LEFT + 12, current_y + 7, "DETALLE DE PRODUCTOS")
    current_y -= 30

    # Estilo para texto largo
    styles = getSampleStyleSheet()
    style_left = ParagraphStyle('left', parent=styles['Normal'], fontName='Helvetica', fontSize=10, alignment=TA_LEFT)

    # Cabecera de tabla
    table_data = [
        ["Código", "Producto", "Cantidad", "Precio Unit", "Total (s/IGV)"]
    ]

    subtotal = 0.0
    for item in data["items"]:
        code = Paragraph(item.get("code", ""), style_left)
        name = Paragraph(item.get("name", ""), style_left)
        qty = int(item.get("quantity", 1))
        price_con_igv = float(item.get("price", 0.0))
        price_sin_igv = round(price_con_igv / 1.18, 2)
        total_sin_igv = round(price_sin_igv * qty, 2)
        subtotal += total_sin_igv

        table_data.append([
            code,
            name,
            str(qty),
            f"S/{price_sin_igv:.2f}",
            f"S/{total_sin_igv:.2f}",
        ])

    # Estilo de tabla
    col_widths = [90, 200, 50, 90, 90]  # Aumentamos ancho de "Código" y "Producto"
    table = Table(table_data, colWidths=col_widths)
    style = TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), azul),
        ('TEXTCOLOR', (0, 0), (-1, 0), blanco),
        ('ALIGN', (2, 1), (-1, -1), 'CENTER'),
        ('ALIGN', (0, 1), (1, -1), 'LEFT'),
        ('GRID', (0, 0), (-1, -1), 0.3, colors.lightgrey),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 8),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('BACKGROUND', (0, 1), (-1, -1), colors.white),
    ])
    table.setStyle(style)
    table.wrapOn(c, width, height)

    table_y = current_y - len(table_data) * 24
    table.drawOn(c, MARGIN_LEFT, table_y)

    # Totales
    igv = round(subtotal * 0.18, 2)
    total_final = round(subtotal + igv, 2)

    totales_y = table_y - 110
    box_x = width - 215
    rect_y = totales_y + 28
    rect_height = 40

    c.setFont("Helvetica", 12)
    c.setFillColor(gris_oscuro)
    c.drawRightString(box_x + 185, totales_y + 98, f"Subtotal: S/{subtotal:.2f}")
    c.drawRightString(box_x + 185, totales_y + 78, f"IGV (18%): S/{igv:.2f}")

    # Rectángulo verde del total final
    c.setFillColor(verde)
    c.rect(box_x, rect_y, 180, rect_height, fill=1, stroke=0)
    c.setFont("Helvetica-Bold", 17)
    c.setFillColor(blanco)
    c.drawCentredString(box_x + 90, rect_y + rect_height/2 + 4, f"TOTAL: S/{total_final:.2f}")

    # Footer
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
