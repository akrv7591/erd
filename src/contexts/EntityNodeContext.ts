import {createContext} from "react";
import {EntityData} from "@/types/diagram";
import {NODE} from "@/namespaces/broadcast/node";

export interface EntityNodeContextType {
  onDataUpdate: (entityId: string, dataOrFunction: Partial<EntityData> | ((data: EntityData) => Partial<EntityData>)) => void
  onNameChange: (data: NODE.ENTITY.NAME_UPDATE) => void
  onColorChange: (data: NODE.ENTITY.COLOR_UPDATE) => void
  onAddColumn: (data: NODE.ENTITY.COLUMN_ADD) => void
  onUpdateColumn: (data: NODE.ENTITY.COLUMN_UPDATE) => void
  onDeleteColumn: (data: NODE.ENTITY.COLUMN_DELETE) => void
}

export const EntityNodeContext = createContext<EntityNodeContextType>({} as EntityNodeContextType)
