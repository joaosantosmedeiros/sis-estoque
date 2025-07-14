-- Estoques sem produto
SELECT * FROM "Stock" WHERE "productId" NOT IN (SELECT id FROM "Product");

-- Logs sem estoque
SELECT * FROM "Log" WHERE "stockId" NOT IN (SELECT id FROM "Stock");