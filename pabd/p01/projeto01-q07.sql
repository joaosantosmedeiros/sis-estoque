SELECT 
    p.name AS "Produto",
    s.quantity AS "Estoque"
FROM "Product" p
JOIN "Stock" s ON s."productId" = p.id
ORDER BY s.quantity DESC
LIMIT 3;
