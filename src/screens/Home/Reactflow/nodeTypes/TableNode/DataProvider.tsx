import React from "react";
import {IErdNodeColumn, IErdNodeData} from "@/types/erd-node";
import {Edge, useNodeId, useReactFlow} from "reactflow";
import {DEFAULT_COLUMN_DATA} from "@/constants/erd/column.ts";
import {createId} from "@paralleldrive/cuid2";
import isEqual from "lodash/isEqual";
import {ErdTableDataContext} from "@/contexts/ErdTableDataContext.ts";
import {MantineProvider} from "@mantine/core";
import {erdTableTheme} from "@/config/theme.ts";

interface Props extends React.PropsWithChildren {
  data: IErdNodeData
  parentHtmlId: string
}

export const ErdTableDataProvider = React.memo((props: Props) => {
  const nodeId = useNodeId()!
  const reactFlow = useReactFlow()
  const [data, setData] = React.useState(props.data)

  React.useEffect(() => {
    setData(cur => ({...cur, columns: props.data.columns}))
  }, [props.data.columns, setData])

  React.useEffect(() => {
    setData(cur => ({...props.data, columns: cur.columns}))
  }, [props.data, setData])

  const addColumn = (type: "primary" | "default") => {
    const newColumn: IErdNodeColumn = {...DEFAULT_COLUMN_DATA, order: 100 + data.columns.length}
    newColumn.id = createId()

    if (type === "primary") {
      newColumn.primary = true;
      newColumn.unique = true;
      newColumn.null = true;
    }

    setData(cur => ({...cur, columns: [...cur.columns, newColumn]}))
  }
  const setColumn = (updatedColumn: IErdNodeColumn) => setData(cur => ({
    ...cur,
    columns: cur.columns.map(c => c.id === updatedColumn.id ? {...c, ...updatedColumn} : c)
  }))

  const deleteSelectedColumns = () => {
    const edgesToDelete: Edge[] = []
    const columns = data.columns.reduce((list, column) => {
      if (column.selected) {
        const edge = reactFlow.getEdges().find(edge => edge.id.includes(column.id))
        if (edge) {
          edgesToDelete.push(edge)
        }

      } else {
        list.push(column)
      }
      return list
    }, [] as IErdNodeColumn[])


    reactFlow.deleteElements({
      edges: edgesToDelete
    })

    setData(cur => ({...cur, columns}))
  }

  const setSortedColumns = (columns: IErdNodeColumn[]) => {
    const orderedColumns = columns.map((column, order) => ({
      ...column,
      order: order
    }))
    const objectsNotEqual = orderedColumns.filter((newColumn) => !data.columns.some((oldColumn) => isEqual(newColumn, oldColumn)));

    objectsNotEqual.forEach((column) => {
      setColumn(column)
    })

    setData(cur => ({...cur, columns: orderedColumns}))
  }

  const theme = React.useMemo(() => erdTableTheme(data.color), [data.color])

  return (
    <MantineProvider
      defaultColorScheme={"dark"}
      theme={theme}
      cssVariablesSelector={`#${nodeId}`}
      getRootElement={() => document.getElementById(props.parentHtmlId) || undefined}
    >
      <ErdTableDataContext.Provider
        value={{data, columns: data.columns, setSortedColumns, setData, addColumn, setColumn, deleteSelectedColumns}}>
        {props.children}
      </ErdTableDataContext.Provider>
    </MantineProvider>
  )
})
