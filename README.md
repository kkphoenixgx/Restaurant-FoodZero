# 🍽️ FoodZero - Restaurante & Blog

[Português](#br) | [English](#en)

---

<a name="br"></a>
## 🇧🇷 Português

### 📝 Sobre o Projeto
FoodZero é uma plataforma completa para restaurantes que combina um **Cardápio Interativo**, um **Sistema de Reservas** e um **Blog Gastronômico**. O projeto foi desenvolvido com uma arquitetura robusta, focando em separação de responsabilidades (DAO Pattern) e uma interface moderna e responsiva.

### ✨ Funcionalidades Principais
*   **Cardápio Digital:** Listagem de pratos por categorias com sistema de gerenciamento para administradores.
*   **Blog:** Posts com tags e sistema de comentários para interação com os clientes.
*   **Reservas:** Sistema simplificado para reserva de mesas.
*   **Painel Administrativo:** Usuários com a role `admin` podem cadastrar novos pratos, categorias e gerenciar o conteúdo do site.
*   **Upload de Imagens:** Suporte para upload de fotos de perfil e pratos via Multer.

### 🛠️ Tecnologias
*   **Frontend:** Vue.js 3 (Composition API), TypeScript, Vite, Vanilla CSS.
*   **Backend:** Node.js, Express, TypeScript, MySQL.
*   **DevOps:** Docker, Docker Compose.

### 🚀 Como Testar (Docker)
Certifique-se de ter o Docker instalado em sua máquina.

#### 1. Subir com Dados Iniciais (Recomendado para Vitrine)
Este comando sobe a aplicação já populada com posts, pratos, categorias e usuários de teste.
```bash
docker compose --profile seed up --build
```
*   **Acesso:** `http://localhost`
*   **Admin Padrão:** `admin@foodzero.com` / `admin123` para editar e deletar

#### 2. Subir Ambiente Limpo
Este comando sobe apenas a estrutura do banco de dados, permitindo que você realize os cadastros manualmente.
```bash
docker compose up --build
```

---

<a name="en"></a>
## 🇺🇸 English

### 📝 About the Project
FoodZero is a comprehensive restaurant platform that combines an **Interactive Menu**, a **Reservation System**, and a **Gastronomic Blog**. The project was developed with a robust architecture, focusing on separation of concerns (DAO Pattern) and a modern, responsive interface.

### ✨ Key Features
*   **Digital Menu:** List of dishes by categories with a management system for administrators.
*   **Blog:** Posts with tags and a comment system for customer interaction.
*   **Reservations:** Simplified system for table bookings.
*   **Admin Panel:** Users with the `admin` role can register new dishes, categories, and manage site content.
*   **Image Upload:** Support for profile and dish photo uploads via Multer.

### 🛠️ Technologies
*   **Frontend:** Vue.js 3 (Composition API), TypeScript, Vite, Vanilla CSS.
*   **Backend:** Node.js, Express, TypeScript, MySQL.
*   **DevOps:** Docker, Docker Compose.

### 🚀 How to Test (Docker)
Make sure you have Docker installed on your machine.

#### 1. Start with Seed Data (Recommended for Showcase)
This command starts the application already populated with posts, dishes, categories, and test users.
```bash
docker compose --profile seed up --build
```
*   **Access:** `http://localhost`
*   **Default Admin:** `admin@foodzero.com` / `admin123` to edit and delete

#### 2. Start Clean Environment
This command starts only the database structure, allowing you to perform registrations manually.
```bash
docker compose up --build
```

---

### 📂 Structure
*   `/backend`: Node.js API with DAO Pattern.
*   `/frontEnd`: Vue.js 3 Single Page Application.
*   `/dbInit.sql`: Database schema.
*   `/dbSeed.sql`: Initial data for testing.
