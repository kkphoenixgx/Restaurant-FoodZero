# Arquitetura do Backend - FoodZero

Este documento detalha a estrutura, tecnologias, padrões de design e o fluxo de dados do backend do projeto FoodZero.

---

## 🚀 Tecnologias e Ferramentas
*   **Runtime:** Node.js
*   **Linguagem:** TypeScript
*   **Framework Web:** Express.js
*   **Banco de Dados:** MySQL (utilizando a biblioteca `mysql2/promise`)
*   **Autenticação/Segurança:** bcrypt (para hash de senhas), Helmet (headers de segurança), CORS.
*   **Logging/Debug:** Morgan (log de requisições HTTP).
*   **Gerenciamento de Arquivos:** Multer (upload de imagens).
*   **Testes:** Jest.

---

## 📂 Estrutura de Pastas (`/src`)

```text
src/
├── app.ts            # Configuração central do Express (middlewares, rotas globais)
├── index.ts          # Ponto de entrada (Bootstrapping do servidor)
├── middlewares.ts    # Middlewares globais (Tratamento de erros e 404)
├── api/              # Núcleo da API
│   ├── index.ts      # Agregador de rotas principais
│   ├── db/           # Camada de Persistência (DAOs e Conexão)
│   ├── model/        # Modelos de Domínio (Classes POJO)
│   ├── routes/       # Definição de Endpoints e Lógica de Roteamento
│   └── service/      # Regras de Negócio complexas (ex: PasswordService)
├── interfaces/       # Definições de Tipos e Interfaces globais
└── public/           # Arquivos estáticos (Uploads de imagens)
```

---

## 🏗️ Padrões de Design e Arquitetura

### 1. Data Access Object (DAO)
O projeto utiliza o padrão **DAO** para isolar a lógica de acesso ao banco de dados da lógica de negócio.
*   **Localização:** `src/api/db/`
*   **Responsabilidade:** Cada DAO (ex: `DaoPlate`, `DaoUser`) contém os métodos SQL (`SELECT`, `INSERT`, `UPDATE`, `DELETE`) específicos para aquela entidade.
*   **Benefício:** Se o banco de dados mudar, apenas os DAOs precisam de alteração.

### 2. Connection Factory
A classe `ConnectionFactory` centraliza a criação de conexões com o MySQL.
*   **Uso:** Os DAOs chamam `ConnectionFactory.createConnection()` para obter uma instância de conexão baseada nas variáveis de ambiente (`.env`).

### 3. Modelos de Domínio (Rich Models)
As classes em `src/api/model/` representam os objetos do sistema.
*   **Remoção de Campos Obsoletos:** O campo `tittle` foi removido do modelo `Post` e das consultas do `DaoPost` para manter a paridade com a estrutura do banco de dados (tabela `posts`).

---

## 🔄 Fluxo de uma Requisição

1.  **Request:** O cliente envia uma requisição HTTP. O backend suporta tanto JSON quanto `multipart/form-data` (para uploads).
2.  **Middleware:** A requisição passa pelo `Morgan` (log), `Helmet` (segurança) e `express.json()` ou `multer`.
3.  **Router:** O `app.ts` encaminha para `api/index.ts`, que por sua vez roteia para o arquivo específico em `routes/`.
4.  **Lógica de Rota:** O arquivo de rota extrai os dados. As rotas são flexíveis:
    *   **Login:** Aceita `senha` ou `password`.
    *   **Pratos:** Aceita `value` ou `price`.
5.  **DAO:** A rota instancia o DAO correspondente e executa a operação.
6.  **Database:** O DAO executa o SQL no MySQL.
7.  **Response:** Retorna o objeto criado/atualizado ou uma mensagem de sucesso.

---

## 🔐 Segurança e Autenticação

### Senhas
As senhas são criptografadas com `bcrypt`. O login valida o hash armazenado no banco contra a senha enviada pelo cliente.

### Middlewares de Proteção
*   **Helmet:** Adiciona headers de segurança.
*   **CORS:** Habilitado para permitir a comunicação com o frontend.
*   **ErrorHandler:** Captura erros e evita o vazamento de stack traces em produção.

---

## 🖼️ Gerenciamento de Imagens (Uploads)
O sistema utiliza o `Multer` para processar uploads de arquivos.
*   **Configuração:** Utiliza `diskStorage` para salvar os arquivos em `public/uploads/` com nomes únicos baseados em timestamp.
*   **Endpoints suportados:** 
    *   `POST /api/users`: Campo `foto`.
    *   `POST /api/plates`: Campo `foto`.
*   **Limpeza:** Ao atualizar ou deletar uma entidade, o sistema apaga o arquivo físico antigo do servidor para economizar espaço.
*   **Acesso:** As imagens são servidas estaticamente através da rota `/uploads`.

---

## 🛠️ Como estender o Backend

1.  **Criar Tabela:** Adicione no `dbInit.sql`.
2.  **Criar Modelo:** Classe em `src/api/model/` (encapsulada).
3.  **Criar DAO:** Operações CRUD em `src/api/db/`.
4.  **Criar Rota:** Adicione em `src/api/routes/` e registre no agregador central.
