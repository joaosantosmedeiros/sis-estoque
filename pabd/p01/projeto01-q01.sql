-- Listar todos os produtos com suas categorias e quantidade em estoque

SELECT 
    p.name AS "Produto",
    c.name AS "Categoria",
    s.quantity AS "Estoque"
FROM "Product" p
JOIN "Category" c ON p."categoryId" = c.id
JOIN "Stock" s ON s."productId" = p.id;
