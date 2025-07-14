
# Tarefa P02 - Diego Dantas da Silva

## Funções

### Função 5
Esta função verifica se um determinado produto está disponível em estoque. Ela retorna `TRUE` se existir pelo menos um registro na tabela `Stock` com `productId` igual ao fornecido (`pid`) e `quantity` maior que zero.

```sql
CREATE OR REPLACE FUNCTION is_product_in_stock(pid INT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM "Stock" WHERE "productId" = pid AND "quantity" > 0
  );
END;
$$ LANGUAGE plpgsql;
```

### Função 6
Esta função retorna a quantidade total de categorias que estão ativas na tabela `Category`, ou seja, aquelas cujo campo `isActive` está definido como `TRUE`.

```sql
CREATE OR REPLACE FUNCTION count_active_categories()
RETURNS INT AS $$
BEGIN
  RETURN (SELECT COUNT(*) FROM "Category" WHERE "isActive" = TRUE);
END;
$$ LANGUAGE plpgsql;
```

## Procedimentos

### Procedimento 5
Este procedimento insere um novo registro na tabela `Log`, que serve para registrar movimentações de estoque. Ele recebe como parâmetros o `stock_id`, a `qty` (quantidade movimentada) e o `acc_id` (ID da conta que realizou a ação), além de registrar a data atual automaticamente com `CURRENT_TIMESTAMP`.

```sql
CREATE OR REPLACE PROCEDURE insert_log(stock_id INT, qty INT, acc_id INT)
LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO "Log" ("quantity", "stockId", "date", "accountId")
  VALUES (qty, stock_id, CURRENT_TIMESTAMP, acc_id);
END;
$$;
```

### Procedimento 6
Este procedimento desativa uma categoria na tabela `Category`, alterando o campo `isActive` para `FALSE`, com base no `id` fornecido como parâmetro.

```sql
CREATE OR REPLACE PROCEDURE deactivate_category(cat_id INT)
LANGUAGE plpgsql AS $$  
BEGIN  
  UPDATE "Category" SET "isActive" = FALSE WHERE "id" = cat_id;  
END;  
$$;
```
