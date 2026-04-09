import { useCallback, useEffect } from "react";

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	children: React.ReactNode;
	showHeader?: boolean;
	contentClassName?: string;
	overlayClassName?: string;
}

export default function Modal({
	isOpen,
	onClose,
	title,
	children,
	showHeader = true,
	contentClassName = "",
	overlayClassName = "",
}: ModalProps) {
	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			if (event.key === "Escape") {
				onClose();
			}
		},
		[onClose]
	);

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		document.addEventListener("keydown", handleKeyDown);
		document.body.style.overflow = "hidden";

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
			document.body.style.overflow = "";
		};
	}, [handleKeyDown, isOpen]);

	if (!isOpen) return null;

	return (
		<div
			className={`modal-overlay ${overlayClassName}`.trim()}
			onClick={(event) => {
				if (event.target === event.currentTarget) {
					onClose();
				}
			}}
		>
			<div className={`modal-content animate-scaleIn ${contentClassName}`.trim()}>
				{showHeader && (
					<div className="mb-5 flex items-center justify-between">
						<h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
						<button
							type="button"
							onClick={onClose}
							className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-200"
						>
							<span className="sr-only">Cerrar modal</span>
							&times;
						</button>
					</div>
				)}
				{children}
			</div>
		</div>
	);
}
