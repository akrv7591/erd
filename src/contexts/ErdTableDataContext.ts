import {IErdNodeColumn, IErdNodeData} from "../types/erd-node";
import React from "react";
import {OnChangeMeta} from "react-movable";

interface IErdTableDataContextProps {
  data: IErdNodeData
  setData: React.Dispatch<React.SetStateAction<IErdNodeData>>
  addColumn: (type: "primary" | "default") => void
  setColumn: (updatedColumn: IErdNodeColumn) => void
  deleteSelectedColumns: () => void
  reorderColumns: (meta: OnChangeMeta) => void
}

export const ErdTableDataContext = React.createContext<IErdTableDataContextProps>({} as IErdTableDataContextProps)

export type IColumnMutationType = "put" | "delete"

export const useErdTableData = () => React.useContext(ErdTableDataContext)
