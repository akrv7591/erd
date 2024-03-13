import React from "react";
import {Edge, useNodeId, useReactFlow} from "@xyflow/react";
import {DEFAULT_COLUMN_DATA} from "@/constants/erd/column.ts";
import {createId} from "@paralleldrive/cuid2";
import isEqual from "lodash/isEqual";
import {ErdTableDataContext} from "@/screens/Home/Main/Reactflow/ErdTableDataContext.ts";
import {MantineProvider} from "@mantine/core";
import {erdTableTheme} from "@/config/theme.ts";
import {EntityNodeColumn, EntityNodeData} from "@/types/entity-node";

interface Props extends React.PropsWithChildren {
  data: EntityNodeData
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
    const newColumn: EntityNodeColumn = {...DEFAULT_COLUMN_DATA, order: 100 + data.columns.length}
    newColumn.id = createId()

    if (type === "primary") {
      newColumn.primary = true;
      newColumn.unique = true;
      newColumn.null = true;
    }

    setData(cur => ({...cur, columns: [...cur.columns, newColumn]}))
  }
  const setColumn = (updatedColumn: EntityNodeColumn) => setData(cur => ({
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
    }, [] as EntityNodeColumn[])


    reactFlow.deleteElements({
      edges: edgesToDelete
    })

    setData(cur => ({...cur, columns}))
  }

  const setSortedColumns = (columns: EntityNodeColumn[]) => {
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
