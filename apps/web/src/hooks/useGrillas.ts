import { useState } from "react";
import type { Grilla } from "../types/models";

export default function useGrillas() {
    const [grillas, setGrillas] = useState<Grilla[]>([]);

    const addGrilla = (grilla: Grilla) => {
        setGrillas([...grillas, grilla]);
    }

    return {
        grillas,
        addGrilla
    }
}
