#!/bin/bash

# 🚀 FrankmanTaskFast - Script de Configuración
# Este script configura automáticamente el proyecto

set -e

echo "🚀 Configurando FrankmanTaskFast..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir mensajes
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js no está instalado. Por favor instala Node.js 18+"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js versión 18+ requerida. Versión actual: $(node -v)"
    exit 1
fi

print_success "Node.js $(node -v) detectado"

# Verificar npm
if ! command -v npm &> /dev/null; then
    print_error "npm no está instalado"
    exit 1
fi

print_success "npm $(npm -v) detectado"

# Instalar dependencias
print_status "Instalando dependencias..."
npm install

if [ $? -eq 0 ]; then
    print_success "Dependencias instaladas correctamente"
else
    print_error "Error al instalar dependencias"
    exit 1
fi

# Configurar variables de entorno
if [ ! -f .env ]; then
    print_status "Creando archivo .env..."
    cp .env.example .env
    print_success "Archivo .env creado. Por favor edita las variables de entorno."
else
    print_warning "Archivo .env ya existe"
fi

# Verificar PostgreSQL
if command -v psql &> /dev/null; then
    print_success "PostgreSQL detectado"
    
    # Preguntar si crear la base de datos
    read -p "¿Crear la base de datos 'frankman_task_fast'? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Creando base de datos..."
        createdb frankman_task_fast 2>/dev/null || print_warning "Base de datos ya existe o error al crear"
        
        # Ejecutar migraciones
        print_status "Ejecutando migraciones..."
        cd apps/api
        npm run migrate 2>/dev/null || print_warning "Error al ejecutar migraciones"
        
        # Preguntar si poblar con datos de ejemplo
        read -p "¿Poblar con datos de ejemplo? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            print_status "Poblando base de datos..."
            npm run seed 2>/dev/null || print_warning "Error al poblar base de datos"
        fi
        
        cd ../..
    fi
else
    print_warning "PostgreSQL no detectado. Por favor instala PostgreSQL para usar la base de datos."
fi

# Verificar que todo funciona
print_status "Verificando configuración..."

# Lint check
npm run lint > /dev/null 2>&1
if [ $? -eq 0 ]; then
    print_success "Lint check pasado"
else
    print_warning "Lint check falló - ejecuta 'npm run lint' para ver detalles"
fi

# Type check
npm run type-check > /dev/null 2>&1
if [ $? -eq 0 ]; then
    print_success "Type check pasado"
else
    print_warning "Type check falló - ejecuta 'npm run type-check' para ver detalles"
fi

# Build check
npm run build > /dev/null 2>&1
if [ $? -eq 0 ]; then
    print_success "Build check pasado"
else
    print_warning "Build check falló - ejecuta 'npm run build' para ver detalles"
fi

echo
print_success "🎉 ¡Configuración completada!"
echo
echo "📋 Próximos pasos:"
echo "1. Ejecuta './scripts/init-project.sh' para personalizar el proyecto"
echo "2. O edita manualmente el archivo .env con tus credenciales"
echo "3. Ejecuta 'npm run dev:api' en una terminal"
echo "4. Ejecuta 'npm run dev:web' en otra terminal"
echo "5. Visita http://localhost:5173 para el frontend"
echo "6. Visita http://localhost:3001/health para el backend"
echo
echo "📚 Documentación:"
echo "- README.md - Guía rápida"
echo "- template-config.md - Documentación completa"
echo "- IMPLEMENTATION.md - Detalles técnicos"
echo
echo "🚀 ¡Feliz coding!"
