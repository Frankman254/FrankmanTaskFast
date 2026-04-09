import { useMemo, useState } from "react";
import type { Grilla, Proyecto, Tarea, TipoGrilla } from "@frankman-task-fast/types";
import {
	CalendarRange,
	ClipboardList,
	LayoutPanelTop,
	Search,
	SlidersHorizontal,
	Sparkles,
	X,
} from "lucide-react";

import ButtonAdd from "./ButtonAdd";
import FormAddTarea from "./FormAddTarea";
import FormNewGrilla from "./FormNewGrilla";
import FormNewProyect from "./FormNewProyect";
import Modal from "./Modal";
import ProjectDashboard from "./ProjectDashboard";
import ProyectoTablero from "./ProyectoTablero";
import TaskCalendarView from "./TaskCalendarView";
import TaskInspector from "./TaskInspector";
import { useBoardState } from "@/hooks/useBoardState";
import { useMediaQuery } from "@/hooks/use-media-query";

type TaskFilter = "all" | "overdue" | "today" | "high";
type BoardView = "board" | "calendar";
type ColumnFilter = "all" | number;
type TipoFilter = "all" | TipoGrilla;

const matchesTaskFilter = (tarea: Tarea, filter: TaskFilter, grillas: Grilla[]) => {
	if (filter === "all") return true;

	const today = new Date().toISOString().split("T")[0];
	const currentGrilla = grillas.find((grilla) => grilla.id === tarea.grilla_id);
	const isDone = currentGrilla?.tipo === "done";

	if (filter === "high") {
		return tarea.priority === "Alta";
	}

	if (!tarea.due_date || isDone) {
		return false;
	}

	if (filter === "overdue") {
		return tarea.due_date < today;
	}

	return tarea.due_date === today;
};

const tipoLabels: Record<TipoGrilla, string> = {
	todo: "Todo",
	doing: "Doing",
	done: "Done",
	custom: "Custom",
};

export default function BodyFull() {
	const isDesktop = useMediaQuery("(min-width: 1280px)");
	const [isModalOpenProyecto, setIsModalOpenProyecto] = useState(false);
	const [isModalOpenTarea, setIsModalOpenTarea] = useState(false);
	const [isModalOpenGrilla, setIsModalOpenGrilla] = useState(false);
	const [isModalOpenEditarProyecto, setIsModalOpenEditarProyecto] = useState(false);
	const [grillaSeleccionadaParaTarea, setGrillaSeleccionadaParaTarea] = useState<number | null>(null);
	const [tareaSeleccionada, setTareaSeleccionada] = useState<Tarea | null>(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [taskFilter, setTaskFilter] = useState<TaskFilter>("all");
	const [boardView, setBoardView] = useState<BoardView>("board");
	const [columnFilterId, setColumnFilterId] = useState<ColumnFilter>("all");
	const [grillaTipoFilter, setGrillaTipoFilter] = useState<TipoFilter>("all");
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
		deleteGrilla,
		addTarea,
		updateTarea,
		deleteTarea,
		updateGrillas,
		updateTareas,
	} = useBoardState();

	const searchValue = searchTerm.trim().toLowerCase();
	const tiposDisponibles = useMemo(
		() => [...new Set(grillasDelProyectoActivo.map((grilla) => grilla.tipo))],
		[grillasDelProyectoActivo]
	);

	const tareasFiltradas = useMemo(
		() =>
			tareasDelProyectoActivo.filter((tarea) => {
				const currentGrilla = grillasDelProyectoActivo.find(
					(grilla) => grilla.id === tarea.grilla_id
				);
				const matchesSearch =
					searchValue.length === 0 ||
					tarea.title.toLowerCase().includes(searchValue) ||
					tarea.description.toLowerCase().includes(searchValue);
				const matchesColumn =
					columnFilterId === "all" || tarea.grilla_id === columnFilterId;
				const matchesTipo =
					grillaTipoFilter === "all" || currentGrilla?.tipo === grillaTipoFilter;

				return (
					matchesSearch &&
					matchesColumn &&
					matchesTipo &&
					matchesTaskFilter(tarea, taskFilter, grillasDelProyectoActivo)
				);
			}),
		[
			columnFilterId,
			grillaTipoFilter,
			grillasDelProyectoActivo,
			searchValue,
			tareasDelProyectoActivo,
			taskFilter,
		]
	);

	const selectedTaskGrilla = tareaSeleccionada
		? grillasDelProyectoActivo.find((grilla) => grilla.id === tareaSeleccionada.grilla_id)
		: undefined;

	const hasActiveTaskFilters =
		taskFilter !== "all" ||
		columnFilterId !== "all" ||
		grillaTipoFilter !== "all" ||
		searchValue.length > 0;

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

	const resetFilters = () => {
		setSearchTerm("");
		setTaskFilter("all");
		setColumnFilterId("all");
		setGrillaTipoFilter("all");
	};

	const projectInfoCaption = hasActiveTaskFilters
		? "Vista refinada por filtros, columna o tipo."
		: "Vista completa del tablero activo.";

	return (
		<div className="flex min-h-[calc(100vh-7rem)] flex-col">
			<div className="overflow-x-auto border-b border-white/10 bg-slate-950/60 px-4 py-3 backdrop-blur-xl">
				<div className="mb-3 flex items-center gap-3">
					<ButtonAdd
						handleOpenModal={() => setIsModalOpenProyecto(true)}
						buttonText="+ Proyecto"
					/>
					<div className="mx-1 h-7 w-px shrink-0 bg-white/10" />

					{proyectos.map((proyecto) => (
						<button
							key={proyecto.id}
							onClick={() => {
								selectProyecto(proyecto.id);
								setTareaSeleccionada(null);
							}}
							className={`whitespace-nowrap rounded-2xl border px-4 py-2 text-sm font-semibold transition-all duration-200 cursor-pointer ${
								proyectoActivo === proyecto.id
									? "scale-[1.02] border-white/30 text-white shadow-lg"
									: "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
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
					<div className="flex flex-col gap-3">
						<div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
							<div className="relative flex-1 max-w-xl">
								<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
								<input
									type="text"
									value={searchTerm}
									onChange={(event) => setSearchTerm(event.target.value)}
									placeholder="Buscar por titulo o descripcion..."
									className="w-full rounded-2xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-400/50"
								/>
							</div>

							<div className="flex items-center gap-2 flex-wrap">
								<div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-300">
									<LayoutPanelTop className="h-3.5 w-3.5" />
									Vista
								</div>
								{([
									["board", "Tablero", LayoutPanelTop],
									["calendar", "Calendario", CalendarRange],
								] as const).map(([value, label, Icon]) => (
									<button
										key={value}
										type="button"
										onClick={() => setBoardView(value)}
										className={`inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-xs font-semibold transition-colors ${
											boardView === value
												? "border-cyan-300/30 bg-cyan-400/20 text-cyan-100"
												: "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
										}`}
									>
										<Icon className="h-3.5 w-3.5" />
										{label}
									</button>
								))}
							</div>
						</div>

						<div className="flex flex-col gap-3 rounded-[24px] border border-white/10 bg-slate-950/35 px-3 py-3">
							<div className="flex flex-wrap items-center gap-2">
								<div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-300">
									<SlidersHorizontal className="h-3.5 w-3.5" />
									Estado
								</div>
								{([
									["all", "Todo"],
									["overdue", "Vencidas"],
									["today", "Vence hoy"],
									["high", "Alta prioridad"],
								] as const).map(([value, label]) => (
									<button
										key={value}
										type="button"
										onClick={() => setTaskFilter(value)}
										className={`rounded-2xl border px-3 py-2 text-xs font-semibold transition-colors ${
											taskFilter === value
												? "border-cyan-300/30 bg-cyan-400/20 text-cyan-100"
												: "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
										}`}
									>
										{label}
									</button>
								))}
							</div>

							<div className="flex flex-wrap items-center gap-2">
								<div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-300">
									<Sparkles className="h-3.5 w-3.5" />
									Columna
								</div>
								<button
									type="button"
									onClick={() => setColumnFilterId("all")}
									className={`rounded-2xl border px-3 py-2 text-xs font-semibold transition-colors ${
										columnFilterId === "all"
											? "border-cyan-300/30 bg-cyan-400/20 text-cyan-100"
											: "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
									}`}
								>
									Todas
								</button>
								{grillasDelProyectoActivo.map((grilla) => (
									<button
										key={grilla.id}
										type="button"
										onClick={() => setColumnFilterId(grilla.id)}
										className={`rounded-2xl border px-3 py-2 text-xs font-semibold transition-colors ${
											columnFilterId === grilla.id
												? "border-white/40 text-white"
												: "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
										}`}
										style={
											columnFilterId === grilla.id
												? { backgroundColor: `${grilla.color}55` }
												: undefined
										}
									>
										{grilla.name}
									</button>
								))}
							</div>

							<div className="flex flex-wrap items-center gap-2">
								<div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-300">
									<ClipboardList className="h-3.5 w-3.5" />
									Tipo
								</div>
								<button
									type="button"
									onClick={() => setGrillaTipoFilter("all")}
									className={`rounded-2xl border px-3 py-2 text-xs font-semibold transition-colors ${
										grillaTipoFilter === "all"
											? "border-cyan-300/30 bg-cyan-400/20 text-cyan-100"
											: "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
									}`}
								>
									Todos
								</button>
								{tiposDisponibles.map((tipo) => (
									<button
										key={tipo}
										type="button"
										onClick={() => setGrillaTipoFilter(tipo)}
										className={`rounded-2xl border px-3 py-2 text-xs font-semibold uppercase transition-colors ${
											grillaTipoFilter === tipo
												? "border-cyan-300/30 bg-cyan-400/20 text-cyan-100"
												: "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
										}`}
									>
										{tipoLabels[tipo]}
									</button>
								))}

								{hasActiveTaskFilters && (
									<button
										type="button"
										onClick={resetFilters}
										className="ml-auto inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-300 transition-colors hover:bg-white/10"
									>
										<X className="h-3.5 w-3.5" />
										Limpiar
									</button>
								)}
							</div>
						</div>
					</div>
				)}
			</div>

			<div className="flex-1 overflow-visible px-4 py-4">
				{proyectoActivo && proyectoSeleccionado ? (
					<div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
						<div className="flex min-w-0 flex-col">
							<ProjectDashboard
								proyecto={proyectoSeleccionado}
								grillas={grillasDelProyectoActivo}
								tareas={tareasDelProyectoActivo}
								onEditProyecto={() => setIsModalOpenEditarProyecto(true)}
							/>

							<div className="mb-4 flex items-center justify-between rounded-[24px] border border-white/10 bg-slate-950/60 px-4 py-3 backdrop-blur-xl">
								<div className="flex items-center gap-3">
									<div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-400/15 text-cyan-200">
										<Sparkles className="h-4 w-4" />
									</div>
									<div>
										<p className="text-sm font-semibold text-white">
											{tareasFiltradas.length} tareas visibles
										</p>
										<p className="text-xs text-slate-400">{projectInfoCaption}</p>
									</div>
								</div>
								<div className="text-xs text-slate-400">
									{grillasDelProyectoActivo.length} grillas
								</div>
							</div>

							{boardView === "board" ? (
								<ProyectoTablero
									proyecto={proyectoSeleccionado}
									grillas={grillasDelProyectoActivo}
									onUpdateGrillas={(nuevasGrillas) =>
										handleUpdateGrillas(proyectoActivo, nuevasGrillas)
									}
									onUpdateGrilla={(grillaId, changes) =>
										updateGrilla(grillaId, changes)
									}
									onDeleteGrilla={(grillaId) => {
										deleteGrilla(grillaId);
										if (
											tareaSeleccionada &&
											tareaSeleccionada.grilla_id === grillaId
										) {
											setTareaSeleccionada(null);
										}
									}}
									tareas={tareasFiltradas}
									onUpdateTareas={handleUpdateTareas}
									onOpenModalTarea={handleOpenModalTarea}
									onOpenModalGrilla={() => setIsModalOpenGrilla(true)}
									onSelectTask={handleSelectTask}
								/>
							) : (
								<TaskCalendarView
									tareas={tareasFiltradas}
									grillas={grillasDelProyectoActivo}
									onSelectTask={handleSelectTask}
								/>
							)}
						</div>

						<div className="hidden min-w-0 self-start xl:sticky xl:top-24 xl:block">
							{tareaSeleccionada ? (
								<TaskInspector
									tarea={tareaSeleccionada}
									grilla={selectedTaskGrilla}
									onClose={() => setTareaSeleccionada(null)}
									onSave={handleUpdateTaskFromInspector}
									onDelete={handleDeleteTask}
								/>
							) : (
								<div className="flex h-full items-center justify-center rounded-[28px] border border-dashed border-white/10 bg-slate-950/30 p-8 text-center backdrop-blur-xl">
									<div>
										<div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-cyan-400/10 text-cyan-200">
											<ClipboardList className="h-6 w-6" />
										</div>
										<p className="mb-2 font-semibold text-white">Selecciona una tarea</p>
										<p className="text-sm text-slate-400">
											Aqui veras fechas, descripcion y acciones rapidas para editarla.
										</p>
									</div>
								</div>
							)}
						</div>
					</div>
				) : (
					<div className="flex h-full flex-1 items-center justify-center">
						<div className="animate-fadeIn text-center">
							<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg">
								<ClipboardList className="h-8 w-8 text-white" />
							</div>
							<p className="mb-4 text-lg font-medium text-gray-500 dark:text-gray-400">
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
				onClose={() => setIsModalOpenGrilla(false)}
				title="Nueva Grilla"
			>
				<FormNewGrilla
					submitLabel="Crear Grilla"
					onAdd={handleAddGrilla}
					onClose={() => setIsModalOpenGrilla(false)}
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

			<Modal
				isOpen={!isDesktop && Boolean(tareaSeleccionada)}
				onClose={() => setTareaSeleccionada(null)}
				title={tareaSeleccionada?.title ?? "Detalle de tarea"}
				showHeader={false}
				overlayClassName="items-end px-2 pb-2 pt-12 md:items-center md:px-6 md:pb-6"
				contentClassName="w-full max-w-3xl border-0 bg-transparent p-0 shadow-none"
			>
				{tareaSeleccionada && (
					<div className="h-[88vh] overflow-hidden rounded-[28px]">
						<TaskInspector
							tarea={tareaSeleccionada}
							grilla={selectedTaskGrilla}
							onClose={() => setTareaSeleccionada(null)}
							onSave={handleUpdateTaskFromInspector}
							onDelete={handleDeleteTask}
						/>
					</div>
				)}
			</Modal>
		</div>
	);
}
