import { useState } from 'react';

import type { Grilla, Proyecto, Tarea } from '@frankman-task-fast/types';

import {
	localStorageBoardRepository,
	type BoardSnapshot,
} from '@/lib/board-repository';

export const useBoardState = () => {
	const [board, setBoard] = useState<BoardSnapshot>(() =>
		localStorageBoardRepository.loadBoard()
	);

	const { proyectos, proyectoActivo, grillas, tareas } = board;
	const grillasDelProyectoActivo = grillas.filter(
		(grilla) => grilla.proyect_id === proyectoActivo
	);
	const proyectoSeleccionado =
		proyectos.find((proyecto) => proyecto.id === proyectoActivo) ?? null;
	const grillasIdsDelProyecto = grillasDelProyectoActivo.map((grilla) => grilla.id);
	const tareasDelProyectoActivo = tareas.filter((tarea) =>
		grillasIdsDelProyecto.includes(tarea.grilla_id)
	);

	const selectProyecto = (proyectoId: number | null) => {
		setBoard(localStorageBoardRepository.setProyectoActivo(proyectoId));
	};

	const addProyecto = (proyecto: Proyecto) => {
		setBoard(
			localStorageBoardRepository.createProyecto({
				name: proyecto.name,
				description: proyecto.description,
				owner_id: proyecto.owner_id,
				color: proyecto.color,
				is_archived: proyecto.is_archived,
			})
		);
	};

	const addGrilla = (proyectoId: number, grilla: Grilla) => {
		setBoard(
			localStorageBoardRepository.createGrilla(proyectoId, {
				name: grilla.name,
				color: grilla.color,
				tipo: grilla.tipo,
			})
		);
	};

	const addTarea = (grillaId: number, tarea: Tarea) => {
		setBoard(
			localStorageBoardRepository.createTarea(grillaId, {
				title: tarea.title,
				description: tarea.description,
				assigned_to: tarea.assigned_to,
				start_date: tarea.start_date,
				due_date: tarea.due_date,
				priority: tarea.priority,
				created_by: tarea.created_by,
				history: tarea.history,
			})
		);
	};

	const updateGrillas = (proyectoId: number, nuevasGrillas: Grilla[]) => {
		setBoard(localStorageBoardRepository.reorderGrillas(proyectoId, nuevasGrillas));
	};

	const updateTareas = (proyectoId: number, nuevasTareas: Tarea[]) => {
		setBoard(localStorageBoardRepository.reorderTareas(proyectoId, nuevasTareas));
	};

	const getNextGrillaId = () => {
		if (grillas.length === 0) return 1;
		return Math.max(...grillas.map((grilla) => grilla.id)) + 1;
	};

	const getNextTareaId = () => {
		if (tareas.length === 0) return 1;
		return Math.max(...tareas.map((tarea) => tarea.id)) + 1;
	};

	return {
		proyectos,
		proyectoActivo,
		proyectoSeleccionado,
		grillasDelProyectoActivo,
		tareasDelProyectoActivo,
		selectProyecto,
		addProyecto,
		addGrilla,
		addTarea,
		updateGrillas,
		updateTareas,
		getNextGrillaId,
		getNextTareaId,
	};
};
