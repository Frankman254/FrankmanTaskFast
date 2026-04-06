import { useState } from "react";
import type { Grilla, Tarea } from "../types/models";
import type { Proyecto } from "../types/models";
import FormNewProyect from "./FormNewProyect";
import FormAddTarea from "./FormAddTarea";
import ButtonAdd from "./ButtonAdd";
import ProyectoTablero from "./ProyectoTablero";
import { grillasDefault, proyectosDefault, tareasDefault } from "../data_default/dataDefault";
import FormNewGrilla from "./FormNewGrilla";
import Modal from "./Modal";

export default function BodyFull() {
    const [isModalOpenProyecto, setIsModalOpenProyecto] = useState(false);
    const [isModalOpenTarea, setIsModalOpenTarea] = useState(false);
    const [isModalOpenGrilla, setIsModalOpenGrilla] = useState(false);
    const [grillaSeleccionadaParaTarea, setGrillaSeleccionadaParaTarea] = useState<number | null>(null);
    const [proyectos, setProyectos] = useState<Proyecto[]>(proyectosDefault);
    
    const [proyectoActivo, setProyectoActivo] = useState<number | null>(
        proyectosDefault.length > 0 ? proyectosDefault[0].id : null
    );
    
    // Grillas already have proyect_id in defaults
    const [todasLasGrillas, setTodasLasGrillas] = useState<Grilla[]>(
        grillasDefault.map(g => ({
            ...g,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        }))
    );
    const [todasLasTareas, setTodasLasTareas] = useState<Tarea[]>(tareasDefault);

    const handleAddProyecto = (nuevoProyecto: Proyecto) => {
        setProyectos(prevProyectos => {
            const newId = prevProyectos.length > 0 ? Math.max(...prevProyectos.map(p => p.id)) + 1 : 1;
            const proyectoCompleto = {
                ...nuevoProyecto,
                id: newId,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };
            
            if (prevProyectos.length === 0) {
                setProyectoActivo(newId);
            }
            
            return [...prevProyectos, proyectoCompleto];
        });
        setIsModalOpenProyecto(false);
    };

    const grillasDelProyectoActivo = todasLasGrillas.filter(
        g => g.proyect_id === proyectoActivo
    );

    const getNextGrillaId = () => {
        if (todasLasGrillas.length === 0) return 1;
        return Math.max(...todasLasGrillas.map(g => g.id)) + 1;
    };

    const handleUpdateGrillas = (proyectoId: number, nuevasGrillas: Grilla[]) => {
        setTodasLasGrillas(prevGrillas => {
            const grillasSinProyecto = prevGrillas.filter(g => g.proyect_id !== proyectoId);
            return [...grillasSinProyecto, ...nuevasGrillas];
        });
    };

    const proyectoSeleccionado = proyectos.find(p => p.id === proyectoActivo);
    
    const grillasIdsDelProyecto = grillasDelProyectoActivo.map(g => g.id);
    const tareasDelProyectoActivo = todasLasTareas.filter((tarea: Tarea) => 
        grillasIdsDelProyecto.includes(tarea.grilla_id)
    );

    const getNextTareaId = () => {
        if (todasLasTareas.length === 0) return 1;
        return Math.max(...todasLasTareas.map(t => t.id)) + 1;
    };

    const handleUpdateTareas = (nuevasTareas: Tarea[]) => {
        setTodasLasTareas(nuevasTareas);
    };

    const handleAddTarea = (nuevaTarea: Tarea) => {
        if (!grillaSeleccionadaParaTarea) return;
        
        const newId = getNextTareaId();
        const tareasDeGrilla = tareasDelProyectoActivo.filter(t => t.grilla_id === grillaSeleccionadaParaTarea);
        const newPos = tareasDeGrilla.length + 1;
        
        const tareaCompleta = {
            ...nuevaTarea,
            id: newId,
            grilla_id: grillaSeleccionadaParaTarea,
            position: newPos,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };
        
        handleUpdateTareas([...todasLasTareas, tareaCompleta]);
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
        
        const newId = getNextGrillaId();
        const grillasDelProyecto = grillasDelProyectoActivo;
        const newPos = grillasDelProyecto.length + 1;
        const grillaConProyecto = {
            ...nuevaGrilla,
            id: newId,
            proyect_id: proyectoActivo,
            position: newPos,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };
        handleUpdateGrillas(proyectoActivo, [...grillasDelProyecto, grillaConProyecto]);
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
                        onClick={() => setProyectoActivo(proyecto.id)}
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
            <div className="flex-1 overflow-hidden px-4 py-3">
                {proyectoActivo && proyectoSeleccionado ? (
                    <ProyectoTablero
                        proyecto={proyectoSeleccionado}
                        grillas={grillasDelProyectoActivo}
                        onUpdateGrillas={(nuevasGrillas) => 
                            handleUpdateGrillas(proyectoActivo, nuevasGrillas)
                        }
                        getNextGrillaId={getNextGrillaId}
                        className="h-full"
                        tareas={tareasDelProyectoActivo}
                        onUpdateTareas={handleUpdateTareas}
                        getNextTareaId={getNextTareaId}
                        onOpenModalTarea={handleOpenModalTarea}
                        onOpenModalGrilla={handleOpenModalGrilla}
                    />
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center animate-fadeIn">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                                <span className="text-3xl">📋</span>
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
