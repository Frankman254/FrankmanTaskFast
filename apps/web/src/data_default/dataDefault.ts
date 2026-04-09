import type { Grilla, Proyecto, Tarea } from '@frankman-task-fast/types';

const today = new Date();

const formatDate = (date: Date) => date.toISOString().split('T')[0];

export const proyectosDefault: Proyecto[] = [
	{
		id: 1,
		name: 'FARS Tech Solutions',
		description: 'Desarrollo de productos digitales',
		owner_id: 1,
		color: '#6366f1',
		is_archived: false,
	},
	{
		id: 2,
		name: 'Personal',
		description: 'Tareas y metas personales',
		owner_id: 1,
		color: '#f59e0b',
		is_archived: false,
	},
];

export const grillasDefault: Grilla[] = [
	{
		id: 1,
		name: 'Por Hacer',
		position: 1,
		color: '#ef4444',
		proyect_id: 1,
		tipo: 'todo' as const,
	},
	{
		id: 2,
		name: 'En Progreso',
		position: 2,
		color: '#3b82f6',
		proyect_id: 1,
		tipo: 'doing' as const,
	},
	{
		id: 3,
		name: 'Revision',
		position: 3,
		color: '#f59e0b',
		proyect_id: 1,
		tipo: 'custom' as const,
	},
	{
		id: 4,
		name: 'Completado',
		position: 4,
		color: '#22c55e',
		proyect_id: 1,
		tipo: 'done' as const,
	},
	{
		id: 5,
		name: 'Ideas',
		position: 1,
		color: '#8b5cf6',
		proyect_id: 2,
		tipo: 'todo' as const,
	},
	{
		id: 6,
		name: 'En Curso',
		position: 2,
		color: '#06b6d4',
		proyect_id: 2,
		tipo: 'doing' as const,
	},
];

export const tareasDefault: Tarea[] = [
	{
		id: 1,
		grilla_id: 1,
		title: 'Disenar landing page',
		description: 'Crear wireframes y mockups para la nueva landing',
		position: 1,
		assigned_to: 1,
		start_date: formatDate(today),
		due_date: formatDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
		priority: 'Alta' as const,
		created_by: 1,
		created_at: today.toISOString(),
		updated_at: today.toISOString(),
	},
	{
		id: 2,
		grilla_id: 1,
		title: 'Configurar CI/CD',
		description: 'Pipeline de deployment automatico',
		position: 2,
		assigned_to: 1,
		start_date: formatDate(today),
		due_date: formatDate(new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)),
		priority: 'Media' as const,
		created_by: 1,
		created_at: today.toISOString(),
		updated_at: today.toISOString(),
	},
	{
		id: 3,
		grilla_id: 2,
		title: 'Implementar auth',
		description: 'Login con Google y GitHub OAuth',
		position: 1,
		assigned_to: 1,
		start_date: formatDate(today),
		due_date: formatDate(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)),
		priority: 'Alta' as const,
		created_by: 1,
		created_at: today.toISOString(),
		updated_at: today.toISOString(),
	},
	{
		id: 4,
		grilla_id: 4,
		title: 'Setup del repositorio',
		description: 'Estructura inicial del monorepo',
		position: 1,
		assigned_to: 1,
		start_date: formatDate(today),
		due_date: formatDate(new Date(Date.now() + 24 * 60 * 60 * 1000)),
		priority: 'Baja' as const,
		created_by: 1,
		created_at: today.toISOString(),
		updated_at: today.toISOString(),
	},
];
