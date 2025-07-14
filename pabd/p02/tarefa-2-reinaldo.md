# Tarefa P02 - Reinaldo Alves Pereira Junior

## Funções
### Função 3:
Essa função verifica se um determinado produto possui unidades disponíveis em estoque. Ela retorna `true` se a quantidade no estoque for maior que zero e false caso contrário. É útil para impedir que produtos fora de estoque sejam exibidos como disponíveis para venda ou movimentação.

```sql
CREATE OR REPLACE FUNCTION count_active_accounts()
RETURNS INT AS $$
BEGIN
  RETURN (SELECT COUNT(*) FROM "Account" WHERE "isActive" = TRUE);
END;
$$ LANGUAGE plpgsql;
```

### Função 4
Essa função retorna o número total de categorias ativas no sistema. Ela verifica o campo `isActive` da tabela `Category` e conta quantas estão com o valor `true`. É útil para gerar relatórios ou filtros apenas com categorias atualmente em uso.

```sql
CREATE OR REPLACE FUNCTION get_category_name_by_product_id(pid INT)
RETURNS TEXT AS $$
BEGIN
  RETURN (
    SELECT c."name"
    FROM "Product" p
    JOIN "Category" c ON p."categoryId" = c."id"
    WHERE p."id" = pid
  );
END;
$$ LANGUAGE plpgsql;
```
## Procedimentos
### Procedimento 3
Esse procedimento insere uma nova entrada na tabela Log, registrando uma movimentação de estoque. Ele grava a quantidade movimentada, o `ID` do estoque e a conta responsável, além de registrar a data automaticamente com a função `CURRENT_TIMESTAMP`. Ideal para manter histórico de entrada/saída de produtos.
```sql
CREATE OR REPLACE PROCEDURE activate_account(acc_id INT)
LANGUAGE plpgsql AS $$
BEGIN
  UPDATE "Account" SET "isActive" = TRUE WHERE "id" = acc_id;
END;
$$;
```

### Procedimento 4
Esse procedimento altera o campo `isActive` de uma categoria para `false`, desativando-a no sistema. Ele é útil para excluir temporariamente categorias sem removê-las do banco de dados, preservando integridade referencial e histórico de dados.
```sql
CREATE OR REPLACE PROCEDURE change_product_category(pid INT, new_cat_id INT)
LANGUAGE plpgsql AS $$
BEGIN
  UPDATE "Product" SET "categoryId" = new_cat_id WHERE "id" = pid;
END;
$$;
```