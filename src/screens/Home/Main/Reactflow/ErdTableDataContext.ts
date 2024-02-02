import React from "react";
import {ITableNodeColumn, ITableNodeData} from "@/types/table-node";

interface IErdTableDataContextProps {
  data: ITableNodeData
  columns: ITableNodeColumn[],
  setData: React.Dispatch<React.SetStateAction<ITableNodeData>>
  addColumn: (type: "primary" | "default") => void
  setColumn: (updatedColumn: ITableNodeColumn) => void
  deleteSelectedColumns: () => void
  setSortedColumns: (columns: ITableNodeColumn[]) => void
}

export const ErdTableDataContext = React.createContext<IErdTableDataContextProps>({} as IErdTableDataContextProps)

export const useErdTableData = () => React.useContext(ErdTableDataContext)
