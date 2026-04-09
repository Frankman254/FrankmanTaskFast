import type { Tarea } from "@frankman-task-fast/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function TareaComponent({ tarea }: { tarea: Tarea }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
        useSortable({ id: `tarea-${tarea.id}` });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 mb-2 cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 ${
                isDragging ? 'shadow-xl ring-2 ring-blue-400' : ''
            }`}
        >
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">{tarea.title}</h3>
            {tarea.description && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 line-clamp-2">{tarea.description}</p>
            )}
            <div className="flex items-center justify-between">
                {tarea.priority && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        tarea.priority === 'Alta' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                        tarea.priority === 'Media' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                        'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                    }`}>
                        {tarea.priority}
                    </span>
                )}
            </div>
        </div>
    );
}
