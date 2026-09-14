@echo off
echo ===================================================
echo Iniciando configuracion de la Base de Datos...
echo ===================================================

echo.
echo Paso 1: Creando la base de datos 'corp_chat_app' (ignora errores si ya existe)...
set PGPASSWORD=admin123
"C:\Program Files\PostgreSQL\14\bin\psql.exe" -U postgres -c "CREATE DATABASE corp_chat_app;"

echo.
echo Paso 2: Ejecutando el script de inicializacion (tablas y usuarios)...
"C:\Program Files\PostgreSQL\14\bin\psql.exe" -U postgres -d corp_chat_app -f server\init_db.sql

echo.
echo ===================================================
echo Finalizado. Si no hubo errores criticos, la DB esta lista.
echo ===================================================
pause
