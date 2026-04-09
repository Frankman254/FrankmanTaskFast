import type { Grilla, Tarea } from '@frankman-task-fast/types';
import { CalendarRange, ChevronRight, Clock3 } from 'lucide-react';

interface TaskCalendarViewProps {
	tareas: Tarea[];
	grillas: Grilla[];
	onSelectTask: (tarea: Tarea) => void;
}

interface CalendarBucket {
	id: string;
	label: string;
	tasks: Tarea[];
}

const formatCalendarLabel = (value: string) => {
	const date = new Date(`${value}T00:00:00`);
	if (Number.isNaN(date.getTime())) {
		return value;
	}

	return new Intl.DateTimeFormat('es-PA', {
		weekday: 'short',
		day: '2-digit',
		month: 'short',
	}).format(date);
};

const buildCalendarBuckets = (tareas: Tarea[]): CalendarBucket[] => {
	const buckets = new Map<string, CalendarBucket>();

	for (const tarea of tareas) {
		const key = tarea.due_date || tarea.start_date || 'sin-fecha';
		const label =
			key === 'sin-fecha'
				? 'Sin fecha'
				: tarea.due_date
				? `Entrega ${formatCalendarLabel(key)}`
				: `Inicio ${formatCalendarLabel(key)}`;

		if (!buckets.has(key)) {
			buckets.set(key, {
				id: key,
				label,
				tasks: [],
			});
		}

		buckets.get(key)?.tasks.push(tarea);
	}

	return [...buckets.values()].sort((a, b) => {
		if (a.id === 'sin-fecha') return 1;
		if (b.id === 'sin-fecha') return -1;
		return a.id.localeCompare(b.id);
	});
};

export default function TaskCalendarView({
	tareas,
	grillas,
	onSelectTask,
}: TaskCalendarViewProps) {
	const buckets = buildCalendarBuckets(tareas);

	return (
		<div className="rounded-[28px] border border-white/10 bg-slate-950/55 backdrop-blur-xl p-4">
			<div className="flex items-center justify-between mb-4">
				<div>
					<p className="text-[10px] uppercase tracking-[0.35em] text-cyan-300/80 mb-2">
						Vista calendario
					</p>
					<h3 className="text-xl font-display font-bold text-white">
						Agenda visual de tareas
					</h3>
				</div>
				<div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300">
					<CalendarRange className="w-4 h-4 text-cyan-300" />
					{tareas.length} tareas
				</div>
			</div>

			{buckets.length > 0 ? (
				<div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
					{buckets.map((bucket) => (
						<section
							key={bucket.id}
							className="rounded-[24px] border border-white/10 bg-white/5 p-4"
						>
							<div className="flex items-center justify-between mb-4">
								<div>
									<p className="text-[10px] uppercase tracking-[0.25em] text-slate-400">
										Bloque
									</p>
									<h4 className="text-base font-semibold text-white mt-1">
										{bucket.label}
									</h4>
								</div>
								<span className="text-xs text-slate-400">
									{bucket.tasks.length} items
								</span>
							</div>

							<div className="space-y-3">
								{bucket.tasks.map((tarea) => {
									const grilla = grillas.find((item) => item.id === tarea.grilla_id);

									return (
										<button
											key={tarea.id}
											type="button"
											onClick={() => onSelectTask(tarea)}
											className="w-full text-left rounded-[22px] border border-white/10 bg-slate-900/80 hover:bg-slate-900 px-4 py-3 transition-colors"
										>
											<div className="flex items-start justify-between gap-3">
												<div>
													<p className="text-sm font-semibold text-white">
														{tarea.title}
													</p>
													<p className="text-xs text-slate-400 mt-1">
														{grilla?.name ?? 'Sin columna'}
													</p>
												</div>
												<ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
											</div>
											<div className="mt-3 flex items-center gap-2 flex-wrap">
												<span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 text-[11px] text-slate-300">
													<Clock3 className="w-3 h-3" />
													{tarea.due_date || tarea.start_date || 'Sin fecha'}
												</span>
												<span
													className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${
														tarea.priority === 'Alta'
															? 'bg-red-500/15 text-red-200'
															: tarea.priority === 'Media'
															? 'bg-amber-400/15 text-amber-100'
															: 'bg-emerald-500/15 text-emerald-100'
													}`}
												>
													{tarea.priority}
												</span>
											</div>
										</button>
									);
								})}
							</div>
						</section>
					))}
				</div>
			) : (
				<div className="rounded-[24px] border border-dashed border-white/10 bg-slate-950/30 p-10 text-center">
					<p className="text-white font-semibold">No hay tareas para mostrar en calendario.</p>
					<p className="text-sm text-slate-400 mt-2">
						Ajusta los filtros o crea tareas con fechas para poblar esta vista.
					</p>
				</div>
			)}
		</div>
	);
}
