SELECT 
    DATE(l.date) AS "Data",
    SUM(l.quantity) AS "Total Movimentado"
FROM "Log" l
GROUP BY DATE(l.date)
ORDER BY "Data";
