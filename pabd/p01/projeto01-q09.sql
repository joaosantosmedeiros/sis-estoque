 SELECT 
    c.name AS "Categoria",
    p.name AS "Produto",
    p.price AS "Preço"
FROM "Product" p
JOIN "Category" c ON p."categoryId" = c.id
WHERE p.price = (
    SELECT MAX(p2.price)
    FROM "Product" p2
    WHERE p2."categoryId" = p."categoryId"
);