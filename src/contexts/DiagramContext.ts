import {createContext} from "react";
import {createDiagramStore} from "src/stores/diagram-store";

export type DiagramContext = ReturnType<typeof createDiagramStore>

export const DiagramContext = createContext<DiagramContext>({} as DiagramContext)

