# 🚀 FrankmanTaskFast - Plantilla de Proyecto

## 📋 Descripción
Plantilla optimizada para proyectos full-stack con monorepo, diseñada para ser compacta, funcional y fácil de entender.

## 🏗️ Estructura del Proyecto

```
frankman-task-fast/
├─ apps/
│  ├─ web/                  # Frontend: React + Vite + Tailwind
│  │  ├─ src/
│  │  │  ├─ app/            # Componentes principales
│  │  │  ├─ components/     # Componentes reutilizables
│  │  │  ├─ hooks/          # Custom hooks
│  │  │  ├─ lib/            # Utilidades
│  │  │  └─ types/          # Tipos locales
│  │  ├─ public/            # Archivos estáticos
│  │  ├─ index.html         # HTML principal
│  │  ├─ package.json       # Dependencias frontend
│  │  ├─ tsconfig.json      # Config TypeScript
│  │  ├─ vite.config.ts     # Config Vite
│  │  ├─ tailwind.config.ts # Config Tailwind
│  │  └─ eslint.config.js   # Config ESLint
│  └─ api/                  # Backend: Express + TypeScript + PostgreSQL
│     ├─ src/
│     │  ├─ routes/         # Rutas API
│     │  ├─ db/             # Conexión DB
│     │  ├─ middleware/     # Middlewares
│     │  └─ types/          # Tipos locales
│     ├─ scripts/           # Scripts de migración
│     ├─ migrations/        # SQL migrations
│     ├─ package.json       # Dependencias backend
│     ├─ tsconfig.json      # Config TypeScript
│     └─ eslint.config.js   # Config ESLint
├─ packages/
│  ├─ types/                # Tipos compartidos
│  │  ├─ index.ts           # Exportaciones principales
│  │  └─ package.json       # Config del paquete
│  └─ config/               # Configuraciones compartidas
│     ├─ index.ts           # Configuraciones centralizadas
│     ├─ tsconfig.base.json # Base TypeScript
│     ├─ eslint.base.cjs    # Base ESLint
│     └─ package.json       # Config del paquete
├─ .editorconfig            # Configuración del editor
├─ .env.example             # Variables de entorno
├─ package.json             # Configuración raíz
├─ tsconfig.json            # Config TypeScript raíz
└─ README.md                # Documentación
```

## 🎯 Características Principales

### ✅ **Monorepo Optimizado**
- **npm workspaces** para gestión de dependencias
- **Tipos compartidos** entre frontend y backend
- **Configuraciones centralizadas** para consistencia

### ✅ **Frontend Moderno**
- **React 19** con TypeScript
- **Vite** para desarrollo rápido
- **Tailwind CSS** para estilos
- **ESLint** con configuración de tabs

### ✅ **Backend Robusto**
- **Express.js** con TypeScript
- **PostgreSQL** con queries nativas
- **Zod** para validación
- **Migraciones** automáticas

### ✅ **Desarrollo Eficiente**
- **Comandos separados** para frontend/backend
- **Hot reload** en ambos lados
- **Type checking** automático
- **Linting** consistente

## 🚀 Comandos Principales

### Desarrollo
```bash
# Ambos juntos
npm run dev

# Por separado (recomendado)
npm run dev:web    # Terminal 1
npm run dev:api    # Terminal 2
```

### Build y Deploy
```bash
npm run build      # Construir ambos
npm run build:web  # Solo frontend
npm run build:api  # Solo backend
```

### Calidad de Código
```bash
npm run lint       # Lint ambos
npm run type-check # Verificar tipos
npm run clean      # Limpiar builds
```

## 🔧 Configuración Inicial

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

### 4. Desarrollo
```bash
# Terminal 1: Backend
npm run dev:api

# Terminal 2: Frontend
npm run dev:web
```

## 📦 Dependencias Clave

### Frontend
- `react` + `react-dom` - UI framework
- `vite` - Build tool
- `tailwindcss` - CSS framework
- `typescript` - Type safety

### Backend
- `express` - Web framework
- `pg` - PostgreSQL client
- `zod` - Schema validation
- `tsx` - TypeScript execution

### Compartido
- `typescript` - Type system
- `eslint` - Code linting

## 🎨 Convenciones de Código

### Indentación
- **Tabs** con width 4
- Configurado en `.editorconfig`
- Aplicado automáticamente por ESLint

### Estructura de Archivos
- **Componentes** en `src/components/`
- **Hooks** en `src/hooks/`
- **Utilidades** en `src/lib/`
- **Tipos** en `src/types/`

### Naming
- **Componentes**: PascalCase (`UserCard.tsx`)
- **Hooks**: camelCase con prefijo `use` (`useAuth.ts`)
- **Utilidades**: camelCase (`formatDate.ts`)
- **Tipos**: PascalCase (`User`, `ApiResponse`)

## 🔄 Flujo de Desarrollo

1. **Crear feature branch**
2. **Desarrollar en ambos lados** (frontend + backend)
3. **Usar comandos separados** para debugging
4. **Verificar con lint y type-check**
5. **Build y test** antes de merge

## 📝 Personalización

### Agregar Nueva Ruta API
1. Crear archivo en `apps/api/src/routes/`
2. Importar en `apps/api/src/app.ts`
3. Agregar tipos en `packages/types/`

### Agregar Nuevo Componente
1. Crear en `apps/web/src/components/`
2. Exportar desde `apps/web/src/components/index.ts`
3. Usar en `apps/web/src/app/`

### Agregar Nueva Dependencia
```bash
# Frontend
cd apps/web && npm install package-name

# Backend
cd apps/api && npm install package-name

# Compartido
npm install package-name --workspace=packages/types
```

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

## 📚 Recursos Adicionales

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Express.js](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [TypeScript](https://www.typescriptlang.org/)

---

**¡Esta plantilla está lista para usar en tus proyectos!** 🎉
