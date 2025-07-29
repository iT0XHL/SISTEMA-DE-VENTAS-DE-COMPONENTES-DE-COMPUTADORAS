-- ----------------------------------------
-- Inserción de categorías (EJEMPLO)
-- ----------------------------------------
INSERT INTO categories (id, name, description, is_active, sort_order) VALUES
  ('a1111111-1111-1111-1111-111111111111', 'CPU',           'Procesadores para computadoras de escritorio y estaciones de trabajo', true, 1),
  ('b2222222-2222-2222-2222-222222222222', 'GPU',           'Tarjetas de video para gaming y creación de contenido',          true, 2),
  ('c3333333-3333-3333-3333-333333333333', 'MOTHERBOARD',   'Placas base para distintos sockets y chipsets',                  true, 3),
  ('d4444444-4444-4444-4444-444444444444', 'RAM',           'Módulos de memoria DDR4 y DDR5',                                  true, 4),
  ('e5555555-5555-5555-5555-555555555555', 'STORAGE',       'Discos SSD y HDD para almacenamiento',                            true, 5),
  ('f6666666-6666-6666-6666-666666666666', 'PSU',           'Fuentes de poder ATX modulares y no modulares',                   true, 6),
  ('g7777777-7777-7777-7777-777777777777', 'COOLER',        'Sistemas de refrigeración líquida y por aire',                    true, 7),
  ('h8888888-8888-8888-8888-888888888888', 'CASE',          'Chasis y gabinetes para PC de diversas formas y tamaños',         true, 8),
  ('i9999999-9999-9999-9999-999999999999', 'FAN',           'Ventiladores y kits LED para flujo de aire',                      true, 9),
  ('jaaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'MONITOR',     'Monitores LCD, LED y OLED para diversas resoluciones',           true, 10),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'KEYBOARD',      'Teclados mecánicos y de membrana para gaming y oficina',          true, 11),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'MOUSE',         'Ratones ópticos y láser con y sin cable',                         true, 12),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'HEADSET',       'Auriculares y micrófonos para gaming y reuniones',                true, 13),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'SSD-SATA',      'Discos de estado sólido SATA',                                     true, 14),
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'HDD',           'Discos duros mecánicos para almacenamiento masivo',               true, 15)
;

-- ----------------------------------------
-- Inserción de productos (EJEMPLO)
-- ----------------------------------------
INSERT INTO products (
  id, product_code, name, description, price, stock, min_stock,
  category_id, brand, model, image_url, image_urls, specifications, features, is_active, weight, dimensions, warranty_months
) VALUES
-- COOLERS
('10101010-0000-1111-2222-101010101010','COOLER-COOLERMASTER-001','Cooler Master Hyper 212 Black','Disipador por aire con 4 heatpipes y ventilador PWM de 120mm.',49.99,120,10,'g7777777-7777-7777-7777-777777777777','CoolerMaster','Hyper 212 Black','https://www.coolermaster.com/media/wysiwyg/productpage/hyper-212-black-1.jpg','[]','{"type":"air","rpm":"650-2000"}','{"rgb":false}',true,0.7,'12x12x6 cm',2),
('20202020-0000-1111-2222-202020202020','COOLER-NZXT-001','NZXT Kraken X63','Refrigeración líquida AIO de 280mm con tubos de nylon y conector RGB.',159.99,80,5,'g7777777-7777-7777-7777-777777777777','NZXT','Kraken X63','https://nzxt.com/assets/cms/20870/AIO-2022-kraken-x63-gallery.png','[]','{"radiator":"280mm","pump":"infinity"}','{"rgb":true}',true,1.2,'31x14x3 cm',3),

-- CASES
('30303030-0000-1111-2222-303030303030','CASE-CORSAIR-001','Corsair 4000D Airflow','Chasis ATX con panel frontal perforado para mejor ventilación.',89.99,90,5,'h8888888-8888-8888-8888-888888888888','Corsair','4000D Airflow','https://www.corsair.com/medias/sys_master/images/images/hbf/h50/10462668331518/4000d-airflow-white-gallery.png','[]','{"form_factor":"ATX","fans_included":2}','{"airflow":true}',true,8,'47x23x47 cm',2),
('40404040-0000-1111-2222-404040404040','CASE-NZXT-001','NZXT H510','Gabinete ATX premium con gestion de cables integrada.',74.99,100,5,'h8888888-8888-8888-8888-888888888888','NZXT','H510','https://nzxt.com/assets/cms/20870/case-h510-gallery.png','[]','{"form_factor":"ATX","fans_included":2}','{"tempered_glass":true}',true,7,'45x21x43 cm',2),

-- FANS
('50505050-0000-1111-2222-505050505050','FAN-COOLERMASTER-001','Cooler Master MF120R ARGB','Ventilador de 120mm con iluminación ARGB y control PWM.',14.99,200,20,'i9999999-9999-9999-9999-999999999999','CoolerMaster','MF120R ARGB','https://www.coolermaster.com/media/wysiwyg/productpage/mf120r-argb-1.jpg','[]','{"size":"120mm","rpm":"650-2000"}','{"rgb":true}',true,0.2,'12x12x2 cm',1),
('60606060-0000-1111-2222-606060606060','FAN-NZXT-001','NZXT Aer P120','Ventilador PWM de alta presión estática, ideal para radiadores.',16.99,150,15,'i9999999-9999-9999-9999-999999999999','NZXT','Aer P120','https://nzxt.com/assets/cms/20870/fan-aer-p120-gallery.png','[]','{"size":"120mm","rpm":"500-2000"}','{"quiet":true}',true,0.18,'12x12x2 cm',1),

-- MONITORES
('70707070-0000-1111-2222-707070707070','MONITOR-DELL-001','Dell UltraSharp U2723QE','Monitor 4K IPS de 27", gamut 100% sRGB, USB-C.',649.99,45,3,'jaaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Dell','U2723QE','https://i.dell.com/sites/csimages/Master_Imagery/all/u2723qe_gallery.png','[]','{"resolution":"4K","size":"27\""}','{"usb_c":true}',true,4.5,'62x20x45 cm',3),
('80808080-0000-1111-2222-808080808080','MONITOR-ASUS-001','ASUS ROG Swift PG279QM','Monitor WQHD 27", 240Hz, G-Sync Ultimate.',799.99,30,2,'jaaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','ASUS','PG279QM','https://dlcdnimgs.asus.com/websites/global/products/D0qzdHQRnFLvj43A/images/hero.png','[]','{"resolution":"WQHD","size":"27\""}','{"1440p":true,"240hz":true}',true,4.0,'62x24x40 cm',3),

-- TECLADOS
('90909090-0000-1111-2222-909090909090','KEYBOARD-LOGITECH-001','Logitech G915 TKL','Teclado mecánico inalámbrico TKL RGB, switches GL.',229.99,60,5,'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','Logitech','G915 TKL','https://resource.logitechg.com/w_1200,h_630,c_limit,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/gaming/en/products/g915-tkl/gallery/g915-tkl-top-view.png','[]','{"switch":"GL Linear","connectivity":"wireless"}','{"rgb":true}',true,0.8,'36x15x3 cm',2),
('aaaaaaaa-0000-1111-2222-aaaaaaaa0000','KEYBOARD-RAZER-001','Razer Huntsman Elite','Teclado mecánico con switches ópticos y reposamuñecas.',199.99,55,5,'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','Razer','Huntsman Elite','https://assets2.razerzone.com/images/pnx.assets/0b52dbf9bc91df9910032b723e72dfee/razer-huntsman-elite-desktop.png','[]','{"switch":"optical","connectivity":"wired"}','{"rgb":true}',true,1.2,'44x14x5 cm',2),

-- MOUSES
('bbbbbbbb-0000-1111-2222-bbbbbbbb0000','MOUSE-LOGITECH-001','Logitech G502 X Plus','Ratón gaming con 25K DPI, sensor HERO y personalización RGB.',79.99,80,5,'cccccccc-cccc-cccc-cccc-cccccccccccc','Logitech','G502 X Plus','https://resource.logitechg.com/w_1200,h_630,c_limit,q_auto,f_auto,d_transparent.gif/content/dam/gaming/en/products/g502-x-plus/gallery/g502-x-plus-top.png','[]','{"dpi":"25K","buttons":11}','{"rgb":true}',true,0.1,'12x6x4 cm',2),
('cccccccc-0000-1111-2222-cccccccc0000','MOUSE-RAZER-001','Razer DeathAdder V3 Pro','Ratón inalámbrico ergonómico con 30K DPI y hasta 90 horas de batería.',129.99,70,5,'cccccccc-cccc-cccc-cccc-cccccccccccc','Razer','DeathAdder V3 Pro','https://assets2.razerzone.com/images/pnx.assets/71e8c3c0df8ccf30cfb85256c32138d0/razer-deathadder-v3-pro-desktop.png','[]','{"dpi":"30K","battery":"90h"}','{"wireless":true}',true,0.1,'12x6x4 cm',2);
