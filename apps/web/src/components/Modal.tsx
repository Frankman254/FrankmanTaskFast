import { useEffect, useCallback } from 'react';

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
	const handleKeyDown = useCallback((e: KeyboardEvent) => {
		if (e.key === 'Escape') onClose();
	}, [onClose]);

	useEffect(() => {
		if (isOpen) {
			document.addEventListener('keydown', handleKeyDown);
			document.body.style.overflow = 'hidden';
		}
		return () => {
			document.removeEventListener('keydown', handleKeyDown);
			document.body.style.overflow = '';
		};
	}, [isOpen, handleKeyDown]);

	if (!isOpen) return null;

	return (
		<div 
			className="modal-overlay"
			onClick={(e) => {
				if (e.target === e.currentTarget) onClose();
			}}
		>
			<div className="modal-content animate-scaleIn">
				<div className="flex items-center justify-between mb-5">
					<h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
					<button
						onClick={onClose}
						className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
					>
						✕
					</button>
				</div>
				{children}
			</div>
		</div>
	);
}
