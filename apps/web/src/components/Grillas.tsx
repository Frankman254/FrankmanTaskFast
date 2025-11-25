import type { Grilla } from "../types/models";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function Grillas({
	grilla,
	className = '',
}: {
	grilla: Grilla;
	className?: string;
}) {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: grilla.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			{...attributes}
			{...listeners}
			className={`w-[250px] flex-shrink-0 py-1 h-full cursor-grab active:cursor-grabbing ${className}`}
		>
			<div
				className="border-4 border-spacing-y-96 border-gray-300 rounded-lg h-full flex flex-col items-center justify-start p-4 relative"
				style={{ backgroundColor: grilla.color }}
			>
				<div className="flex flex-col items-center justify-center w-full">
					<h2 className="text-xl font-semibold text-gray-800 mb-2 text-center">
						{grilla.name}
					</h2>
					<div className="text-sm text-gray-600 space-y-1">
						<p>Posición: {grilla.position}</p>
						<p>ID: {grilla.id}</p>
						{grilla.proyect_id && <p>Proyecto: {grilla.proyect_id}</p>}
					</div>
				</div>

				<div className="absolute bottom-2 right-2">
					<button className="text-gray-600 hover:text-red-600 text-sm">Borrar</button>
				</div>
			</div>
		</div>
	);
}
