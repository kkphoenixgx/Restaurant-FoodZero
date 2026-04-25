# Arquitetura do Frontend - FoodZero

Este documento detalha a estrutura, tecnologias e os padrões de desenvolvimento utilizados no frontend do projeto FoodZero.

---

## 🚀 Tecnologias e Ferramentas
*   **Framework:** Vue.js 3 (Composition API com `<script setup>`)
*   **Linguagem:** TypeScript
*   **Ferramenta de Build:** Vite
*   **Roteamento:** Vue Router
*   **Comunicação API:** Fetch API (centralizada em serviços)
*   **Estilização:** Vanilla CSS (utilizando CSS Scoped em componentes e variáveis globais em `style.css`)
*   **Testes:** Vitest e Vue Testing Library.

---

## 📂 Estrutura de Pastas (`/src`)

```text
src/
├── assets/           # Arquivos estáticos (imagens, ícones, fontes)
├── components/       # Componentes Vue reutilizáveis
│   ├── layout/       # Estruturas fixas (Header, Footer)
│   └── ui/           # Componentes atômicos (Buttons, Inputs, Widgets)
├── router/           # Configuração de rotas do Vue Router
├── services/         # Camada de comunicação com o Backend
│   ├── api.ts        # Configuração base e helpers do Fetch
│   └── [entity].ts   # Serviços específicos por entidade (plates, user, etc)
├── types/            # Definições de tipos e interfaces
│   ├── Model/        # Classes de Modelo (Domain Objects)
│   └── I[Entity].ts  # Interfaces de resposta da API
├── views/            # Componentes de página (Views completas)
├── App.vue           # Componente raiz
└── main.ts           # Ponto de entrada (Inicialização do Vue)
```

---

## 🏗️ Padrões de Design e Fluxo de Dados

### 1. Componentização Hierárquica
O sistema divide os componentes em três níveis:
*   **Layout:** Header e Footer (fixos).
*   **Views:** Páginas que gerenciam estado e chamam serviços.
*   **UI Components:** Componentes reutilizáveis (stateless) guiados por `props`.

### 2. Camada de Serviço (Service Layer)
Isola a lógica de comunicação HTTP.
*   **Mapeamento de Dados:** Transforma respostas JSON brutas (ex: `IPostApiResponse`) em instâncias de classes de modelo (ex: `Post`).
*   **Consistência de Modelos:** O modelo de `Post` foi atualizado para remover o campo `tittle` (título), alinhando o frontend com a estrutura simplificada do banco de dados (que foca na descrição/conteúdo).

### 3. Gerenciamento de Estado
*   Utiliza `ref` e `reactive` do Vue 3.
*   Persiste dados de login no `localStorage` para controle de sessão e permissões (`isAdmin`).

---

## 🔄 Fluxo de uma Página (Exemplo: Menu)

1.  **Montagem:** O componente `Menu.vue` busca dados ao ser montado.
2.  **Chamada de Serviço:** Invoca `listPlates()`.
3.  **Fetch:** O serviço busca os dados no backend (URL definida por `VITE_API_URL`).
4.  **Renderização:** O Vue renderiza os pratos. Se o usuário for admin, o formulário de cadastro é disponibilizado.

---

## 🎨 Estilização
*   **Variáveis Globais:** Cores e fontes no `style.css`.
*   **Scoped CSS:** Estilos locais em cada arquivo `.vue`.
*   **Tipografia:** `Rufina` para títulos e `Inter` para corpo.

---

## 🔐 Autenticação e Autorização
*   **Roles:** O sistema diferencia `admin` de `user`.
*   **Condicionais:** Elementos de interface (como botões de edição ou cadastro) são protegidos por verificações baseadas no objeto `user` do `localStorage`.

---

## 🖼️ Tratamento de Imagens
*   O frontend exibe imagens vindas do backend através da rota `/uploads`.
*   Utiliza um `defaultServer` (variável de ambiente) para construir o caminho completo das imagens de perfil e pratos.
*   Fallback para imagens padrão (`user-default.png`) em caso de erro de carregamento ou ausência de foto.

---

## 🛠️ Como criar uma nova funcionalidade

1.  **Tipos:** Interface e Classe de Modelo em `src/types/`.
2.  **Serviço:** Métodos em `src/services/`.
3.  **UI:** Componentes em `src/components/ui/`.
4.  **View:** Página em `src/views/` integrando o novo serviço.
5.  **Rota:** Registro no `src/router/index.ts`.
