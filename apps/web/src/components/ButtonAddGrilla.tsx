export default function ButtonAddGrilla({ handleOpenModal, buttonText, colorButton }: { handleOpenModal: () => void, buttonText: string, colorButton: string }) {
    return (
        <>
            <button className={colorButton + " h-10 text-white px-4 py-2 rounded"} onClick={handleOpenModal}>
                {buttonText}
            </button>
        </>
    );
}