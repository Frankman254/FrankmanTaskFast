import type { Grilla } from "../types/models";

export default function ButtonDeleteGrilla({ onDelete, grilla }: { onDelete: (id: number) => void, grilla: Grilla }) {
    return (
        <button 
            className="text-white/60 hover:text-red-300 hover:bg-red-500/20 text-xs px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer"
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
            🗑️
        </button>
    );
}