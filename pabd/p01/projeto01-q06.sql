SELECT 
    p.name AS "Produto"
FROM "Product" p
JOIN "Stock" s ON s."productId" = p.id
LEFT JOIN "Log" l ON l."stockId" = s.id
WHERE l.id IS NULL;

