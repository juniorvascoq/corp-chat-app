-- Script de inicialización para la Base de Datos de Corp Chat App
-- Ejecutar en PostgreSQL con: psql -U postgres -d corp_chat_app -f init_db.sql

-- 1. Crear tabla de Usuarios
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Crear tabla de Mensajes
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    username VARCHAR(100) NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Insertar usuarios de prueba por defecto
INSERT INTO users (username, password_hash) VALUES
('admin', 'admin123'),
('johndoe', 'password123'),
('janesmith', 'password123'),
('bob', 'password123')
ON CONFLICT (username) DO NOTHING;

-- 4. Crear tabla de Productos
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER NOT NULL,
    CONSTRAINT fk_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. Insertar productos de prueba por defecto (asumiendo que admin tiene id 1)
INSERT INTO products (name, price, created_by) VALUES
('Teclado Mecánico', 120.50, 1),
('Mouse Inalámbrico', 45.00, 1),
('Monitor 27" 4K', 350.00, 2),
('Silla Ergonómica', 210.00, 2)
ON CONFLICT DO NOTHING;

-- Mensaje de éxito
\echo '==================================================='
\echo 'Base de datos inicializada correctamente.'
\echo 'Tablas creadas: users, messages, products'
\echo 'Usuarios por defecto creados: admin, johndoe, janesmith, bob'
\echo '==================================================='
