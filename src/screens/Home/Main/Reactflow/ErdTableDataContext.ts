import React from "react";
import {EntityNodeColumn, EntityNodeData} from "@/types/entity-node";

interface IErdTableDataContextProps {
  data: EntityNodeData
  columns: EntityNodeColumn[],
  setData: React.Dispatch<React.SetStateAction<EntityNodeData>>
  addColumn: (type: "primary" | "default") => void
  setColumn: (updatedColumn: EntityNodeColumn) => void
  deleteSelectedColumns: () => void
  setSortedColumns: (columns: EntityNodeColumn[]) => void
}

export const ErdTableDataContext = React.createContext<IErdTableDataContextProps>({} as IErdTableDataContextProps)

export const useErdTableData = () => React.useContext(ErdTableDataContext)
