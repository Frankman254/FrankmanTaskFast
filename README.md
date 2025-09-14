# 🚀 FrankmanTaskFast

**Plantilla de proyecto full-stack optimizada** con monorepo, diseñada para ser compacta, funcional y fácil de entender.

## ⚡ Inicio Rápido

```bash
# 1. Configuración básica
./scripts/setup.sh

# 2. Personalización completa (recomendado)
./scripts/init-project.sh

# 3. Desarrollo (2 terminales)
npm run dev:api    # Terminal 1 - Backend
npm run dev:web    # Terminal 2 - Frontend
```

## 🎯 Plantilla Reutilizable

Esta plantilla está diseñada para ser **completamente personalizable**:

- ✅ **Nombre de la aplicación** configurable
- ✅ **Puertos dinámicos** para frontend y backend  
- ✅ **Configuración de base de datos** personalizable
- ✅ **Variables de entorno** generadas automáticamente
- ✅ **Scripts de inicialización** interactivos

## 🏗️ Estructura Compacta

```
frankman-task-fast/
├─ apps/
│  ├─ web/          # React + Vite + Tailwind
│  └─ api/          # Express + TypeScript + PostgreSQL
├─ packages/
│  ├─ types/        # Tipos compartidos
│  └─ config/       # Configuraciones centralizadas
├─ scripts/         # Scripts de configuración
└─ .env.example     # Variables de entorno
```

## 🚀 Comandos Principales

### Desarrollo
```bash
npm run dev         # Ambos juntos
npm run dev:web     # Solo frontend
npm run dev:api     # Solo backend
```

### Build y Deploy
```bash
npm run build       # Construir ambos
npm run build:web   # Solo frontend
npm run build:api   # Solo backend
```

### Calidad de Código
```bash
npm run lint        # Lint ambos
npm run type-check  # Verificar tipos
npm run clean       # Limpiar builds
```

## 🛠️ Stack Tecnológico

### Frontend
- **React 19** + **TypeScript**
- **Vite** para desarrollo rápido
- **Tailwind CSS** para estilos
- **ESLint** con tabs

### Backend
- **Express.js** + **TypeScript**
- **PostgreSQL** con conexión configurada
- **Endpoints básicos** para testing
- **Plantilla limpia** lista para personalizar

### Compartido
- **npm workspaces** para monorepo
- **Tipos compartidos** entre apps
- **Configuraciones centralizadas**

## 🔧 Configuración Manual

### 1. Instalación
```bash
npm install
```

### 2. Variables de Entorno
```bash
cp .env.example .env
# Editar .env con tus credenciales
```

### 3. Base de Datos
```bash
# Crear base de datos
createdb frankman_task_fast

# Ejecutar migraciones
cd apps/api
npm run migrate

# Poblar con datos de ejemplo
npm run seed
```

## 📦 URLs de Desarrollo

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

## 🎨 Convenciones

- **Indentación**: Tabs con width 4
- **Componentes**: PascalCase (`UserCard.tsx`)
- **Hooks**: camelCase con prefijo `use` (`useAuth.ts`)
- **Tipos**: PascalCase (`User`, `ApiResponse`)

## 📚 Documentación Completa

Para documentación detallada, configuración avanzada y ejemplos, consulta:
- **`TEMPLATE-USAGE.md`** - Guía de uso de la plantilla
- **`template-config.md`** - Documentación completa de la plantilla
- **`IMPLEMENTATION.md`** - Detalles técnicos de la implementación
- **`scripts/init-project.sh`** - Script de personalización completa

## 🚀 Deploy

### Frontend (Vercel/Netlify)
```bash
npm run build:web
# Deploy dist/ folder
```

### Backend (Railway/Heroku)
```bash
npm run build:api
# Deploy con variables de entorno
```

---

**¡Esta plantilla está lista para usar en tus proyectos!** 🎉

Para más detalles, ejecuta `./scripts/setup.sh` o consulta `template-config.md`.