import React from "react";
import {atom, PrimitiveAtom, useAtomValue, WritableAtom} from "jotai";
import {IColumn} from "../atoms/columnAtom";
import {arrayMove, OnChangeMeta} from "react-movable";

export interface IData {
  tableName: string,
  color: string,
  columns: PrimitiveAtom<PrimitiveAtom<IColumn>[]>
}

export interface IDataAtom extends PrimitiveAtom<IData> {}

interface TableDataContextProps {
  dataAtom: IDataAtom,
  addColumn: WritableAtom<null, [atom: PrimitiveAtom<IColumn>], void>
  removeColumn: WritableAtom<null, [atom: PrimitiveAtom<IColumn>], void>
  reorderColumn: WritableAtom<null, [atom: PrimitiveAtom<IColumn>], void> & any
}

interface Props {
  children: React.ReactNode
  dataAtom: IDataAtom
}

const TableDataContext = React.createContext<TableDataContextProps>({} as TableDataContextProps)

export const TableDataProvider = (props: Props) => {
  const data = useAtomValue(props.dataAtom)

  const tableData = React.useMemo(() => {
    const addColumn = atom(null, (get, set, arg: PrimitiveAtom<IColumn>) => set(data.columns, [...get(data.columns), arg]))
    const removeColumn = atom(null, (get, set, arg: PrimitiveAtom<IColumn>) => set(data.columns, get(data.columns).filter(column => column !== arg)))
    const reorderColumns = atom(null, (get, set, meta: OnChangeMeta) => {
      set(data.columns, arrayMove<PrimitiveAtom<IColumn>>(get(data.columns), meta.oldIndex, meta.newIndex))
    })

    return {
      addColumn,
      removeColumn,
      reorderColumns
    }

  }, [data.columns])

  return (
    <TableDataContext.Provider value={{
      dataAtom: props.dataAtom,
      addColumn: tableData.addColumn,
      removeColumn: tableData.removeColumn,
      reorderColumn: tableData.reorderColumns
    }}>
      {props.children}
    </TableDataContext.Provider>
  )
}

export const useTableData = () => React.useContext(TableDataContext)
