SELECT 
    c.name AS "Categoria",
    COUNT(p.id) AS "Total de Produtos"
FROM "Category" c
LEFT JOIN "Product" p ON p."categoryId" = c.id
GROUP BY c.name;