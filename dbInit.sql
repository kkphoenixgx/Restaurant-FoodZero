-- Criação do banco de dados
CREATE DATABASE IF NOT EXISTS foodzero;

-- Seleciona o banco de dados para as próximas operações
USE foodzero;

-- Tabela de usuários
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    user_image TEXT,
    phone VARCHAR(50) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'user'))
);

-- Tabela de pratos (agora plate)
CREATE TABLE plates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    image_path TEXT NOT NULL,
    price DOUBLE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL
);

-- Tabela de categorias
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Relação muitos-para-muitos entre plates e categorias
CREATE TABLE plate_category (
    id INT AUTO_INCREMENT PRIMARY KEY,
    plate_id INT NOT NULL,
    category_id INT NOT NULL,
    FOREIGN KEY (plate_id) REFERENCES plates(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Tabela de reservas
CREATE TABLE reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reservation_datetime DATETIME NOT NULL,
    persons INT NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabela de posts
CREATE TABLE posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    created_at DATETIME NOT NULL,
    description TEXT NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabela de comentários nos posts
CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    commented_at DATETIME NOT NULL,
    description TEXT NOT NULL,
    post_id INT NOT NULL,
    user_id INT NULL,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Tabela de tags
CREATE TABLE tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Relação muitos-para-muitos entre posts e tags
CREATE TABLE post_tag (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    tag_id INT NOT NULL,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- admin@foodzero.com admin123
INSERT INTO users (name, email, password, phone, role) 
VALUES (
   'Administrador', 
   'admin@foodzero.com', 
   '$2b$10$XoevGecuHGRLmy/vYwcTm.Bg8GCPVcXIfMYZ9RsDVa3Lh6NHr2BPK', 
   '11999999999', 
   'admin'
);

INSERT INTO categories (name) VALUES 
('Starters'),
('Mains'),
('Desserts'),
('Soups'),
('Drinks');


