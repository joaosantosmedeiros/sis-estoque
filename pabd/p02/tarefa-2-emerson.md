# Tarefa P02 - Emerson da Silva Santos

## Funções
### Função 9:
Esta função em PostgreSQL retorna a quantidade de movimentações registradas (logs) feitas por um usuário específico, identificado pelo seu `accountId`.

```sql
CREATE OR REPLACE FUNCTION count_logs_by_account(acc_id INT)
RETURNS INT AS $$
BEGIN
  RETURN (SELECT COUNT(*) FROM "Log" WHERE "accountId" = acc_id);
END;
$$ LANGUAGE plpgsql;
```

### Função 10:
Esta função retorna a data da última movimentação de estoque registrada para um produto específico, identificado por seu `productId`. Ela utiliza uma junção entre as tabelas `Log` e `Stock` para localizar o log mais recente.

```sql
CREATE OR REPLACE FUNCTION get_last_stock_log_date(pid INT)
RETURNS TIMESTAMP AS $$
BEGIN
  RETURN (
    SELECT MAX("date")
    FROM "Log"
    JOIN "Stock" ON "Stock"."id" = "Log"."stockId"
    WHERE "Stock"."productId" = pid
  );
END;
$$ LANGUAGE plpgsql;
```

## Procedimentos
### Procedimento 9:
Este procedimento cadastra um novo produto na tabela `Product` e já cria sua respectiva entrada na tabela `Stock`, com a quantidade inicial informada. Ele recebe como parâmetros o nome, o preço, a categoria do produto e a quantidade em estoque.

```sql
CREATE OR REPLACE PROCEDURE create_product_with_stock(
  pname TEXT,
  price FLOAT,
  cid INT,
  qty INT
)
LANGUAGE plpgsql AS $$
DECLARE
  pid INT;
BEGIN
  INSERT INTO "Product" ("name", "price", "categoryId") 
  VALUES (pname, price, cid) RETURNING id INTO pid;
  INSERT INTO "Stock" ("productId", "quantity") VALUES (pid, qty);
END;
$$;
```

### Procedimento 10:
Este procedimento redefine todas as quantidades de estoque para zero, de forma global. É útil em cenários como balanços ou reinicializações de sistema.

```sql
CREATE OR REPLACE PROCEDURE reset_all_stock()
LANGUAGE plpgsql AS $$
BEGIN
  UPDATE "Stock" SET "quantity" = 0;
END;
$$;
```
