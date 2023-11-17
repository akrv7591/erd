import React from "react";
import {IErdNode, IErdNodeColumn} from "../types/erd-node";
import {Edge, useNodeId, useReactFlow} from "reactflow";
import {DEFAULT_COLUMN_DATA} from "../constants/erd/column.ts";
import {createId} from "@paralleldrive/cuid2";
import {useMutation} from "react-query";
import erdApi from "../api/erdApi.tsx";
import {useParams} from "react-router-dom";
import httpStatus from "http-status";
import {arrayMove, OnChangeMeta} from "react-movable";
import isEqual from "lodash/isEqual";
import {ErdTableDataContext, IColumnMutationType} from "../contexts/ErdTableDataContext.ts";

interface IColumnMutationData {
  column: IErdNodeColumn
  type: IColumnMutationType
}


const columnMutationFn = (erdId: string, nodeId: string, data: IErdNodeColumn, type: IColumnMutationType) => {
  switch (type) {
    case "put":
      return erdApi.put(`/v1/erd/${erdId}/table/${nodeId}/column`, data)
    case "delete":
      return erdApi.delete(`/v1/erd/${erdId}/table/${nodeId}/column/${data.id}`)
  }
}


interface Props extends React.PropsWithChildren {
}

export const ErdTableDataProvider = React.memo((props: Props) => {
  const params = useParams<{ erdId: string }>()
  const nodeId = useNodeId()
  const reactFlow = useReactFlow()
  const node: IErdNode = reactFlow.getNode(nodeId!)!
  const [data, setData] = React.useState(node.data)
  const columnMutation = useMutation({
    mutationFn: ({column, type}: IColumnMutationData) => columnMutationFn(params.erdId!, nodeId!, column, type),
    onSuccess: res => {
      switch (res.status) {
        case httpStatus.CREATED:
          break
        case httpStatus.OK:
      }
    },
    onError: () => console.log("column mutation error")
  })
  const addColumn = (type: "primary" | "default") => {
    setData(curData => {

      const newColumn: IErdNodeColumn = {...DEFAULT_COLUMN_DATA, order: curData.columns.length}
      newColumn.id = createId()
      if (type === "primary") {
        newColumn.primary = true;
        newColumn.unique = true;
        newColumn.null = true;
      }

      columnMutation.mutate({
        column: newColumn,
        type: "put"
      })
      curData.columns.push(newColumn)

      return curData
    })
  }
  const setColumn = (updatedColumn: IErdNodeColumn) => {
    columnMutation.mutate({
      column: updatedColumn,
      type: "put"
    })
    setData(cur => ({
      ...cur,
      columns: cur.columns.map(column => column.id === updatedColumn.id ? updatedColumn : column)
    }))
  }
  const deleteSelectedColumns = () => {
    const edgesToDelete: Edge[] = []
    setData(cur => {
      cur.columns = cur.columns.reduce((list, column) => {
        if (column.selected) {
          columnMutation.mutate({column, type: "delete"})

          const edge = reactFlow.getEdges().find(edge => edge.id.includes(column.id))

          if (edge) {
            edgesToDelete.push(edge)
          }

        } else {
          list.push(column)
        }
        return list
      }, [] as IErdNodeColumn[])

      return cur
    })

    reactFlow.deleteElements({
      edges: edgesToDelete
    })
  }
  const reorderColumns = (meta: OnChangeMeta) => {
    setData(curData => {
      const orderedColumns = arrayMove(data.columns, meta.oldIndex, meta.newIndex).map((column, order) => ({
        ...column,
        order: order
      }))
      const objectsNotEqual = orderedColumns.filter((newColumn) => !curData.columns.some((oldColumn) => isEqual(newColumn, oldColumn)));
      objectsNotEqual.forEach(column => columnMutation.mutate({column, type: "put"}))
      curData.columns = orderedColumns

      return curData
    })
  }

  React.useEffect(() => {
    node.data = data
    reactFlow.setNodes((cur: IErdNode[]) => cur.map(n => n.id === node.id ? node : n))
  }, [data])


  return (
    <ErdTableDataContext.Provider value={{data, setData, addColumn, setColumn, deleteSelectedColumns, reorderColumns}}>
      {props.children}
    </ErdTableDataContext.Provider>
  )
})

