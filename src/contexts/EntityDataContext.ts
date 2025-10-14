import { createEntityStore } from "@/stores/entity-store"
import { createContext } from "react"

export type EntityDataContextType = ReturnType<typeof createEntityStore>

export const EntityDateContext = createContext<EntityDataContextType>({} as EntityDataContextType)