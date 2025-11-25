export interface Grilla {
    id: number;
    proyect_id?: number;
    name: string;
    position?: number; // integer para ordenamiento
    color: string;
    created_at?: string;
    updated_at?: string;
}

export interface Proyecto {
    id: number;
    name: string;
    description: string;
    owner_id: number;
    color: string;
    is_archived: boolean;
    created_at?: string;
    updated_at?: string;
}

