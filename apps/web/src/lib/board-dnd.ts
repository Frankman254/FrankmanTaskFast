import type { Grilla, Tarea } from '@frankman-task-fast/types';

const moveItem = <T>(items: T[], fromIndex: number, toIndex: number) => {
	const nextItems = [...items];
	const [movedItem] = nextItems.splice(fromIndex, 1);

	if (!movedItem) {
		return items;
	}

	nextItems.splice(toIndex, 0, movedItem);
	return nextItems;
};

const sortByPosition = <T extends { position: number }>(items: T[]) =>
	[...items].sort((a, b) => a.position - b.position);

const normalizeTaskPositions = (tareas: Tarea[]) => {
	const grillaIds = [...new Set(tareas.map((tarea) => tarea.grilla_id))];

	return grillaIds.flatMap((grillaId) =>
		sortByPosition(tareas.filter((tarea) => tarea.grilla_id === grillaId)).map(
			(tarea, index) => ({
				...tarea,
				position: index + 1,
			})
		)
	);
};

export const reorderGrillas = (
	grillas: Grilla[],
	activeGrillaId: number,
	overGrillaId: number
) => {
	const orderedGrillas = sortByPosition(grillas);
	const oldIndex = orderedGrillas.findIndex((grilla) => grilla.id === activeGrillaId);
	const newIndex = orderedGrillas.findIndex((grilla) => grilla.id === overGrillaId);

	if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
		return null;
	}

	return moveItem(orderedGrillas, oldIndex, newIndex).map((grilla, index) => ({
		...grilla,
		position: index + 1,
	}));
};

export const moveTaskToGridEnd = (
	tareas: Tarea[],
	tareaId: number,
	targetGrillaId: number
) => {
	const tareaActiva = tareas.find((tarea) => tarea.id === tareaId);
	if (!tareaActiva) return null;
	if (tareaActiva.grilla_id === targetGrillaId) return null;

	const tareasSinActiva = tareas.filter((tarea) => tarea.id !== tareaId);
	const ultimaPosicionDestino =
		Math.max(
			0,
			...tareasSinActiva
				.filter((tarea) => tarea.grilla_id === targetGrillaId)
				.map((tarea) => tarea.position)
		) + 1;

	return normalizeTaskPositions([
		...tareasSinActiva,
		{
			...tareaActiva,
			grilla_id: targetGrillaId,
			position: ultimaPosicionDestino,
		},
	]);
};

export const moveTaskOverTask = (
	tareas: Tarea[],
	tareaId: number,
	overTareaId: number
) => {
	const tareaActiva = tareas.find((tarea) => tarea.id === tareaId);
	const tareaObjetivo = tareas.find((tarea) => tarea.id === overTareaId);

	if (!tareaActiva || !tareaObjetivo || tareaActiva.id === tareaObjetivo.id) {
		return null;
	}

	if (tareaActiva.grilla_id === tareaObjetivo.grilla_id) {
		const tareasEnGrilla = sortByPosition(
			tareas.filter((tarea) => tarea.grilla_id === tareaActiva.grilla_id)
		);
		const oldIndex = tareasEnGrilla.findIndex((tarea) => tarea.id === tareaId);
		const newIndex = tareasEnGrilla.findIndex((tarea) => tarea.id === overTareaId);

		if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
			return null;
		}

		const reorderedGridTasks = moveItem(tareasEnGrilla, oldIndex, newIndex).map(
			(tarea, index) => ({
				...tarea,
				position: index + 1,
			})
		);

		return [
			...tareas.filter((tarea) => tarea.grilla_id !== tareaActiva.grilla_id),
			...reorderedGridTasks,
		];
	}

	const sourceGridId = tareaActiva.grilla_id;
	const targetGridId = tareaObjetivo.grilla_id;
	const tareasOrigen = sortByPosition(
		tareas.filter((tarea) => tarea.grilla_id === sourceGridId && tarea.id !== tareaId)
	);
	const tareasDestino = sortByPosition(
		tareas.filter((tarea) => tarea.grilla_id === targetGridId && tarea.id !== tareaId)
	);
	const targetIndex = tareasDestino.findIndex((tarea) => tarea.id === overTareaId);
	const updatedTargetTasks = [...tareasDestino];

	updatedTargetTasks.splice(
		targetIndex === -1 ? updatedTargetTasks.length : targetIndex,
		0,
		{
			...tareaActiva,
			grilla_id: targetGridId,
			position: 0,
		}
	);

	return normalizeTaskPositions([
		...tareas.filter(
			(tarea) =>
				tarea.grilla_id !== sourceGridId && tarea.grilla_id !== targetGridId
		),
		...tareasOrigen,
		...updatedTargetTasks,
	]);
};
