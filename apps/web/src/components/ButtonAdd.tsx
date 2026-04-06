interface ButtonAddProps {
    handleOpenModal: () => void;
    buttonText: string;
    colorButton?: string;
    className?: string;
}

export default function ButtonAdd({ handleOpenModal, buttonText, colorButton = 'bg-emerald-500 hover:bg-emerald-600', className = '' }: ButtonAddProps) {
    return (
        <button
            className={`${colorButton} h-9 text-white px-3 py-1.5 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md active:scale-95 ${className}`}
            onClick={handleOpenModal}
        >
            <span className="text-white text-xs font-semibold">{buttonText}</span>
        </button>
    );
}