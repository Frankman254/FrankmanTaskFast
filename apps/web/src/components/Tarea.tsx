import type { Tarea } from "../types/models";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function Tarea({ tarea }: { tarea: Tarea }) {
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
            className="bg-white border-2 border-gray-300 rounded-lg p-3 mb-2 cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-shadow"
        >
            <h3 className="text-sm font-semibold text-gray-800 mb-1">{tarea.title}</h3>
            {tarea.description && (
                <p className="text-xs text-gray-600 mb-1 line-clamp-2">{tarea.description}</p>
            )}
            <div className="flex items-center justify-between mt-2">
                {tarea.priority && (
                    <span className={`text-xs px-2 py-1 rounded ${
                        tarea.priority === 'Alta' ? 'bg-red-100 text-red-700' :
                        tarea.priority === 'Media' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                    }`}>
                        {tarea.priority}
                    </span>
                )}
            </div>
        </div>
    );
}