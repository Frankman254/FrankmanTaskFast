import type { Grilla, Tarea, Proyecto } from "../types/models";
import { CheckCircle2, ClipboardList, Clock } from 'lucide-react';

interface ProjectDashboardProps {
    proyecto: Proyecto;
    grillas: Grilla[];
    tareas: Tarea[];
}

export default function ProjectDashboard({ proyecto, grillas, tareas }: ProjectDashboardProps) {
    if (!proyecto || grillas.length === 0) return null;

    // Calculamos estadísticas básicas
    const totalTareas = tareas.length;
    
    // Asumimos que la última grilla suele ser "Completadas" o su ID más alto.
    // También podemos buscar si hay una que se llama "Completado" explícitamente.
    const grillaCompletadas = grillas.find(g => g.name.toLowerCase().includes('completad')) || grillas[grillas.length - 1];
    
    const tareasCompletadas = tareas.filter(t => t.grilla_id === grillaCompletadas?.id).length;
    const tareasPendientes = totalTareas - tareasCompletadas;

    const progreso = totalTareas > 0 ? Math.round((tareasCompletadas / totalTareas) * 100) : 0;

    return (
        <div className="mb-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm animate-fadeIn">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                
                {/* Stats left side */}
                <div className="flex flex-wrap gap-4 sm:gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                            <ClipboardList className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Total Tareas</p>
                            <p className="text-sm font-bold text-gray-900 dark:text-white">{totalTareas}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                            <Clock className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Pendientes</p>
                            <p className="text-sm font-bold text-gray-900 dark:text-white">{tareasPendientes}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Completadas</p>
                            <p className="text-sm font-bold text-gray-900 dark:text-white">{tareasCompletadas}</p>
                        </div>
                    </div>
                </div>

                {/* Progress bar right side */}
                <div className="w-full sm:w-64">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Progreso</span>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{progreso}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                            className="bg-emerald-500 h-2 rounded-full transition-all duration-500 ease-out" 
                            style={{ width: `${progreso}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
