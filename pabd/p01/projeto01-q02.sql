SELECT 
    p.name AS "Produto",
    s.quantity AS "Quantidade em Estoque"
FROM "Product" p
JOIN "Stock" s ON s."productId" = p.id
WHERE s.quantity < 50;
