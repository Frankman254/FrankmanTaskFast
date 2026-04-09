import type { Grilla, Tarea, TipoGrilla } from "@frankman-task-fast/types";
import { useDroppable } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Check, PencilLine, X } from "lucide-react";
import type { SyntheticEvent } from "react";
import { useEffect, useState } from "react";

import ButtonAdd from "./ButtonAdd";
import ButtonDeleteGrilla from "./ButtonDeleteGrilla";
import TareaComponent from "./Tarea";

interface GrillasProps {
	grilla: Grilla;
	className?: string;
	onDelete: (id: number) => void;
	onSave: (
		grillaId: number,
		changes: Pick<Grilla, "name" | "color" | "tipo">
	) => void;
	handleOpenModal: () => void;
	tareas: Tarea[];
	onSelectTask: (tarea: Tarea) => void;
}

const tiposGrilla: { value: TipoGrilla; label: string }[] = [
	{ value: "todo", label: "Todo" },
	{ value: "doing", label: "Doing" },
	{ value: "done", label: "Done" },
	{ value: "custom", label: "Custom" },
];

export default function Grillas({
	grilla,
	className = "",
	onDelete,
	onSave,
	handleOpenModal,
	tareas,
	onSelectTask,
}: GrillasProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [draftName, setDraftName] = useState(grilla.name);
	const [draftTipo, setDraftTipo] = useState<TipoGrilla>(grilla.tipo);
	const [draftColor, setDraftColor] = useState(grilla.color);

	useEffect(() => {
		if (!isEditing) {
			setDraftName(grilla.name);
			setDraftTipo(grilla.tipo);
			setDraftColor(grilla.color);
		}
	}, [grilla.color, grilla.name, grilla.tipo, isEditing]);

	const {
		attributes,
		listeners,
		setNodeRef: setSortableRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: `grilla-${grilla.id}`,
		disabled: isEditing,
	});

	const { setNodeRef: setDroppableRef, isOver: isOverGrid } = useDroppable({
		id: `droppable-grilla-${grilla.id}`,
	});

	const { setNodeRef: setDroppableTareasRef, isOver: isOverTareas } = useDroppable({
		id: `droppable-tareas-grilla-${grilla.id}`,
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition: isDragging ? undefined : transition,
		opacity: isDragging ? 0.3 : 1,
		zIndex: isDragging ? 50 : 1,
	};

	const tareasDeEstaGrilla = tareas
		.filter((tarea) => tarea.grilla_id === grilla.id)
		.sort((a, b) => (a.position || 0) - (b.position || 0));

	const isDropTarget = isOverGrid || isOverTareas;
	const trimmedName = draftName.trim();
	const isSaveDisabled = trimmedName.length === 0;

	const stopColumnDrag = (event: SyntheticEvent) => {
		event.stopPropagation();
	};

	return (
		<div
			ref={(node) => {
				setSortableRef(node);
				setDroppableRef(node);
			}}
			style={style}
			{...attributes}
			{...listeners}
			className={`flex-1 min-w-[280px] max-w-[340px] min-h-[560px] py-1 ${
				isEditing ? "cursor-default" : "cursor-grab active:cursor-grabbing"
			} ${className}`}
		>
			<div
				className={`relative flex min-h-[560px] flex-col rounded-[26px] p-3.5 transition-all duration-200 ${
					isDropTarget
						? "scale-[1.01] ring-2 ring-cyan-300 ring-offset-2 dark:ring-offset-gray-950"
						: ""
				} ${isDragging ? "shadow-2xl" : "shadow-[0_20px_50px_rgba(15,23,42,0.35)]"}`}
				style={{ backgroundColor: grilla.color }}
			>
				<div
					className="mb-3 w-full pt-1"
					onClick={stopColumnDrag}
					onPointerDown={stopColumnDrag}
				>
					{!isEditing ? (
						<div className="flex items-start justify-between gap-3">
							<div>
								<p className="mb-1 text-[10px] uppercase tracking-[0.25em] text-white/60">
									{grilla.tipo}
								</p>
								<h2 className="mb-0.5 text-base font-bold text-white drop-shadow-sm">
									{grilla.name}
								</h2>
								<div className="text-xs font-medium text-white/70">
									{tareasDeEstaGrilla.length}{" "}
									{tareasDeEstaGrilla.length === 1 ? "tarea" : "tareas"}
								</div>
							</div>
							<button
								type="button"
								onClick={() => setIsEditing(true)}
								className="shrink-0 rounded-full bg-white/15 p-2 text-white transition-colors hover:bg-white/25"
								title="Editar grilla inline"
							>
								<PencilLine className="h-3.5 w-3.5" />
							</button>
						</div>
					) : (
						<div className="space-y-3 rounded-[22px] border border-white/20 bg-black/10 p-3 backdrop-blur-sm">
							<div className="flex items-start justify-between gap-3">
								<div className="flex-1">
									<p className="mb-2 text-[10px] uppercase tracking-[0.25em] text-white/70">
										Edicion rapida
									</p>
									<input
										type="text"
										value={draftName}
										onChange={(event) => setDraftName(event.target.value)}
										placeholder="Nombre de la grilla"
										className="w-full rounded-2xl border border-white/10 bg-white/90 px-3 py-2 text-sm font-semibold text-slate-900 outline-none transition-colors focus:border-cyan-400"
										autoFocus
									/>
								</div>
								<input
									type="color"
									value={draftColor}
									onChange={(event) => setDraftColor(event.target.value)}
									className="mt-5 h-10 w-10 cursor-pointer rounded-xl border border-white/20 bg-transparent"
									aria-label="Color de la grilla"
								/>
							</div>

							<div className="flex flex-wrap gap-2">
								{tiposGrilla.map((tipo) => (
									<button
										key={tipo.value}
										type="button"
										onClick={() => setDraftTipo(tipo.value)}
										className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors ${
											draftTipo === tipo.value
												? "border-white/40 bg-white/20 text-white"
												: "border-white/10 bg-white/[0.08] text-white/75 hover:bg-white/15"
										}`}
									>
										{tipo.label}
									</button>
								))}
							</div>

							<div className="flex gap-2">
								<button
									type="button"
									onClick={() => {
										if (isSaveDisabled) return;
										onSave(grilla.id, {
											name: trimmedName,
											color: draftColor,
											tipo: draftTipo,
										});
										setIsEditing(false);
									}}
									disabled={isSaveDisabled}
									className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/20 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/30 disabled:cursor-not-allowed disabled:opacity-60"
								>
									<Check className="h-3.5 w-3.5" />
									Guardar
								</button>
								<button
									type="button"
									onClick={() => {
										setDraftName(grilla.name);
										setDraftTipo(grilla.tipo);
										setDraftColor(grilla.color);
										setIsEditing(false);
									}}
									className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-black/10 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-black/20"
								>
									<X className="h-3.5 w-3.5" />
									Cancelar
								</button>
							</div>
						</div>
					)}
				</div>

				<div
					ref={setDroppableTareasRef}
					className={`flex-1 w-full overflow-y-auto overflow-x-hidden rounded-[18px] pr-1 transition-all duration-200 ${
						isOverTareas ? "bg-white/20 ring-2 ring-white/40 ring-inset" : ""
					} ${isOverGrid && !isOverTareas ? "bg-white/10" : ""}`}
					style={{
						maxHeight: "calc(100% - 104px)",
						minHeight: "140px",
					}}
					onPointerDown={(event) => {
						const target = event.target as HTMLElement;
						if (target.closest("[data-sortable-tarea]") || target.closest("button")) {
							event.stopPropagation();
						}
					}}
				>
					{tareasDeEstaGrilla.length > 0 ? (
						tareasDeEstaGrilla.map((tarea) => (
							<div key={tarea.id} data-sortable-tarea="true">
								<TareaComponent
									tarea={tarea}
									isDone={grilla.tipo === "done"}
									onSelect={onSelectTask}
								/>
							</div>
						))
					) : (
						<div
							className="flex h-full min-h-[140px] items-center justify-center rounded-[18px] border-2 border-dashed border-white/20 py-4 text-center text-xs text-white/60 transition-all duration-200"
						>
							{isDropTarget ? (
								<span className="animate-pulse text-sm font-semibold text-white">
									Suelta aqui
								</span>
							) : (
								<span>Sin tareas por ahora</span>
							)}
						</div>
					)}
				</div>

				<div
					className="mt-2 flex justify-end gap-2"
					onClick={stopColumnDrag}
					onPointerDown={stopColumnDrag}
					onMouseDown={stopColumnDrag}
					onTouchStart={stopColumnDrag}
					style={{ pointerEvents: "auto" }}
				>
					<ButtonAdd
						handleOpenModal={handleOpenModal}
						buttonText="+ Tarea"
						colorButton="bg-white/20 hover:bg-white/30"
						className="px-3 py-1.5 text-xs text-white"
					/>
					<ButtonDeleteGrilla onDelete={onDelete} grilla={grilla} />
				</div>
			</div>
		</div>
	);
}
