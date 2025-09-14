# 🚀 Guía de Uso de la Plantilla FrankmanTaskFast

## 📋 Resumen

Esta plantilla está diseñada para ser **completamente reutilizable** y **personalizable**. Con solo clonar el repositorio y ejecutar un script, puedes tener tu propio proyecto full-stack configurado y listo para usar.

## 🎯 Características Dinámicas

### ✅ **Personalización Automática**
- **Nombre de la aplicación** configurable
- **Puertos dinámicos** para frontend y backend
- **Configuración de base de datos** personalizable
- **Variables de entorno** generadas automáticamente

### ✅ **Scripts de Inicialización**
- **Configuración automática** con prompts interactivos
- **Generación de archivos .env** personalizados
- **Actualización de package.json** con tu información
- **Creación de base de datos** automática

## 🚀 Uso de la Plantilla

### **Opción 1: Inicialización Automática (Recomendada)**

```bash
# 1. Clonar la plantilla
git clone <tu-repo> mi-nuevo-proyecto
cd mi-nuevo-proyecto

# 2. Configuración básica
./scripts/setup.sh

# 3. Personalización completa
./scripts/init-project.sh
```

### **Opción 2: Configuración Manual**

```bash
# 1. Clonar la plantilla
git clone <tu-repo> mi-nuevo-proyecto
cd mi-nuevo-proyecto

# 2. Instalar dependencias
npm install

# 3. Copiar y editar variables de entorno
cp env.template .env
# Editar .env con tus configuraciones

# 4. Crear archivo .env para Vite
cp env.template apps/web/.env
# Editar apps/web/.env con tus configuraciones
```

## 🔧 Variables de Entorno Disponibles

### **Información de la Aplicación**
```bash
APP_NAME=MiProyecto                    # Nombre de tu aplicación
APP_DESCRIPTION=Mi Descripción         # Descripción del proyecto
APP_VERSION=1.0.0                      # Versión inicial
APP_AUTHOR=Tu Nombre                   # Autor del proyecto
```

### **Configuración de Puertos**
```bash
FRONTEND_PORT=5173                     # Puerto del frontend
BACKEND_PORT=3001                      # Puerto del backend
```

### **Configuración de Base de Datos**
```bash
DB_NAME=mi_proyecto                    # Nombre de la base de datos
DB_HOST=localhost                      # Host de PostgreSQL
DB_PORT=5432                          # Puerto de PostgreSQL
DB_USER=postgres                      # Usuario de la base de datos
DB_PASSWORD=password                  # Contraseña de la base de datos
```

### **Configuración de Desarrollo**
```bash
NODE_ENV=development                   # Entorno de desarrollo
API_BASE_URL=http://localhost:3001    # URL base de la API
FRONTEND_URL=http://localhost:5173    # URL base del frontend
CORS_ORIGIN=http://localhost:5173     # Origen para CORS
```

## 📝 Proceso de Inicialización

### **1. Script de Inicialización (`init-project.sh`)**

El script te guiará a través de:

1. **Información del proyecto**
   - Nombre de la aplicación
   - Descripción
   - Autor
   - Versión

2. **Configuración de puertos**
   - Puerto del frontend
   - Puerto del backend

3. **Configuración de base de datos**
   - Nombre de la base de datos
   - Credenciales de PostgreSQL

4. **Configuración adicional**
   - Entorno de desarrollo
   - URLs de la aplicación

### **2. Archivos Generados Automáticamente**

- **`.env`** - Variables de entorno del proyecto
- **`apps/web/.env`** - Variables de entorno para Vite
- **`package.json`** actualizados con tu información
- **`README.md`** personalizado
- **Base de datos** creada (si PostgreSQL está disponible)

### **3. Verificaciones Automáticas**

- ✅ **Lint check** - Verificación de código
- ✅ **Type check** - Verificación de tipos TypeScript
- ✅ **Build check** - Verificación de compilación

## 🎨 Personalización Avanzada

### **Cambiar el Nombre de la Aplicación**

```bash
# En el archivo .env
APP_NAME=MiNuevoProyecto

# En el archivo apps/web/.env
VITE_APP_NAME=MiNuevoProyecto
```

### **Cambiar Puertos**

```bash
# En el archivo .env
FRONTEND_PORT=3000
BACKEND_PORT=8000

# Las URLs se actualizarán automáticamente
API_BASE_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000
```

### **Configurar Base de Datos Externa**

```bash
# En el archivo .env
DB_HOST=mi-servidor.com
DB_PORT=5432
DB_USER=mi_usuario
DB_PASSWORD=mi_contraseña
DB_NAME=mi_base_datos
```

## 🔄 Flujo de Desarrollo

### **Desarrollo Local**

```bash
# Terminal 1: Backend
npm run dev:api

# Terminal 2: Frontend
npm run dev:web
```

### **URLs de Desarrollo**

- **Frontend**: http://localhost:5173 (o el puerto configurado)
- **Backend**: http://localhost:3001 (o el puerto configurado)
- **Health Check**: http://localhost:3001/health

### **Comandos Útiles**

```bash
# Desarrollo
npm run dev              # Ambos juntos
npm run dev:web          # Solo frontend
npm run dev:api          # Solo backend

# Build y Deploy
npm run build            # Construir ambos
npm run build:web        # Solo frontend
npm run build:api        # Solo backend

# Calidad de Código
npm run lint             # Lint ambos
npm run type-check       # Verificar tipos
npm run clean            # Limpiar builds
```

## 🚀 Deploy

### **Frontend (Vercel/Netlify)**

```bash
# 1. Configurar variables de entorno en la plataforma
VITE_APP_NAME=MiProyecto
VITE_API_URL=https://mi-api.com

# 2. Build y deploy
npm run build:web
# Deploy dist/ folder
```

### **Backend (Railway/Heroku)**

```bash
# 1. Configurar variables de entorno en la plataforma
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:port/dbname
BACKEND_PORT=3001

# 2. Build y deploy
npm run build:api
# Deploy con variables de entorno
```

## 📚 Estructura de Archivos

```
mi-proyecto/
├─ apps/
│  ├─ web/              # Frontend personalizado
│  └─ api/              # Backend personalizado
├─ packages/
│  ├─ types/            # Tipos compartidos
│  └─ config/           # Configuraciones centralizadas
├─ scripts/
│  ├─ setup.sh          # Configuración básica
│  └─ init-project.sh   # Personalización completa
├─ .env                 # Variables de entorno del proyecto
├─ env.template         # Plantilla de variables de entorno
└─ README.md            # Documentación personalizada
```

## 🔧 Solución de Problemas

### **Error: Puerto en uso**

```bash
# Cambiar puerto en .env
FRONTEND_PORT=3000
BACKEND_PORT=8000
```

### **Error: Base de datos no encontrada**

```bash
# Crear base de datos manualmente
createdb mi_base_datos

# O cambiar el nombre en .env
DB_NAME=mi_nueva_base_datos
```

### **Error: Variables de entorno no cargadas**

```bash
# Verificar que los archivos .env existen
ls -la .env
ls -la apps/web/.env

# Reiniciar los servidores de desarrollo
npm run dev:api
npm run dev:web
```

## 📖 Recursos Adicionales

- **README.md** - Guía rápida del proyecto
- **template-config.md** - Documentación completa de la plantilla
- **IMPLEMENTATION.md** - Detalles técnicos de la implementación
- **env.template** - Plantilla de variables de entorno

## 🎉 ¡Listo para Usar!

Con esta plantilla, puedes:

1. **Clonar** el repositorio
2. **Ejecutar** `./scripts/init-project.sh`
3. **Personalizar** tu proyecto
4. **Comenzar** a desarrollar inmediatamente

**¡La plantilla está diseñada para ser completamente reutilizable y personalizable!** 🚀
