import type { Grilla, Proyecto, Tarea } from "@frankman-task-fast/types";
import { ArrowUpRight, CheckCircle2, ClipboardList, Clock, PencilLine } from 'lucide-react';

interface ProjectDashboardProps {
	proyecto: Proyecto;
	grillas: Grilla[];
	tareas: Tarea[];
	onEditProyecto: () => void;
}

export default function ProjectDashboard({
	proyecto,
	grillas,
	tareas,
	onEditProyecto,
}: ProjectDashboardProps) {
	if (!proyecto || grillas.length === 0) return null;

	const totalTareas = tareas.length;
	const grillasCompletadasIds = grillas
		.filter((grilla) => grilla.tipo === 'done')
		.map((grilla) => grilla.id);
	const tareasCompletadas = tareas.filter((tarea) =>
		grillasCompletadasIds.includes(tarea.grilla_id)
	).length;
	const tareasPendientes = totalTareas - tareasCompletadas;
	const progreso =
		totalTareas > 0 ? Math.round((tareasCompletadas / totalTareas) * 100) : 0;

	return (
		<div className="mb-4 rounded-[28px] border border-white/10 bg-slate-950/70 shadow-[0_24px_80px_rgba(15,23,42,0.45)] backdrop-blur-xl overflow-hidden animate-fadeIn">
			<div className="px-5 py-4 border-b border-white/10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
				<div>
					<div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-cyan-300/80 mb-2">
						<ArrowUpRight className="w-3.5 h-3.5" />
						Resumen del proyecto
					</div>
					<h2 className="text-2xl font-extrabold text-white leading-tight">
						{proyecto.name}
					</h2>
					<p className="text-sm text-slate-400 mt-1">
						{proyecto.description || 'Tablero activo listo para organizar trabajo y fechas.'}
					</p>
				</div>

				<button
					type="button"
					onClick={onEditProyecto}
					className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-2.5 text-sm font-semibold text-slate-100 transition-colors"
				>
					<PencilLine className="w-4 h-4" />
					Editar proyecto
				</button>
			</div>

			<div className="px-5 py-4 flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
					<div className="rounded-2xl bg-blue-500/12 border border-blue-300/10 px-4 py-3">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-200 flex items-center justify-center">
								<ClipboardList className="w-4 h-4" />
							</div>
							<div>
								<p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Total tareas</p>
								<p className="text-xl font-extrabold text-white">{totalTareas}</p>
							</div>
						</div>
					</div>

					<div className="rounded-2xl bg-amber-500/12 border border-amber-300/10 px-4 py-3">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-100 flex items-center justify-center">
								<Clock className="w-4 h-4" />
							</div>
							<div>
								<p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Pendientes</p>
								<p className="text-xl font-extrabold text-white">{tareasPendientes}</p>
							</div>
						</div>
					</div>

					<div className="rounded-2xl bg-emerald-500/12 border border-emerald-300/10 px-4 py-3">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-100 flex items-center justify-center">
								<CheckCircle2 className="w-4 h-4" />
							</div>
							<div>
								<p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Completadas</p>
								<p className="text-xl font-extrabold text-white">{tareasCompletadas}</p>
							</div>
						</div>
					</div>
				</div>

				<div className="w-full xl:w-80 rounded-2xl border border-white/10 bg-white/5 p-4">
					<div className="flex justify-between items-center mb-2">
						<span className="text-xs font-semibold text-slate-300 uppercase tracking-[0.18em]">
							Progreso real
						</span>
						<span className="text-sm font-extrabold text-emerald-300">{progreso}%</span>
					</div>
					<div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
						<div
							className="bg-[linear-gradient(90deg,#22c55e,#67e8f9)] h-3 rounded-full transition-all duration-500 ease-out"
							style={{ width: `${progreso}%` }}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
