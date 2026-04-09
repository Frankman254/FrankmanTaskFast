import { useMemo, useState } from "react";
import type { Grilla, Proyecto, Tarea } from "@frankman-task-fast/types";
import { ClipboardList, Search, SlidersHorizontal, Sparkles } from "lucide-react";

import FormNewProyect from "./FormNewProyect";
import FormAddTarea from "./FormAddTarea";
import ButtonAdd from "./ButtonAdd";
import ProyectoTablero from "./ProyectoTablero";
import FormNewGrilla from "./FormNewGrilla";
import Modal from "./Modal";
import ProjectDashboard from "./ProjectDashboard";
import TaskInspector from "./TaskInspector";
import { useBoardState } from "@/hooks/useBoardState";

type TaskFilter = 'all' | 'overdue' | 'today' | 'high';

const matchesTaskFilter = (tarea: Tarea, filter: TaskFilter, grillas: Grilla[]) => {
	if (filter === 'all') return true;

	const today = new Date().toISOString().split('T')[0];
	const currentGrilla = grillas.find((grilla) => grilla.id === tarea.grilla_id);
	const isDone = currentGrilla?.tipo === 'done';

	if (filter === 'high') {
		return tarea.priority === 'Alta';
	}

	if (!tarea.due_date || isDone) {
		return false;
	}

	if (filter === 'overdue') {
		return tarea.due_date < today;
	}

	return tarea.due_date === today;
};

export default function BodyFull() {
	const [isModalOpenProyecto, setIsModalOpenProyecto] = useState(false);
	const [isModalOpenTarea, setIsModalOpenTarea] = useState(false);
	const [isModalOpenGrilla, setIsModalOpenGrilla] = useState(false);
	const [isModalOpenEditarProyecto, setIsModalOpenEditarProyecto] = useState(false);
	const [grillaSeleccionadaParaTarea, setGrillaSeleccionadaParaTarea] = useState<number | null>(null);
	const [grillaEnEdicion, setGrillaEnEdicion] = useState<Grilla | null>(null);
	const [tareaSeleccionada, setTareaSeleccionada] = useState<Tarea | null>(null);
	const [searchTerm, setSearchTerm] = useState('');
	const [taskFilter, setTaskFilter] = useState<TaskFilter>('all');
	const {
		proyectos,
		proyectoActivo,
		proyectoSeleccionado,
		grillasDelProyectoActivo,
		tareasDelProyectoActivo,
		selectProyecto,
		addProyecto,
		updateProyecto,
		addGrilla,
		updateGrilla,
		addTarea,
		updateTarea,
		deleteTarea,
		updateGrillas,
		updateTareas,
	} = useBoardState();

	const searchValue = searchTerm.trim().toLowerCase();
	const tareasFiltradas = useMemo(
		() =>
			tareasDelProyectoActivo.filter((tarea) => {
				const matchesSearch =
					searchValue.length === 0 ||
					tarea.title.toLowerCase().includes(searchValue) ||
					tarea.description.toLowerCase().includes(searchValue);

				return (
					matchesSearch &&
					matchesTaskFilter(tarea, taskFilter, grillasDelProyectoActivo)
				);
			}),
		[grillasDelProyectoActivo, searchValue, tareasDelProyectoActivo, taskFilter]
	);

	const selectedTaskGrilla = tareaSeleccionada
		? grillasDelProyectoActivo.find((grilla) => grilla.id === tareaSeleccionada.grilla_id)
		: undefined;

	const handleAddProyecto = (nuevoProyecto: Proyecto) => {
		addProyecto(nuevoProyecto);
		setIsModalOpenProyecto(false);
	};

	const handleUpdateProyecto = (proyecto: Proyecto) => {
		updateProyecto(proyecto.id, {
			name: proyecto.name,
			description: proyecto.description,
			color: proyecto.color,
			owner_id: proyecto.owner_id,
			is_archived: proyecto.is_archived,
		});
		setIsModalOpenEditarProyecto(false);
	};

	const handleUpdateGrillas = (proyectoId: number, nuevasGrillas: Grilla[]) => {
		updateGrillas(proyectoId, nuevasGrillas);
	};

	const handleUpdateTareas = (nuevasTareas: Tarea[]) => {
		if (!proyectoActivo) return;
		updateTareas(proyectoActivo, nuevasTareas);
	};

	const handleAddTarea = (nuevaTarea: Tarea) => {
		if (!grillaSeleccionadaParaTarea) return;

		addTarea(grillaSeleccionadaParaTarea, nuevaTarea);
		setIsModalOpenTarea(false);
		setGrillaSeleccionadaParaTarea(null);
	};

	const handleOpenModalTarea = (grillaId: number) => {
		setGrillaSeleccionadaParaTarea(grillaId);
		setIsModalOpenTarea(true);
	};

	const handleAddGrilla = (nuevaGrilla: Grilla) => {
		if (!proyectoActivo) return;

		addGrilla(proyectoActivo, nuevaGrilla);
		setIsModalOpenGrilla(false);
	};

	const handleEditGrilla = (grilla: Grilla) => {
		setGrillaEnEdicion(grilla);
		setIsModalOpenGrilla(true);
	};

	const handleSaveGrilla = (grilla: Grilla) => {
		if (grillaEnEdicion) {
			updateGrilla(grillaEnEdicion.id, {
				name: grilla.name,
				color: grilla.color,
				tipo: grilla.tipo,
			});
			setGrillaEnEdicion(null);
			setIsModalOpenGrilla(false);
			return;
		}

		handleAddGrilla(grilla);
	};

	const handleSelectTask = (tarea: Tarea) => {
		setTareaSeleccionada(tarea);
	};

	const handleUpdateTaskFromInspector = (tarea: Tarea) => {
		updateTarea(tarea.id, {
			title: tarea.title,
			description: tarea.description,
			start_date: tarea.start_date,
			due_date: tarea.due_date,
			priority: tarea.priority,
			assigned_to: tarea.assigned_to,
			created_by: tarea.created_by,
			history: tarea.history,
		});
		setTareaSeleccionada(tarea);
	};

	const handleDeleteTask = (tareaId: number) => {
		deleteTarea(tareaId);
		setTareaSeleccionada(null);
	};

	return (
		<div className="flex flex-col min-h-[calc(100vh-7rem)]">
			<div className="px-4 py-3 border-b border-white/10 bg-slate-950/60 backdrop-blur-xl overflow-x-auto">
				<div className="flex items-center gap-3 mb-3">
					<ButtonAdd
						handleOpenModal={() => setIsModalOpenProyecto(true)}
						buttonText="+ Proyecto"
					/>
					<div className="w-px h-7 bg-white/10 mx-1 shrink-0" />

					{proyectos.map((proyecto) => (
						<button
							key={proyecto.id}
							onClick={() => {
								selectProyecto(proyecto.id);
								setTareaSeleccionada(null);
							}}
							className={`px-4 py-2 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer border ${
								proyectoActivo === proyecto.id
									? 'text-white shadow-lg scale-[1.02] border-white/30'
									: 'text-slate-300 bg-white/5 border-white/10 hover:bg-white/10'
							}`}
							style={
								proyectoActivo === proyecto.id
									? {
											background: `linear-gradient(135deg, ${proyecto.color}, rgba(255,255,255,0.16))`,
									  }
									: undefined
							}
						>
							{proyecto.name}
						</button>
					))}
				</div>

				{proyectoSeleccionado && (
					<div className="flex flex-col xl:flex-row xl:items-center gap-3">
						<div className="relative flex-1 max-w-xl">
							<Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
							<input
								type="text"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								placeholder="Buscar por titulo o descripcion..."
								className="w-full rounded-2xl border border-white/10 bg-white/5 pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none focus:border-cyan-400/50"
							/>
						</div>

						<div className="flex items-center gap-2 flex-wrap">
							<div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-300">
								<SlidersHorizontal className="w-3.5 h-3.5" />
								Filtros
							</div>
							{([
								['all', 'Todo'],
								['overdue', 'Vencidas'],
								['today', 'Vence hoy'],
								['high', 'Alta prioridad'],
							] as const).map(([value, label]) => (
								<button
									key={value}
									type="button"
									onClick={() => setTaskFilter(value)}
									className={`px-3 py-2 rounded-2xl text-xs font-semibold border transition-colors ${
										taskFilter === value
											? 'bg-cyan-400/20 text-cyan-100 border-cyan-300/30'
											: 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
									}`}
								>
									{label}
								</button>
							))}
						</div>
					</div>
				)}
			</div>

			<div className="flex-1 overflow-visible px-4 py-4">
				{proyectoActivo && proyectoSeleccionado ? (
					<div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px] items-start">
						<div className="min-w-0 flex flex-col">
							<ProjectDashboard
								proyecto={proyectoSeleccionado}
								grillas={grillasDelProyectoActivo}
								tareas={tareasDelProyectoActivo}
								onEditProyecto={() => setIsModalOpenEditarProyecto(true)}
							/>
							<div className="mb-4 rounded-[24px] border border-white/10 bg-slate-950/60 backdrop-blur-xl px-4 py-3 flex items-center justify-between">
								<div className="flex items-center gap-3">
									<div className="w-10 h-10 rounded-2xl bg-cyan-400/15 text-cyan-200 flex items-center justify-center">
										<Sparkles className="w-4 h-4" />
									</div>
									<div>
										<p className="text-sm font-semibold text-white">
											{tareasFiltradas.length} tareas visibles
										</p>
										<p className="text-xs text-slate-400">
											{searchValue || taskFilter !== 'all'
												? 'Vista filtrada del tablero actual.'
												: 'Vista completa del tablero activo.'}
										</p>
									</div>
								</div>
								<div className="text-xs text-slate-400">
									{grillasDelProyectoActivo.length} grillas
								</div>
							</div>
							<ProyectoTablero
								proyecto={proyectoSeleccionado}
								grillas={grillasDelProyectoActivo}
								onUpdateGrillas={(nuevasGrillas) =>
									handleUpdateGrillas(proyectoActivo, nuevasGrillas)
								}
								className=""
								tareas={tareasFiltradas}
								onUpdateTareas={handleUpdateTareas}
								onOpenModalTarea={handleOpenModalTarea}
								onOpenModalGrilla={() => {
									setGrillaEnEdicion(null);
									setIsModalOpenGrilla(true);
								}}
								onEditGrilla={handleEditGrilla}
								onSelectTask={handleSelectTask}
							/>
						</div>

						<div className="hidden xl:block min-w-0 xl:sticky xl:top-24 self-start">
							{tareaSeleccionada ? (
								<TaskInspector
									tarea={tareaSeleccionada}
									grilla={selectedTaskGrilla}
									onClose={() => setTareaSeleccionada(null)}
									onSave={handleUpdateTaskFromInspector}
									onDelete={handleDeleteTask}
								/>
							) : (
								<div className="h-full rounded-[28px] border border-dashed border-white/10 bg-slate-950/30 backdrop-blur-xl flex items-center justify-center p-8 text-center">
									<div>
										<div className="w-14 h-14 rounded-3xl bg-cyan-400/10 text-cyan-200 flex items-center justify-center mx-auto mb-4">
											<ClipboardList className="w-6 h-6" />
										</div>
										<p className="text-white font-semibold mb-2">
											Selecciona una tarea
										</p>
										<p className="text-sm text-slate-400">
											Aqui veras fechas, descripcion y acciones rapidas para editarla.
										</p>
									</div>
								</div>
							)}
						</div>
					</div>
				) : (
					<div className="flex items-center justify-center h-full flex-1">
						<div className="text-center animate-fadeIn">
							<div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
								<ClipboardList className="w-8 h-8 text-white" />
							</div>
							<p className="text-gray-500 dark:text-gray-400 text-lg mb-4 font-medium">
								{proyectos.length === 0
									? "No hay proyectos. Crea uno para comenzar."
									: "Selecciona un proyecto para ver su tablero."}
							</p>
							{proyectos.length === 0 && (
								<ButtonAdd
									handleOpenModal={() => setIsModalOpenProyecto(true)}
									buttonText="Crear Primer Proyecto"
								/>
							)}
						</div>
					</div>
				)}
			</div>

			<Modal
				isOpen={isModalOpenProyecto}
				onClose={() => setIsModalOpenProyecto(false)}
				title="Nuevo Proyecto"
			>
				<FormNewProyect
					onAdd={handleAddProyecto}
					onClose={() => setIsModalOpenProyecto(false)}
				/>
			</Modal>

			<Modal
				isOpen={isModalOpenEditarProyecto}
				onClose={() => setIsModalOpenEditarProyecto(false)}
				title="Editar Proyecto"
			>
				<FormNewProyect
					initialValue={proyectoSeleccionado}
					submitLabel="Guardar cambios"
					onAdd={handleUpdateProyecto}
					onClose={() => setIsModalOpenEditarProyecto(false)}
				/>
			</Modal>

			<Modal
				isOpen={isModalOpenGrilla}
				onClose={() => {
					setIsModalOpenGrilla(false);
					setGrillaEnEdicion(null);
				}}
				title={grillaEnEdicion ? "Editar Grilla" : "Nueva Grilla"}
			>
				<FormNewGrilla
					initialValue={grillaEnEdicion}
					submitLabel={grillaEnEdicion ? "Guardar cambios" : "Crear Grilla"}
					onAdd={handleSaveGrilla}
					onClose={() => {
						setIsModalOpenGrilla(false);
						setGrillaEnEdicion(null);
					}}
				/>
			</Modal>

			<Modal
				isOpen={isModalOpenTarea}
				onClose={() => {
					setIsModalOpenTarea(false);
					setGrillaSeleccionadaParaTarea(null);
				}}
				title="Nueva Tarea"
			>
				<FormAddTarea
					onAdd={handleAddTarea}
					onClose={() => {
						setIsModalOpenTarea(false);
						setGrillaSeleccionadaParaTarea(null);
					}}
				/>
			</Modal>
		</div>
	);
}
