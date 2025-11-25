import ButtonAddGrilla from "./ButtonAddGrilla";
import FormNewGrilla from "./FormNewGrilla";
import { useState } from "react";
import RightBar from "./RightBar";
import Grillas from "./Grillas";
import { SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import { DndContext, closestCenter } from "@dnd-kit/core";
import type { Grilla } from "../types/models";
import type { DragEndEvent } from "@dnd-kit/core";
import type { Proyecto } from "../types/models";
import FormNewProyect from "./FormNewProyect";
interface BodyFullProps {
    className?: string;
}

export default function BodyFull({ className = '' }: BodyFullProps) {

    const [isModalOpen, setIsModalOpen] = useState(false); // mostrar o no el modal
    const handleOpenModalGrilla = () => {
        setIsModalOpen(!isModalOpen);
    };
    const handleOpenModalProyecto = () => {
        setIsModalOpenProyecto(!isModalOpenProyecto);
    };
    const [isModalOpenProyecto, setIsModalOpenProyecto] = useState(false); // mostrar o no el modal
    const [proyectos, setProyectos] = useState<Proyecto[]>([]);
    const [grillas, setGrillas] = useState<Grilla[]>([
        {
            id: 1,
            name: 'Grilla 1',
            position: 1,
            color: '#25dc1cff',
        },

        {
            id: 2,
            name: 'Grilla 2',
            position: 2,
            color: '#cd0606ff',
        },
        {
            id: 3,
            name: 'Grilla 3',
            position: 3,
            color: '#e4f009ff',
        },
        {
            id: 4,
            name: 'Grilla 4',
            position: 4,
            color: '#000000',
        },
        {
            id: 5,
            name: 'Grilla 5',
            position: 5,
            color: '#000000',
        },
        {
            id: 6,
            name: 'Grilla 6',
            position: 6,
            color: '#000000',
        },
        {
            id: 7,
            name: 'Grilla 7',
            position: 7,
            color: '#000000',
        },
        {
            id: 8,
            name: 'Grilla 8',
            position: 8,
            color: '#000000',
        },
        {
            id: 9,
            name: 'Grilla 9',
            position: 9,
            color: '#000000',
        },
        {
            id: 10,
            name: 'Grilla 10',
            position: 10,
            color: '#000000',
        },
    ]);
    const handleAddGrilla = (nuevaGrilla: Grilla) => {
        setGrillas(prevGrillas => {
            const newId = prevGrillas.length > 0 ? Math.max(...prevGrillas.map(g => g.id)) + 1 : 1;
            const newPos = prevGrillas.length + 1;
            return [...prevGrillas, {
                ...nuevaGrilla,
                id: newId,
                position: newPos,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            }];
        });
        setIsModalOpen(false); // Cerrar el modal después de agregar
    };
    const handleAddProyecto = (nuevoProyecto: Proyecto) => {
        setProyectos(prevProyectos => {
            const newId = prevProyectos.length > 0 ? Math.max(...prevProyectos.map(p => p.id)) + 1 : 1;
            const newPos = prevProyectos.length + 1;
            return [...prevProyectos, {
                ...nuevoProyecto,
                id: newId,
                position: newPos,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            }];
        });
        setIsModalOpenProyecto(false); // Cerrar el modal después de agregar
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over || active.id === over.id) {
            return;
        }

        setGrillas((items) => {
            const oldIndex = items.findIndex((item) => item.id === active.id);
            const newIndex = items.findIndex((item) => item.id === over.id);

            const newItems = [...items];
            const [removed] = newItems.splice(oldIndex, 1);
            newItems.splice(newIndex, 0, removed);

            // Actualizar las posiciones
            return newItems.map((item, index) => ({
                ...item,
                position: index + 1,
                updated_at: new Date().toISOString(),
            }));
        });
    };
    return (
        <div className={`flex flex-row h-[calc(80vh-100px)] ${className}`}>
            {isModalOpen ? <FormNewGrilla className="min-w-[350px]" onAdd={handleAddGrilla} /> : isModalOpenProyecto ? <FormNewProyect className="min-w-[350px]" onAdd={handleAddProyecto} /> : <RightBar className="min-w-[350px]" />}
            <div className="">
                <div className="flex justify-start pb-1">
                    <ButtonAddGrilla handleOpenModal={handleOpenModalGrilla} buttonText="Add Grilla" colorButton="bg-blue-500" />
                    <ButtonAddGrilla handleOpenModal={handleOpenModalProyecto} buttonText="Add Proyecto" colorButton="bg-green-500" />
                </div>
                <div className="flex flex-row h-full min-w-[calc(80vw-200px)] overflow-x-auto">
                    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        {grillas.length > 0 ? (
                            <SortableContext items={grillas.map(g => g.id)} strategy={horizontalListSortingStrategy}>
                                <div className="flex flex-row gap-2">
                                    {grillas.map((grilla) => (
                                        <Grillas key={grilla.id} grilla={grilla} />
                                    ))}
                                </div>
                            </SortableContext>
                        ) : (
                            <p className="text-gray-500">No hay grillas. Haz clic en el botón para agregar una.</p>
                        )}
                    </DndContext>
                </div>
            </div>
        </div>
    );
}