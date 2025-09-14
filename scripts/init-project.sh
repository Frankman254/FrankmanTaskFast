#!/bin/bash

# 🚀 FrankmanTaskFast - Script de Inicialización de Proyecto
# Este script personaliza la plantilla para tu nuevo proyecto

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Función para imprimir mensajes
print_header() {
    echo -e "${PURPLE}================================${NC}"
    echo -e "${PURPLE}🚀 FrankmanTaskFast - Inicialización${NC}"
    echo -e "${PURPLE}================================${NC}"
    echo
}

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

print_question() {
    echo -e "${CYAN}[?]${NC} $1"
}

# Función para obtener input del usuario
get_input() {
    local prompt="$1"
    local default="$2"
    local value
    
    if [ -n "$default" ]; then
        read -p "$(print_question "$prompt [$default]: ")" value
        echo "${value:-$default}"
    else
        read -p "$(print_question "$prompt: ")" value
        echo "$value"
    fi
}

# Función para confirmar
confirm() {
    local prompt="$1"
    local default="${2:-y}"
    local response
    
    read -p "$(print_question "$prompt [$default]: ")" response
    response="${response:-$default}"
    [[ "$response" =~ ^[Yy]$ ]]
}

# Función para generar nombre de base de datos
generate_db_name() {
    local app_name="$1"
    echo "$app_name" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/_/g' | sed 's/__*/_/g' | sed 's/^_\|_$//g'
}

# Función para actualizar archivos
update_file() {
    local file="$1"
    local old_text="$2"
    local new_text="$3"
    
    if [ -f "$file" ]; then
        sed -i.bak "s|$old_text|$new_text|g" "$file"
        rm -f "$file.bak"
    fi
}

# Función para actualizar package.json
update_package_json() {
    local file="$1"
    local app_name="$2"
    local app_description="$3"
    local app_author="$4"
    
    if [ -f "$file" ]; then
        # Actualizar nombre
        sed -i.bak "s|\"name\": \".*\"|\"name\": \"$app_name\"|g" "$file"
        # Actualizar descripción si existe
        if grep -q '"description"' "$file"; then
            sed -i.bak "s|\"description\": \".*\"|\"description\": \"$app_description\"|g" "$file"
        fi
        # Actualizar autor si existe
        if grep -q '"author"' "$file"; then
            sed -i.bak "s|\"author\": \".*\"|\"author\": \"$app_author\"|g" "$file"
        fi
        rm -f "$file.bak"
    fi
}

# Función principal
main() {
    print_header
    
    print_status "Este script personalizará la plantilla para tu nuevo proyecto"
    echo
    
    # Obtener información del proyecto
    APP_NAME=$(get_input "Nombre de la aplicación" "MiProyecto")
    APP_DESCRIPTION=$(get_input "Descripción del proyecto" "Aplicación full-stack moderna")
    APP_AUTHOR=$(get_input "Autor del proyecto" "$(whoami)")
    APP_VERSION=$(get_input "Versión inicial" "1.0.0")
    
    echo
    print_status "Configuración de puertos:"
    FRONTEND_PORT=$(get_input "Puerto del frontend" "5173")
    BACKEND_PORT=$(get_input "Puerto del backend" "3001")
    
    echo
    print_status "Configuración de base de datos:"
    DB_NAME=$(get_input "Nombre de la base de datos" "$(generate_db_name "$APP_NAME")")
    DB_HOST=$(get_input "Host de la base de datos" "localhost")
    DB_PORT=$(get_input "Puerto de PostgreSQL" "5432")
    DB_USER=$(get_input "Usuario de la base de datos" "postgres")
    DB_PASSWORD=$(get_input "Contraseña de la base de datos" "password")
    
    echo
    print_status "Configuración adicional:"
    NODE_ENV=$(get_input "Entorno (development/production)" "development")
    
    # Confirmar configuración
    echo
    print_status "Resumen de la configuración:"
    echo -e "  ${CYAN}Nombre:${NC} $APP_NAME"
    echo -e "  ${CYAN}Descripción:${NC} $APP_DESCRIPTION"
    echo -e "  ${CYAN}Autor:${NC} $APP_AUTHOR"
    echo -e "  ${CYAN}Versión:${NC} $APP_VERSION"
    echo -e "  ${CYAN}Frontend:${NC} http://localhost:$FRONTEND_PORT"
    echo -e "  ${CYAN}Backend:${NC} http://localhost:$BACKEND_PORT"
    echo -e "  ${CYAN}Base de datos:${NC} $DB_NAME"
    echo -e "  ${CYAN}Entorno:${NC} $NODE_ENV"
    echo
    
    if ! confirm "¿Continuar con esta configuración?"; then
        print_warning "Inicialización cancelada"
        exit 0
    fi
    
    # Crear archivo .env
    print_status "Creando archivo .env..."
    cat > .env << EOF
# 🚀 Configuración de $APP_NAME
# Generado automáticamente el $(date)

# ===========================================
# INFORMACIÓN DE LA APLICACIÓN
# ===========================================
APP_NAME=$APP_NAME
APP_DESCRIPTION=$APP_DESCRIPTION
APP_VERSION=$APP_VERSION
APP_AUTHOR=$APP_AUTHOR

# ===========================================
# CONFIGURACIÓN DE PUERTOS
# ===========================================
FRONTEND_PORT=$FRONTEND_PORT
BACKEND_PORT=$BACKEND_PORT

# ===========================================
# CONFIGURACIÓN DE BASE DE DATOS
# ===========================================
DB_NAME=$DB_NAME
DB_HOST=$DB_HOST
DB_PORT=$DB_PORT
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD

# ===========================================
# CONFIGURACIÓN DE DESARROLLO
# ===========================================
NODE_ENV=$NODE_ENV
API_BASE_URL=http://localhost:$BACKEND_PORT
FRONTEND_URL=http://localhost:$FRONTEND_PORT
CORS_ORIGIN=http://localhost:$FRONTEND_PORT

# ===========================================
# CONFIGURACIÓN OPCIONAL
# ===========================================
DEBUG=true
SESSION_SECRET=$(openssl rand -base64 32)
EOF
    
    # Crear archivo .env para Vite (frontend)
    print_status "Creando archivo .env para Vite..."
    cat > apps/web/.env << EOF
# Variables de entorno para Vite (Frontend)
VITE_APP_NAME=$APP_NAME
VITE_APP_DESCRIPTION=$APP_DESCRIPTION
VITE_APP_VERSION=$APP_VERSION
VITE_APP_AUTHOR=$APP_AUTHOR
VITE_API_URL=http://localhost:$BACKEND_PORT
FRONTEND_PORT=$FRONTEND_PORT
EOF
    
    # Actualizar package.json del proyecto raíz
    print_status "Actualizando package.json del proyecto raíz..."
    update_package_json "package.json" "$APP_NAME" "$APP_DESCRIPTION" "$APP_AUTHOR"
    
    # Actualizar package.json del frontend
    print_status "Actualizando package.json del frontend..."
    update_package_json "apps/web/package.json" "$APP_NAME-web" "$APP_DESCRIPTION (Frontend)" "$APP_AUTHOR"
    
    # Actualizar package.json del backend
    print_status "Actualizando package.json del backend..."
    update_package_json "apps/api/package.json" "$APP_NAME-api" "$APP_DESCRIPTION (Backend)" "$APP_AUTHOR"
    
    # Actualizar README.md
    print_status "Actualizando README.md..."
    update_file "README.md" "FrankmanTaskFast" "$APP_NAME"
    update_file "README.md" "Kanban-Gantt Project Management" "$APP_DESCRIPTION"
    
    # Actualizar template-config.md
    print_status "Actualizando documentación..."
    update_file "template-config.md" "FrankmanTaskFast" "$APP_NAME"
    update_file "template-config.md" "Kanban-Gantt Project Management" "$APP_DESCRIPTION"
    
    # Instalar dependencias
    print_status "Instalando dependencias..."
    npm install
    
    # Crear base de datos si PostgreSQL está disponible
    if command -v psql &> /dev/null; then
        if confirm "¿Crear la base de datos '$DB_NAME'?"; then
            print_status "Creando base de datos..."
            createdb "$DB_NAME" 2>/dev/null || print_warning "Base de datos ya existe o error al crear"
            
        # Test de conexión a la base de datos
        print_status "Probando conexión a la base de datos..."
        print_success "Base de datos '$DB_NAME' creada correctamente"
        print_warning "Nota: Esta es una plantilla básica. Agrega tus propias tablas y migraciones según necesites."
        fi
    else
        print_warning "PostgreSQL no detectado. Por favor instala PostgreSQL para usar la base de datos."
    fi
    
    # Verificar configuración
    print_status "Verificando configuración..."
    
    # Lint check
    if npm run lint > /dev/null 2>&1; then
        print_success "Lint check pasado"
    else
        print_warning "Lint check falló - ejecuta 'npm run lint' para ver detalles"
    fi
    
    # Type check
    if npm run type-check > /dev/null 2>&1; then
        print_success "Type check pasado"
    else
        print_warning "Type check falló - ejecuta 'npm run type-check' para ver detalles"
    fi
    
    # Build check
    if npm run build > /dev/null 2>&1; then
        print_success "Build check pasado"
    else
        print_warning "Build check falló - ejecuta 'npm run build' para ver detalles"
    fi
    
    echo
    print_success "🎉 ¡Proyecto '$APP_NAME' inicializado correctamente!"
    echo
    echo "📋 Próximos pasos:"
    echo "1. Revisa el archivo .env y ajusta las configuraciones si es necesario"
    echo "2. Ejecuta 'npm run dev:api' en una terminal para el backend"
    echo "3. Ejecuta 'npm run dev:web' en otra terminal para el frontend"
    echo "4. Visita http://localhost:$FRONTEND_PORT para el frontend"
    echo "5. Visita http://localhost:$BACKEND_PORT/health para el backend"
    echo
    echo "📚 Documentación:"
    echo "- README.md - Guía rápida"
    echo "- template-config.md - Documentación completa"
    echo "- IMPLEMENTATION.md - Detalles técnicos"
    echo
    echo "🚀 ¡Feliz coding con $APP_NAME!"
}

# Ejecutar función principal
main "$@"
