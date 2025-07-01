CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  en VARCHAR(10),
  avatar BYTEA,                            -- Binary image data
  name VARCHAR(100) NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  email VARCHAR(100),
  tel VARCHAR(20),
  position VARCHAR(50),
  team VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (en, avatar, name, username, password, email, tel, position, team)
VALUES (
  'EN001',
  '/avatars/admin.png',
  'John Smith',
  'admin',
  '$2b$10$iw.fph6ZLrvc1Ox19/F1KuUVs/PZBAZOsGcBvAptYgrvf02zyL6By',
  'admin@example.com',
  '123-456-7890',
  'Administrator',
  'IT'
);

Hashed password 12345: $2b$10$iw.fph6ZLrvc1Ox19/F1KuUVs/PZBAZOsGcBvAptYgrvf02zyL6By

UPDATE users
SET avatar = NULL
WHERE username = 'sompong';