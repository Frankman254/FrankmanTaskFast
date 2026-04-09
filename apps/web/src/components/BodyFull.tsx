import { useState } from "react";
import type { Grilla, Proyecto, Tarea } from "@frankman-task-fast/types";
import FormNewProyect from "./FormNewProyect";
import FormAddTarea from "./FormAddTarea";
import ButtonAdd from "./ButtonAdd";
import ProyectoTablero from "./ProyectoTablero";
import FormNewGrilla from "./FormNewGrilla";
import Modal from "./Modal";
import ProjectDashboard from "./ProjectDashboard";
import { ClipboardList } from "lucide-react";
import { useBoardState } from "@/hooks/useBoardState";

export default function BodyFull() {
    const [isModalOpenProyecto, setIsModalOpenProyecto] = useState(false);
    const [isModalOpenTarea, setIsModalOpenTarea] = useState(false);
    const [isModalOpenGrilla, setIsModalOpenGrilla] = useState(false);
    const [grillaSeleccionadaParaTarea, setGrillaSeleccionadaParaTarea] = useState<number | null>(null);
    const {
        proyectos,
        proyectoActivo,
        proyectoSeleccionado,
        grillasDelProyectoActivo,
        tareasDelProyectoActivo,
        selectProyecto,
        addProyecto,
        addGrilla,
        addTarea,
        updateGrillas,
        updateTareas,
        getNextGrillaId,
        getNextTareaId,
    } = useBoardState();

    const handleAddProyecto = (nuevoProyecto: Proyecto) => {
        addProyecto(nuevoProyecto);
        setIsModalOpenProyecto(false);
    };

    const handleUpdateGrillas = (proyectoId: number, nuevasGrillas: Grilla[]) => {
        updateGrillas(proyectoId, nuevasGrillas);
    };

    const handleUpdateTareas = (nuevasTareas: Tarea[]) => {
        if (!proyectoActivo) return;
        updateTareas(proyectoActivo, nuevasTareas);
    };

    const handleAddTarea = (nuevaTarea: Tarea) => {
        if (!grillaSeleccionadaParaTarea) return;

        addTarea(grillaSeleccionadaParaTarea, nuevaTarea);
        setIsModalOpenTarea(false);
        setGrillaSeleccionadaParaTarea(null);
    };

    const handleOpenModalTarea = (grillaId: number) => {
        setGrillaSeleccionadaParaTarea(grillaId);
        setIsModalOpenTarea(true);
    };

    const handleOpenModalGrilla = () => {
        setIsModalOpenGrilla(true);
    };

    const handleAddGrilla = (nuevaGrilla: Grilla) => {
        if (!proyectoActivo) return;

        addGrilla(proyectoActivo, nuevaGrilla);
        setIsModalOpenGrilla(false);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-7rem)]">
            {/* Project tabs bar */}
            <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm overflow-x-auto">
                <ButtonAdd 
                    handleOpenModal={() => setIsModalOpenProyecto(true)} 
                    buttonText="+ Proyecto" 
                />
                
                <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />

                {proyectos.map((proyecto) => (
                    <button
                        key={proyecto.id}
                        onClick={() => selectProyecto(proyecto.id)}
                        className={`px-4 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 cursor-pointer ${
                            proyectoActivo === proyecto.id
                                ? 'text-white shadow-md scale-[1.02]'
                                : 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                        style={
                            proyectoActivo === proyecto.id
                                ? { backgroundColor: proyecto.color }
                                : undefined
                        }
                    >
                        {proyecto.name}
                    </button>
                ))}
            </div>

            {/* Main content area - full width, no sidebar */}
            <div className="flex-1 overflow-hidden px-4 py-3 flex flex-col">
                {proyectoActivo && proyectoSeleccionado ? (
                    <>
                        <ProjectDashboard 
                            proyecto={proyectoSeleccionado} 
                            grillas={grillasDelProyectoActivo} 
                            tareas={tareasDelProyectoActivo} 
                        />
                        <ProyectoTablero
                            proyecto={proyectoSeleccionado}
                            grillas={grillasDelProyectoActivo}
                            onUpdateGrillas={(nuevasGrillas) => 
                                handleUpdateGrillas(proyectoActivo, nuevasGrillas)
                            }
                            getNextGrillaId={getNextGrillaId}
                            className="flex-1 overflow-hidden"
                            tareas={tareasDelProyectoActivo}
                            onUpdateTareas={handleUpdateTareas}
                            getNextTareaId={getNextTareaId}
                            onOpenModalTarea={handleOpenModalTarea}
                            onOpenModalGrilla={handleOpenModalGrilla}
                        />
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full flex-1">
                        <div className="text-center animate-fadeIn">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                                <ClipboardList className="w-8 h-8 text-white" />
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 text-lg mb-4 font-medium">
                                {proyectos.length === 0 
                                    ? "No hay proyectos. Crea uno para comenzar." 
                                    : "Selecciona un proyecto para ver su tablero."}
                            </p>
                            {proyectos.length === 0 && (
                                <ButtonAdd 
                                    handleOpenModal={() => setIsModalOpenProyecto(true)} 
                                    buttonText="Crear Primer Proyecto" 
                                />
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            <Modal
                isOpen={isModalOpenProyecto}
                onClose={() => setIsModalOpenProyecto(false)}
                title="Nuevo Proyecto"
            >
                <FormNewProyect 
                    onAdd={handleAddProyecto}
                    onClose={() => setIsModalOpenProyecto(false)}
                />
            </Modal>

            <Modal
                isOpen={isModalOpenGrilla}
                onClose={() => setIsModalOpenGrilla(false)}
                title="Nueva Grilla"
            >
                <FormNewGrilla 
                    onAdd={handleAddGrilla}
                    onClose={() => setIsModalOpenGrilla(false)}
                />
            </Modal>

            <Modal
                isOpen={isModalOpenTarea}
                onClose={() => {
                    setIsModalOpenTarea(false);
                    setGrillaSeleccionadaParaTarea(null);
                }}
                title="Nueva Tarea"
            >
                <FormAddTarea 
                    onAdd={handleAddTarea}
                    onClose={() => {
                        setIsModalOpenTarea(false);
                        setGrillaSeleccionadaParaTarea(null);
                    }}
                />
            </Modal>
        </div>
    );
}
