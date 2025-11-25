import { useState } from "react";
import RightBar from "./RightBar";
import type { Grilla, Tarea } from "../types/models";
import type { Proyecto } from "../types/models";
import FormNewProyect from "./FormNewProyect";
import FormAddTarea from "./FormAddTarea";
import ButtonAddGrilla from "./ButtonAdd";
import ProyectoTablero from "./ProyectoTablero";
import { grillasDefault, proyectosDefault, tareasDefault } from "../data_default/dataDefault";
import FormNewGrilla from "./FormNewGrilla";

interface BodyFullProps {
    className?: string;
}

export default function BodyFull({ className = '' }: BodyFullProps) {
    const [isModalOpenProyecto, setIsModalOpenProyecto] = useState(false);
    const [isModalOpenTarea, setIsModalOpenTarea] = useState(false);
    const [isModalOpenGrilla, setIsModalOpenGrilla] = useState(false);
    const [grillaSeleccionadaParaTarea, setGrillaSeleccionadaParaTarea] = useState<number | null>(null);
    const [proyectos, setProyectos] = useState<Proyecto[]>(proyectosDefault);
    
    // Inicializar proyecto activo con el primer proyecto si hay proyectos default
    const [proyectoActivo, setProyectoActivo] = useState<number | null>(
        proyectosDefault.length > 0 ? proyectosDefault[0].id : null
    );
    
    // Asignar grillas default a proyectos (distribuir las grillas entre los proyectos)
    const grillasConProyecto = grillasDefault.map((grilla, index) => ({
        ...grilla,
        proyect_id: proyectosDefault[index % proyectosDefault.length]?.id || undefined,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    }));
    
    // Todas las grillas de todos los proyectos
    const [todasLasGrillas, setTodasLasGrillas] = useState<Grilla[]>(grillasConProyecto);
    
    // Todas las tareas de todos los proyectos
    const [todasLasTareas, setTodasLasTareas] = useState<Tarea[]>(tareasDefault);

    const handleOpenModalProyecto = () => {
        setIsModalOpenProyecto(!isModalOpenProyecto);
    };

    const handleAddProyecto = (nuevoProyecto: Proyecto) => {
        setProyectos(prevProyectos => {
            const newId = prevProyectos.length > 0 ? Math.max(...prevProyectos.map(p => p.id)) + 1 : 1;
            const proyectoCompleto = {
                ...nuevoProyecto,
                id: newId,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };
            
            // Si es el primer proyecto, activarlo automáticamente
            if (prevProyectos.length === 0) {
                setProyectoActivo(newId);
            }
            
            return [...prevProyectos, proyectoCompleto];
        });
        setIsModalOpenProyecto(false);
    };

    // Obtener las grillas del proyecto activo
    const grillasDelProyectoActivo = todasLasGrillas.filter(
        g => g.proyect_id === proyectoActivo
    );

    // Obtener el siguiente ID único para grillas
    const getNextGrillaId = () => {
        if (todasLasGrillas.length === 0) return 1;
        return Math.max(...todasLasGrillas.map(g => g.id)) + 1;
    };

    // Actualizar las grillas de un proyecto específico
    const handleUpdateGrillas = (proyectoId: number, nuevasGrillas: Grilla[]) => {
        setTodasLasGrillas(prevGrillas => {
            // Eliminar las grillas del proyecto
            const grillasSinProyecto = prevGrillas.filter(g => g.proyect_id !== proyectoId);
            // Agregar las nuevas grillas
            return [...grillasSinProyecto, ...nuevasGrillas];
        });
    };

    const proyectoSeleccionado = proyectos.find(p => p.id === proyectoActivo);
    
    // Obtener las tareas del proyecto activo (filtrando por grillas del proyecto)
    const grillasIdsDelProyecto = grillasDelProyectoActivo.map(g => g.id);
    const tareasDelProyectoActivo = todasLasTareas.filter((tarea: Tarea) => 
        grillasIdsDelProyecto.includes(tarea.grilla_id)
    );

    // Obtener el siguiente ID único para tareas
    const getNextTareaId = () => {
        if (todasLasTareas.length === 0) return 1;
        return Math.max(...todasLasTareas.map(t => t.id)) + 1;
    };

    // Actualizar las tareas
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
        if (isModalOpenTarea && grillaSeleccionadaParaTarea === grillaId) {
            setIsModalOpenTarea(false);
            setGrillaSeleccionadaParaTarea(null);
        } else {
            setGrillaSeleccionadaParaTarea(grillaId);
            setIsModalOpenTarea(true);
        }
    };

    const handleOpenModalGrilla = () => {
        setIsModalOpenGrilla(!isModalOpenGrilla);
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
        <div className={`flex flex-col h-[calc(80vh-100px)] ${className}`}>
            {/* Barra lateral */}
            <div className="flex flex-row h-full">
                {isModalOpenProyecto ? (
                    <FormNewProyect 
                        className="min-w-[350px]" 
                        onAdd={handleAddProyecto} 
                    />
                ) : isModalOpenTarea ? (
                    <FormAddTarea 
                        className="min-w-[350px]" 
                        onAdd={handleAddTarea} 
                    />
                ) : isModalOpenGrilla ? (
                    <FormNewGrilla 
                        className="min-w-[350px]" 
                        onAdd={handleAddGrilla} 
                    />
                ) : (
                    <RightBar className="min-w-[350px]" />
                )}
                
                {/* Área principal */}
                <div className="flex flex-col flex-1 h-full">
                    {/* Barra de pestañas de proyectos */}
                    <div className="flex items-center gap-2 p-2 border-b-2 border-gray-200 bg-gray-50 overflow-x-auto">
                        <ButtonAddGrilla 
                            handleOpenModal={handleOpenModalProyecto} 
                            buttonText="+ Proyecto" 
                            colorButton="bg-green-500" 
                        />
                        
                        {proyectos.map((proyecto) => (
                            <button
                                key={proyecto.id}
                                onClick={() => setProyectoActivo(proyecto.id)}
                                className={`px-4 py-2 rounded-t-lg font-semibold transition-all whitespace-nowrap ${
                                    proyectoActivo === proyecto.id
                                        ? 'bg-white border-t-2 border-l-2 border-r-2 border-b-0 shadow-md'
                                        : 'bg-gray-200 hover:bg-gray-300'
                                }`}
                                style={{
                                    borderTopColor: proyectoActivo === proyecto.id ? proyecto.color : 'transparent',
                                    borderLeftColor: proyectoActivo === proyecto.id ? proyecto.color : 'transparent',
                                    borderRightColor: proyectoActivo === proyecto.id ? proyecto.color : 'transparent',
                                    color: proyectoActivo === proyecto.id ? proyecto.color : '#666',
                                }}
                            >
                                {proyecto.name}
                            </button>
                        ))}
                    </div>

                    {/* Contenido del proyecto activo */}
                    <div className="flex-1 overflow-hidden">
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
                                <div className="text-center">
                                    <p className="text-gray-500 text-lg mb-4">
                                        {proyectos.length === 0 
                                            ? "No hay proyectos. Crea uno para comenzar." 
                                            : "Selecciona un proyecto para ver su tablero."}
                                    </p>
                                    {proyectos.length === 0 && (
                                        <ButtonAddGrilla 
                                            handleOpenModal={handleOpenModalProyecto} 
                                            buttonText="Crear Primer Proyecto" 
                                            colorButton="bg-green-500" 
                                        />
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
