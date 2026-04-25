USE foodzero;

-- 1. Garante que as Tags existam (sem duplicar)
INSERT IGNORE INTO tags (name) VALUES ('Healthy'), ('Spicy'), ('Vegan'), ('Chef Special');

-- 2. Inserindo Pratos de Exemplo
INSERT INTO plates (name, price, description, image_path) VALUES 
('Classic Caesar Salad', 35.00, 'Crispy romaine lettuce, croutons, and our signature Caesar dressing.', 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9'),
('Beef Tenderloin', 85.50, 'Tender beef served with red wine reduction and roasted potatoes.', 'https://images.unsplash.com/photo-1546241072-48010ad28c2c'),
('Mushroom Risotto', 62.00, 'Creamy Arborio rice with wild mushrooms and truffle oil.', 'https://images.unsplash.com/photo-1476124369491-e7addf5db371');

-- 3. Associando Pratos às Categorias criadas no dbInit.sql
-- Starters (ID 1), Mains (ID 2)
INSERT INTO plate_category (plate_id, category_id) VALUES 
(1, 1), 
(2, 2), 
(3, 2);

-- 4. Inserindo Posts no Blog (Assumindo que o Admin tem ID 1)
INSERT INTO posts (created_at, description, user_id) VALUES 
(NOW(), 'Our secret to the perfect seasoning lies in patience and fresh herbs from our local garden.', 1),
(NOW(), 'Exciting news! Our winter menu is finally here with 5 new signature dishes.', 1);

-- 5. Associando Tags aos Posts
-- Tags: Healthy (ID 1), Spicy (ID 2), Vegan (ID 3), Chef Special (ID 4)
INSERT INTO post_tag (post_id, tag_id) VALUES 
(1, 4), 
(2, 1);

-- 6. Inserindo Comentários de Exemplo
INSERT INTO comments (commented_at, description, post_id, user_id) VALUES 
(NOW(), 'I tried the risotto yesterday, it was amazing!', 1, 1),
(NOW(), 'Can not wait to try the new winter menu!', 2, 1);
