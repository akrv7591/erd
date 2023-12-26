import {IErdNodeColumn, IErdNodeData} from "@/types/erd-node";
import React from "react";

interface IErdTableDataContextProps {
  data: IErdNodeData
  columns: IErdNodeColumn[],
  setData: React.Dispatch<React.SetStateAction<IErdNodeData>>
  addColumn: (type: "primary" | "default") => void
  setColumn: (updatedColumn: IErdNodeColumn) => void
  deleteSelectedColumns: () => void
  setSortedColumns: (columns: IErdNodeColumn[]) => void
}

export const ErdTableDataContext = React.createContext<IErdTableDataContextProps>({} as IErdTableDataContextProps)

export type IColumnMutationType = "put" | "delete"

export const useErdTableData = () => React.useContext(ErdTableDataContext)
