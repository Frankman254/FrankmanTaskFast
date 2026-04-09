import type { Grilla, Proyecto, Tarea, TipoGrilla } from '@frankman-task-fast/types';

import { grillasDefault, proyectosDefault, tareasDefault } from '@/data_default/dataDefault';

export interface BoardSnapshot {
	proyectos: Proyecto[];
	proyectoActivo: number | null;
	grillas: Grilla[];
	tareas: Tarea[];
}

interface StoredBoardSnapshot extends Partial<BoardSnapshot> {
	schemaVersion?: number;
}

export interface BoardRepository {
	loadBoard: () => BoardSnapshot;
	setProyectoActivo: (proyectoId: number | null) => BoardSnapshot;
	createProyecto: (
		proyecto: Omit<Proyecto, 'id' | 'created_at' | 'updated_at'>
	) => BoardSnapshot;
	createGrilla: (
		proyectoId: number,
		grilla: Omit<Grilla, 'id' | 'proyect_id' | 'position' | 'created_at' | 'updated_at'>
	) => BoardSnapshot;
	deleteGrilla: (grillaId: number) => BoardSnapshot;
	createTarea: (
		grillaId: number,
		tarea: Omit<Tarea, 'id' | 'grilla_id' | 'position' | 'created_at' | 'updated_at'>
	) => BoardSnapshot;
	reorderGrillas: (proyectoId: number, grillas: Grilla[]) => BoardSnapshot;
	reorderTareas: (proyectoId: number, tareas: Tarea[]) => BoardSnapshot;
	moveTarea: (
		tareaId: number,
		targetGrillaId: number,
		targetPosition: number
	) => BoardSnapshot;
}

const STORAGE_KEYS = {
	board: 'frankman_board',
	proyectoActivo: 'frankman_proyecto_activo',
	proyectos: 'frankman_proyectos',
	grillas: 'frankman_grillas',
	tareas: 'frankman_tareas',
} as const;

const CURRENT_SCHEMA_VERSION = 1;

const formatDateOnly = (value: string, fallback = '') => {
	if (!value) return fallback;
	if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;

	const parsed = new Date(value);
	if (Number.isNaN(parsed.getTime())) {
		return fallback;
	}

	return parsed.toISOString().split('T')[0];
};

const toNumber = (value: unknown, fallback = 0) => {
	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : fallback;
};

const inferGrillaTipo = (name: string, position: number): TipoGrilla => {
	const normalizedName = name.toLowerCase();

	if (
		normalizedName.includes('done') ||
		normalizedName.includes('complet')
	) {
		return 'done';
	}

	if (
		normalizedName.includes('doing') ||
		normalizedName.includes('progreso') ||
		normalizedName.includes('curso')
	) {
		return 'doing';
	}

	if (
		normalizedName.includes('todo') ||
		normalizedName.includes('hacer') ||
		normalizedName.includes('idea') ||
		position === 1
	) {
		return 'todo';
	}

	return 'custom';
};

const normalizeProyecto = (
	raw: unknown,
	index: number,
	now: string
): Proyecto | null => {
	if (!raw || typeof raw !== 'object') return null;
	const proyecto = raw as Partial<Proyecto>;
	const name = proyecto.name?.trim();

	if (!name) return null;

	return {
		id: toNumber(proyecto.id, index + 1),
		name,
		description: proyecto.description ?? '',
		owner_id: toNumber(proyecto.owner_id, 1),
		color: proyecto.color ?? '#3b82f6',
		is_archived: Boolean(proyecto.is_archived),
		created_at: proyecto.created_at ?? now,
		updated_at: proyecto.updated_at ?? now,
	};
};

const normalizeGrilla = (
	raw: unknown,
	index: number,
	now: string
): Grilla | null => {
	if (!raw || typeof raw !== 'object') return null;
	const grilla = raw as Partial<Grilla>;
	const name = grilla.name?.trim();

	if (!name) return null;

	const position = Math.max(1, toNumber(grilla.position, index + 1));

	return {
		id: toNumber(grilla.id, index + 1),
		proyect_id: toNumber(grilla.proyect_id),
		name,
		position,
		color: grilla.color ?? '#6366f1',
		tipo: grilla.tipo ?? inferGrillaTipo(name, position),
		created_at: grilla.created_at ?? now,
		updated_at: grilla.updated_at ?? now,
	};
};

const normalizeTarea = (
	raw: unknown,
	index: number,
	now: string
): Tarea | null => {
	if (!raw || typeof raw !== 'object') return null;
	const tarea = raw as Partial<Tarea>;
	const title = tarea.title?.trim();

	if (!title) return null;

	return {
		id: toNumber(tarea.id, index + 1),
		grilla_id: toNumber(tarea.grilla_id),
		title,
		description: tarea.description ?? '',
		position: Math.max(1, toNumber(tarea.position, index + 1)),
		assigned_to: toNumber(tarea.assigned_to, 1),
		start_date: formatDateOnly(tarea.start_date ?? '', formatDateOnly(now)),
		due_date: formatDateOnly(tarea.due_date ?? ''),
		priority:
			tarea.priority === 'Alta' ||
			tarea.priority === 'Media' ||
			tarea.priority === 'Baja'
				? tarea.priority
				: 'Media',
		created_by: toNumber(tarea.created_by, 1),
		created_at: tarea.created_at ?? now,
		updated_at: tarea.updated_at ?? now,
		history: Array.isArray(tarea.history) ? tarea.history : undefined,
	};
};

const reorderByPosition = <T extends { position: number }>(
	items: T[],
	update: (item: T, position: number) => T
) =>
	[...items]
		.sort((a, b) => a.position - b.position)
		.map((item, index) => update(item, index + 1));

const nextId = (items: { id: number }[]) =>
	items.length > 0 ? Math.max(...items.map((item) => item.id)) + 1 : 1;

const readLocalStorage = (key: string) => {
	try {
		return window.localStorage.getItem(key);
	} catch (error) {
		console.error(error);
		return null;
	}
};

const writeLocalStorage = (key: string, value: string) => {
	try {
		window.localStorage.setItem(key, value);
	} catch (error) {
		console.error(error);
	}
};

const parseJSON = <T>(value: string | null): T | null => {
	if (!value) return null;

	try {
		return JSON.parse(value) as T;
	} catch (error) {
		console.error(error);
		return null;
	}
};

const normalizeBoardSnapshot = (snapshot: Partial<BoardSnapshot>): BoardSnapshot => {
	const now = new Date().toISOString();
	const proyectos: Proyecto[] = [];
	for (const [index, proyecto] of (snapshot.proyectos ?? []).entries()) {
		const proyectoNormalizado = normalizeProyecto(proyecto, index, now);
		if (proyectoNormalizado) {
			proyectos.push(proyectoNormalizado);
		}
	}
	const proyectoIds = new Set(proyectos.map((proyecto) => proyecto.id));

	const grillasBase: Grilla[] = [];
	for (const [index, grilla] of (snapshot.grillas ?? []).entries()) {
		const grillaNormalizada = normalizeGrilla(grilla, index, now);
		if (grillaNormalizada && proyectoIds.has(grillaNormalizada.proyect_id)) {
			grillasBase.push(grillaNormalizada);
		}
	}

	const grillas = proyectos.flatMap((proyecto) => {
		const grillasDelProyecto = grillasBase.filter(
			(grilla) => grilla.proyect_id === proyecto.id
		);

		return reorderByPosition(grillasDelProyecto, (grilla, position) => ({
			...grilla,
			position,
		}));
	});
	const grillaIds = new Set(grillas.map((grilla) => grilla.id));

	const tareasBase: Tarea[] = [];
	for (const [index, tarea] of (snapshot.tareas ?? []).entries()) {
		const tareaNormalizada = normalizeTarea(tarea, index, now);
		if (tareaNormalizada && grillaIds.has(tareaNormalizada.grilla_id)) {
			tareasBase.push(tareaNormalizada);
		}
	}

	const tareas = grillas.flatMap((grilla) => {
		const tareasDeGrilla = tareasBase.filter(
			(tarea) => tarea.grilla_id === grilla.id
		);

		return reorderByPosition(tareasDeGrilla, (tarea, position) => ({
			...tarea,
			position,
		}));
	});

	const proyectoActivo = proyectoIds.has(snapshot.proyectoActivo ?? -1)
		? snapshot.proyectoActivo ?? null
		: proyectos[0]?.id ?? null;

	return {
		proyectos,
		proyectoActivo,
		grillas,
		tareas,
	};
};

const migrateLegacyBoard = (): BoardSnapshot => {
	const legacyProyectos =
		parseJSON<Proyecto[]>(readLocalStorage(STORAGE_KEYS.proyectos)) ?? proyectosDefault;
	const legacyGrillas =
		parseJSON<Grilla[]>(readLocalStorage(STORAGE_KEYS.grillas)) ?? grillasDefault;
	const legacyTareas =
		parseJSON<Tarea[]>(readLocalStorage(STORAGE_KEYS.tareas)) ?? tareasDefault;
	const legacyProyectoActivo =
		parseJSON<number | null>(readLocalStorage(STORAGE_KEYS.proyectoActivo)) ??
		legacyProyectos[0]?.id ??
		null;

	return normalizeBoardSnapshot({
		proyectos: legacyProyectos,
		proyectoActivo: legacyProyectoActivo,
		grillas: legacyGrillas,
		tareas: legacyTareas,
	});
};

const persistBoard = (snapshot: BoardSnapshot) => {
	const storedSnapshot: StoredBoardSnapshot = {
		schemaVersion: CURRENT_SCHEMA_VERSION,
		...snapshot,
	};

	writeLocalStorage(STORAGE_KEYS.board, JSON.stringify(storedSnapshot));
};

const loadBoard = () => {
	const storedBoard = parseJSON<StoredBoardSnapshot>(
		readLocalStorage(STORAGE_KEYS.board)
	);
	const snapshot =
		storedBoard?.schemaVersion === CURRENT_SCHEMA_VERSION
			? normalizeBoardSnapshot(storedBoard)
			: migrateLegacyBoard();

	persistBoard(snapshot);
	return snapshot;
};

const updateBoard = (updater: (snapshot: BoardSnapshot) => BoardSnapshot) => {
	const currentSnapshot = loadBoard();
	const nextSnapshot = normalizeBoardSnapshot(updater(currentSnapshot));

	persistBoard(nextSnapshot);
	return nextSnapshot;
};

export const localStorageBoardRepository: BoardRepository = {
	loadBoard,
	setProyectoActivo: (proyectoId) =>
		updateBoard((snapshot) => ({
			...snapshot,
			proyectoActivo: proyectoId,
		})),
	createProyecto: (proyecto) =>
		updateBoard((snapshot) => {
			const now = new Date().toISOString();
			const nuevoProyecto: Proyecto = {
				...proyecto,
				id: nextId(snapshot.proyectos),
				created_at: now,
				updated_at: now,
			};

			return {
				...snapshot,
				proyectos: [...snapshot.proyectos, nuevoProyecto],
				proyectoActivo: snapshot.proyectoActivo ?? nuevoProyecto.id,
			};
		}),
	createGrilla: (proyectoId, grilla) =>
		updateBoard((snapshot) => {
			const now = new Date().toISOString();
			const grillasDelProyecto = snapshot.grillas.filter(
				(item) => item.proyect_id === proyectoId
			);
			const nuevaGrilla: Grilla = {
				...grilla,
				id: nextId(snapshot.grillas),
				proyect_id: proyectoId,
				position: grillasDelProyecto.length + 1,
				created_at: now,
				updated_at: now,
			};

			return {
				...snapshot,
				grillas: [...snapshot.grillas, nuevaGrilla],
			};
		}),
	deleteGrilla: (grillaId) =>
		updateBoard((snapshot) => ({
			...snapshot,
			grillas: snapshot.grillas.filter((grilla) => grilla.id !== grillaId),
			tareas: snapshot.tareas.filter((tarea) => tarea.grilla_id !== grillaId),
		})),
	createTarea: (grillaId, tarea) =>
		updateBoard((snapshot) => {
			const now = new Date().toISOString();
			const tareasDeGrilla = snapshot.tareas.filter(
				(item) => item.grilla_id === grillaId
			);
			const nuevaTarea: Tarea = {
				...tarea,
				id: nextId(snapshot.tareas),
				grilla_id: grillaId,
				position: tareasDeGrilla.length + 1,
				start_date: formatDateOnly(tarea.start_date, formatDateOnly(now)),
				due_date: formatDateOnly(tarea.due_date),
				created_at: now,
				updated_at: now,
			};

			return {
				...snapshot,
				tareas: [...snapshot.tareas, nuevaTarea],
			};
		}),
	reorderGrillas: (proyectoId, grillas) =>
		updateBoard((snapshot) => {
			const now = new Date().toISOString();
			const grillasDeOtrosProyectos = snapshot.grillas.filter(
				(grilla) => grilla.proyect_id !== proyectoId
			);
			const grillasDelProyecto = grillas.map((grilla, index) => ({
				...grilla,
				proyect_id: proyectoId,
				position: index + 1,
				updated_at: now,
			}));

			return {
				...snapshot,
				grillas: [...grillasDeOtrosProyectos, ...grillasDelProyecto],
			};
		}),
	reorderTareas: (proyectoId, tareas) =>
		updateBoard((snapshot) => {
			const now = new Date().toISOString();
			const grillasDelProyecto = snapshot.grillas
				.filter((grilla) => grilla.proyect_id === proyectoId)
				.map((grilla) => grilla.id);
			const tareasDeOtrosProyectos = snapshot.tareas.filter(
				(tarea) => !grillasDelProyecto.includes(tarea.grilla_id)
			);
			const tareasDelProyecto = tareas.map((tarea) => ({
				...tarea,
				start_date: formatDateOnly(tarea.start_date, ''),
				due_date: formatDateOnly(tarea.due_date),
				updated_at: now,
			}));

			return {
				...snapshot,
				tareas: [...tareasDeOtrosProyectos, ...tareasDelProyecto],
			};
		}),
	moveTarea: (tareaId, targetGrillaId, targetPosition) =>
		updateBoard((snapshot) => {
			const tarea = snapshot.tareas.find((item) => item.id === tareaId);
			if (!tarea) return snapshot;

			const now = new Date().toISOString();
			const tareasSinActiva = snapshot.tareas.filter((item) => item.id !== tareaId);
			const tareasDestino = tareasSinActiva
				.filter((item) => item.grilla_id === targetGrillaId)
				.sort((a, b) => a.position - b.position);
			const insertIndex = Math.max(
				0,
				Math.min(targetPosition - 1, tareasDestino.length)
			);
			const tareaMovida = {
				...tarea,
				grilla_id: targetGrillaId,
				position: targetPosition,
				updated_at: now,
			};

			tareasDestino.splice(insertIndex, 0, tareaMovida);

			return {
				...snapshot,
				tareas: [
					...tareasSinActiva.filter((item) => item.grilla_id !== targetGrillaId),
					...tareasDestino,
				],
			};
		}),
};
