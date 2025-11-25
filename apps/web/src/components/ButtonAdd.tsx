export default function ButtonAdd({ handleOpenModal, buttonText, colorButton, className = '' }: { handleOpenModal: () => void, buttonText: string, colorButton: string, className?: string }) {
    return (
        <button className={colorButton + " h-10 text-white px-4 py-2 rounded cursor-pointer " + className} onClick={handleOpenModal}>
            <span className="text-white text-sm font-semibold">{buttonText}</span>
        </button>
    );
}