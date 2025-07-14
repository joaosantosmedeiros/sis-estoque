# Tarefa P02 - Hildemberg Eling de Araújo Lucena

## Funções
### Função 7:
Esta função em PostgreSQL retorna o número de produtos em uma categoria específica.

```sql
CREATE OR REPLACE FUNCTION get_product_count_by_category(cid INT)
RETURNS INT AS $$
BEGIN
  RETURN (SELECT COUNT(*) FROM "Product" WHERE "categoryId" = cid);
END;
$$ LANGUAGE plpgsql;
```

### Função 8
Esta função em PostgreSQL retorna verdadeiro se o tipo de conta for administrador.

```sql
CREATE OR REPLACE FUNCTION is_admin(acc_id INT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (SELECT "userType" = 1 FROM "Account" WHERE "id" = acc_id);
END;
$$ LANGUAGE plpgsql;
```
## Procedimentos
### Procedimento 7
Esse procedimento diminui a quantidade do estoque após uma venda.
```sql
CREATE OR REPLACE PROCEDURE reduce_stock_after_sale(pid INT, sold_qty INT)
LANGUAGE plpgsql AS $$
BEGIN
  UPDATE "Stock" SET "quantity" = "quantity" - sold_qty WHERE "productId" = pid;
END;
$$;
```

### Procedimento 8
Esse procedimento atualiza a senha de uma conta específica.
```sql
CREATE OR REPLACE PROCEDURE update_account_password(acc_id INT, new_pass TEXT)
LANGUAGE plpgsql AS $$
BEGIN
  UPDATE "Account" SET "password" = new_pass WHERE "id" = acc_id;
END;
$$;
```
