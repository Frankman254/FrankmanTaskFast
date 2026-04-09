import { Plus } from "lucide-react";

interface ButtonAddProps {
    handleOpenModal: () => void;
    buttonText: string;
    colorButton?: string;
    className?: string;
}

export default function ButtonAdd({ handleOpenModal, buttonText, colorButton = 'bg-emerald-500 hover:bg-emerald-600', className = '' }: ButtonAddProps) {
    return (
        <button
            className={`${colorButton} h-10 text-white px-4 py-1.5 rounded-2xl cursor-pointer transition-all duration-200 hover:shadow-[0_12px_30px_rgba(16,185,129,0.22)] active:scale-95 flex items-center gap-2 font-display ${className}`}
            onClick={handleOpenModal}
        >
            <Plus className="w-4 h-4 opacity-80" />
            <span className="text-white text-xs font-semibold tracking-wide">{buttonText.replace('+', '').trim()}</span>
        </button>
    );
}
