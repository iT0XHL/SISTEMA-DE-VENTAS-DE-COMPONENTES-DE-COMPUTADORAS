-- Función para actualizar stock de productos
DELIMITER $$

CREATE PROCEDURE update_product_stock(IN product_id CHAR(36), IN quantity_sold INT)
BEGIN
  UPDATE products 
  SET stock = stock - quantity_sold,
      updated_at = CURRENT_TIMESTAMP
  WHERE id = product_id;
END $$

DELIMITER ;


-- Función para obtener carrito de usuario
DELIMITER $$

CREATE PROCEDURE get_user_cart(IN in_user_id CHAR(36))
BEGIN
  SELECT 
    c.id AS cart_id,
    p.id AS product_id,
    p.name AS product_name,
    p.price AS product_price,
    ci.quantity,
    (p.price * ci.quantity) AS total_price
  FROM carts c
  JOIN cart_items ci ON c.id = ci.cart_id
  JOIN products p ON ci.product_id = p.id
  WHERE c.user_id = in_user_id;
END $$

DELIMITER ;
