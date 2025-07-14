INSERT INTO "Category" ("name") VALUES
('Eletrônicos'),
('Livros'),
('Roupas'),
('Alimentos'),
('Brinquedos'),
('Móveis'),
('Ferramentas'),
('Beleza'),
('Esportes'),
('Automotivo');

INSERT INTO "Product" ("name", "price", "categoryId") VALUES
('Smartphone', 1999.99, 1),
('Notebook', 3499.50, 1),
('Furadeira', 249.99, 7),
('Cadeira Gamer', 999.99, 6),
('Tênis de Corrida', 299.90, 9),
('Shampoo Premium', 49.90, 8),
('Lego Star Wars', 599.99, 5),
('Chocolate Importado', 19.99, 4),
('Camisa Polo', 89.99, 3),
('Romance Bestseller', 39.99, 2);

INSERT INTO "Stock" ("quantity", "productId") VALUES
(100, 1),
(50, 2),
(75, 3),
(30, 4),
(120, 5),
(80, 6),
(60, 7),
(200, 8),
(90, 9),
(150, 10);

INSERT INTO "Log" ("quantity", "stockId", "date") VALUES
(10, 1, '2025-04-01 08:00:00'),
(5, 2, '2025-04-02 09:30:00'),
(20, 3, '2025-04-03 10:45:00'),
(3, 4, '2025-04-04 11:15:00'),
(15, 5, '2025-04-05 12:00:00'),
(7, 6, '2025-04-06 13:30:00'),
(12, 7, '2025-04-07 14:00:00'),
(8, 8, '2025-04-08 15:45:00'),
(6, 9, '2025-04-09 16:20:00'),
(9, 10, '2025-04-10 17:10:00');
