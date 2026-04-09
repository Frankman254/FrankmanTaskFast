export type PrioridadTarea = 'Alta' | 'Media' | 'Baja';
export type TipoGrilla = 'todo' | 'doing' | 'done' | 'custom';

export interface Grilla {
	id: number;
	proyect_id: number;
	name: string;
	position: number;
	color: string;
	tipo: TipoGrilla;
	created_at?: string;
	updated_at?: string;
}

export interface Proyecto {
	id: number;
	name: string;
	description: string;
	owner_id: number;
	color: string;
	is_archived: boolean;
	created_at?: string;
	updated_at?: string;
}

export interface TareaHistoryEntry {
	action: string;
	timestamp: string;
	from_grilla?: number;
	to_grilla?: number;
}

export interface Tarea {
	id: number;
	grilla_id: number;
	title: string;
	description: string;
	position: number;
	assigned_to: number;
	start_date: string;
	due_date: string;
	priority: PrioridadTarea;
	created_by: number;
	created_at: string;
	updated_at: string;
	history?: TareaHistoryEntry[];
}
