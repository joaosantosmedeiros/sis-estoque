SELECT 
    c.name AS "Categoria",
    ROUND(AVG(p.price), 2) AS "Preço Médio"
FROM "Category" c
JOIN "Product" p ON p."categoryId" = c.id
GROUP BY c.name;
