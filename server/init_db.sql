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

-- Mensaje de éxito
\echo '==================================================='
\echo 'Base de datos inicializada correctamente.'
\echo 'Usuarios por defecto creados: admin, johndoe, janesmith, bob'
\echo '==================================================='
