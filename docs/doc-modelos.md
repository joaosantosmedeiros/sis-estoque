# Documento de Modelos

## Modelo Conceitual

### Diagrama de Classes usando Mermaid

```mermaid
classDiagram
    Usuario : +long id
    Usuario : +String name
    Usuario : +String password
    Usuario : +boolean iAdmin

    Categoria : +long id
    Categoria : +String name

    Produto : +long id
    Produto : +String name
    Produto : +Double preco
    Produto : +long id_categoria

    Log : +long id PK
    Log : +Date data_movimentacao
    Log : +int id_estoque
    Log : +int quantidade
    Log : buscarPorData()

    Estoque: +long id
    Estoque: +int quantidade
    Estoque: +long id_produto
    Estoque: alterarQuantidade()
```

### Descrição das Entidades

Descrição sucinta das entidades presentes no sistema.

| Entidade | Descrição   |
|----------|------------------------------------------------------------------------------------------------------------------------------------------------------|
| Usuário   | Entidade abstrata para representar informações gerais dos Usuários                                                  |
| Categoria   | Entidade abstrata para representar informações gerais das Categorias                                                  |
| Produto   | Entidade abstrata para representar informações gerais das Produtos                                                  |
| Log   | Entidade abstrata para representar informações gerais das Logs. Nele é possível buscar um log através de uma Data|
| Estoque   | Entidade abstrata para representar informações gerais dos Estoques. Nele é possível alterar ou diminuir a quantidade. |

## Modelo de Dados (Entidade-Relacionamento)

```mermaid
erDiagram
    USUARIO {
        long id PK
        string name
        string login
        string password
        boolean isAdmin
    }

    CATEGORIA {
        long id PK
        string nome
    }

    PRODUTO {
        long id PK
        string nome
        double preco
        long id_categoria FK
    }
    CATEGORIA ||--o{ PRODUTO : "possui"

    LOG {
        long id PK
        Date data_movimentacao
        long id_estoque FK 
        int quantidade
    }

    ESTOQUE {
        long id PK
        int quantidade
        long id_produto FK
    }
    ESTOQUE ||--o{ LOG : "possui"
    ESTOQUE ||--|| PRODUTO : "tem"

```

### Dicionário de Dados

|   Tabela   | Laboratório |
| ---------- | ----------- |
| Usuário  | Armazena as informações de um laboratório acadêmico. |
| Categoria | Armazena as categorias que serão utilizadas no relacionamento com os Produtos. |
| Produto | Contém os diversos produtos presentes no sistmea. |
| Estoque | Armazena as informações do estoque em si. |
| Log | Armazena os logs relacionados ao movimento de estoque. |

|  Nome         | Descrição                        | Tipo de Dado | Tamanho | Restrições de Domínio |
| ------------- | -------------------------------- | ------------ | ------- | --------------------- |
| id                 | identificador gerado pelo SGBD                | BIGINT       | --     | PK / Identity |
| name               | nome do usuário                               | VARCHAR      | 30     | Not Null |
| login              | login do usuário                              | VARCHAR      | 30     | Unique / Not Null |
| password           | senha do usuário                              | VARCHAR      | 30     | Not Null |
| isAdmin            | identificador se o usuário é admin            | BOOLEAN      | --     | Not Null |
| nome               | nome da categoria                             | VARCHAR      | 40     | Unique / Not Null |
| nome               | nome do produto                               | VARCHAR      | 30     | Not Null |
| preco              | preço do produto                              | DOUBLE       | --     | Not Null |
| id_categoria       | id da categoria relacionado ao produto        | BIGINT       | --     | FK / Not Null |
| data_movimentacao  | data de movimentação do log                   | DATE         | --     | Not Null |
| id_estoque         | id do estoque relacionado ao log              | BIGINT       | 150    | FK / Not Null |
| quantidade         | quantidade do estoque                         | INT          | --     | Not Null |
| id_produto         | id do produto relacionado ao estoque          | BIGINT       | --     | FK / Unique / Not Null |
| quantidade         | quantidade alterada no log do estoque         | BIGINT       | --     | Not Null |