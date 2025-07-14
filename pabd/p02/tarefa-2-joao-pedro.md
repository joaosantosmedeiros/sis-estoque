# Tarefa P02 - João Pedro dos Santos Medeiros

## Funções
### Função 1:
Esta função em PostgreSQL retorna o número total de produtos ativos cadastrados na tabela `Product`, contando apenas os registros em que o campo `isActive` é igual a `TRUE`.

```sql
CREATE OR REPLACE FUNCTION get_total_active_products()
RETURNS INTEGER AS $$
BEGIN
  RETURN (SELECT COUNT(*) FROM "Product" WHERE "isActive" = TRUE);
END;
$$ LANGUAGE plpgsql;
```

### Função 2
Esta função em PostgreSQL retorna a quantidade em estoque de um produto específico, identificado pelo seu ID. Ela consulta a tabela `Stock` e busca o campo `quantity` correspondente ao `productId` fornecido como parâmetro.

```sql
CREATE OR REPLACE FUNCTION get_stock_by_product_id(pid INT)
RETURNS INT AS $$
BEGIN
  RETURN (SELECT "quantity" FROM "Stock" WHERE "productId" = pid);
END;
$$ LANGUAGE plpgsql;
```
## Procedimentos
### Procedimento 1
Esse procedimento desativa um produto específico na tabela `Product`, definindo seu campo `isActive` como `FALSE`. Ela é acionada pelo `ID` do produto (pid), proporcionando uma maneira rápida e segura de marcar itens como inativos sem removê-los do banco de dados.
```sql
CREATE OR REPLACE PROCEDURE deactivate_product(pid INT)
LANGUAGE plpgsql AS $$
BEGIN
  UPDATE "Product" SET "isActive" = FALSE WHERE "id" = pid;
END;
$$;
```

### Procedimento 2
Esse procedimento atualiza a quantidade em estoque de um produto específico na tabela `Stock`. Ela permite ajustar o estoque de forma segura e eficiente, recebendo como entrada o `ID` do produto e a nova quantidade desejada.
```sql
CREATE OR REPLACE PROCEDURE update_stock(pid INT, new_quantity INT)
LANGUAGE plpgsql AS $$
BEGIN
  UPDATE "Stock" SET "quantity" = new_quantity WHERE "productId" = pid;
END;
$$;
```
