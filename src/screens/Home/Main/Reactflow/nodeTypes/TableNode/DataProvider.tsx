import React from "react";
import {Edge, useNodeId, useNodesData, useReactFlow} from "@xyflow/react";
import {DEFAULT_COLUMN_DATA} from "@/constants/erd/column.ts";
import {createId} from "@paralleldrive/cuid2";
import isEqual from "lodash/isEqual";
import {ErdTableDataContext} from "@/screens/Home/Main/Reactflow/ErdTableDataContext.ts";
import {MantineProvider} from "@mantine/core";
import {erdEntityTheme} from "@/config/theme.ts";
import {EntityNodeColumn, EntityNodeData} from "@/types/entity-node";

interface Props extends React.PropsWithChildren {
}

export const ErdTableDataProvider = React.memo((props: Props) => {
  console.log("RENDERING")
  const nodeId = useNodeId()!
  const reactFlow = useReactFlow()
  const nodeData = useNodesData(nodeId)
  const [data, setData] = React.useState<EntityNodeData>(nodeData!.data as EntityNodeData)

  React.useEffect(() => {
    setData(cur => ({...data, columns: cur.columns}))
  }, [data, setData])

  const addColumn = (type: "primary" | "default") => {
    const newColumn: EntityNodeColumn = {
      ...DEFAULT_COLUMN_DATA,
      order: 100 + data.columns.length,
      id: createId(),
      entityId: nodeId,
    }

    if (type === "primary") {
      newColumn.primary = true;
      newColumn.unique = true;
      newColumn.notNull = true;
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

  const theme = React.useMemo(() => erdEntityTheme(data.color), [data.color])

  return (
    <MantineProvider
      defaultColorScheme={"dark"}
      theme={theme}
      cssVariablesSelector={`#${nodeId}`}
      getRootElement={() => document.getElementById(nodeId) || undefined}
    >
      <ErdTableDataContext.Provider
        value={{data, columns: data.columns, setSortedColumns, setData, addColumn, setColumn, deleteSelectedColumns}}>
        {props.children}
      </ErdTableDataContext.Provider>
    </MantineProvider>
  )
})
