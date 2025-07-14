SELECT 
    p.name AS "Produto",
    l.quantity AS "Movimentado",
    l.date AS "Data"
FROM "Log" l
JOIN "Stock" s ON s.id = l."stockId"
JOIN "Product" p ON p.id = s."productId"
WHERE p.name = 'Smartphone'
ORDER BY l.date DESC;
