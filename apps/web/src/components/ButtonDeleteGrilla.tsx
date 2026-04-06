import type { Grilla } from "../types/models";
import { Trash2 } from "lucide-react";

export default function ButtonDeleteGrilla({ onDelete, grilla }: { onDelete: (id: number) => void, grilla: Grilla }) {
    return (
        <button 
            className="text-white/60 hover:text-red-300 hover:bg-red-500/20 text-xs px-2.5 py-1.5 rounded-lg transition-all duration-200 cursor-pointer flex items-center"
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (confirm(`¿Eliminar "${grilla.name}"?`)) {
                    onDelete?.(grilla.id);
                }
            }}
            onPointerDown={(e) => {
                e.stopPropagation();
                e.preventDefault();
            }}
            onMouseDown={(e) => {
                e.stopPropagation();
                e.preventDefault();
            }}
            onTouchStart={(e) => {
                e.stopPropagation();
                e.preventDefault();
            }}
            type="button"
            title="Eliminar grilla"
        >
            <Trash2 className="w-4 h-4" />
        </button>
    );
}