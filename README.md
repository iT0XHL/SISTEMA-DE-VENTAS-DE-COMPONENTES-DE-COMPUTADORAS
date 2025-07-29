# 🖥️ PCDos2 - Sistema Web de Tienda de Componentes de PC (aún en desarrollo, se implementarán funciones poco a poco)

**PCDos2** es un sistema web completo para la gestión y venta de productos de computadoras y afines. Permite a los usuarios comprar, filtrar y gestionar sus compras de manera eficiente y segura, y a los administradores controlar todo el inventario y la operación de la tienda.

---

## ✨ Funcionalidades Principales

### 👤 Para Usuarios/Clientes
- **Registro e Inicio de Sesión Obligatorio:**  
  Solo los usuarios registrados pueden comprar productos.
- **Carrito de Compras:**  
  Añade productos al carrito, revisa cantidades y realiza compras fácilmente.
- **Métodos de Pago Verificados:**  
  Selecciona y utiliza diferentes métodos de pago para completar tu compra.
- **Historial y Boletas:**  
  Revisa tu historial de boletas y órdenes en el panel de pedidos.

### 🛠️ Para Administradores
- **Gestión Completa del Inventario:**  
  Agrega, edita y elimina productos del catálogo.
- **Control de Stock:**  
  Ajusta inventario y elimina productos sin stock.
- **Edición de Imágenes de Productos:**  
  Actualiza las fotos y descripciones de los productos en cualquier momento.
- **Panel de Administración:**  
  Acceso a todas las operaciones, estadísticas y gestión de usuarios.

---

## ⚙️ Tecnologías Utilizadas

- **Backend:** Python + Flask
- **Base de datos:** MySQL (local)
- **Frontend:** React y Next.js
- **Autenticación:** Seguridad con JWT y control de acceso por roles

---

## 🚀 Instalación Rápida

   > Previamente debes tener instalado Node.js, MySQL y una versión de Python estable y compatible con múltiples paquetes, por ejemplo, Python 3.12.10.

1. **Clona este repositorio:**
    ```bash
    git clone https://github.com/iT0XHL/SISTEMA-DE-VENTAS-DE-COMPONENTES-DE-COMPUTADORAS.git
    cd SISTEMA-DE-VENTAS-DE-COMPONENTES-DE-COMPUTADORAS
    ```

2. **Configura tus variables de entorno (.env) para el backend**  
   > Al configurarlas tú mismo, no subas ese archivo al repositorio por seguridad.

3. **Instala dependencias:**
    ```bash
    # Backend
    cd backend
    pip install -r requirements.txt

    # Frontend
    cd ../frontend
    npm install
    ```

4. **Crea la base de datos en MySQL**  
   Configura tus credenciales en el archivo `.env` y ejecuta las migraciones necesarias.

5. **Levanta el servidor:**
    ```bash
    # Backend
    python app.py

    # Frontend
    npm run dev
    ```

---

## 📝 Notas Importantes

- La base de datos por el momento solo funciona de manera local.
- Los archivos necesarios para generar la base de datos se encuentran en la carpeta database.
- Las compras, órdenes y boletas solo pueden generarse si el usuario está registrado e inició sesión.
- El panel de administración solo es accesible para cuentas con rol de **admin**.

---

## 🤝 Contribuciones

¿Te gustaría colaborar o sugerir mejoras?  
Crea un **issue** o un **pull request**. ¡Tu aporte es bienvenido!

---

**Desarrollado por Andre Salas (T0XHL) para PCDos2 - Venta de Componentes de Computadora.**

---

