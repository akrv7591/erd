import {atom} from "jotai";
import {Node} from "reactflow";
import {IData, IDataAtom} from "../providers/TableDataProvider";
import {erdsAtom} from "./erdsAtom";
import {IColumn} from "./columnAtom";

export interface INode extends Node<IDataAtom> {
}

interface ISetNode {
  erdUuid: string
  nodes: INode[]
}

export const nodesAtom = atom<INode[]>([])

export const setNodes = atom(null, (get, set, arg: ISetNode) => {
  const nodes = arg.nodes.map(node => {
    const nodeData = get(node.data)
    const columnAtomList = get(nodeData.columns)
    const columns = columnAtomList.map(columnAtom => get(columnAtom))

    return {
      ...node,
      data: {
        ...nodeData,
        columns
      }
    }
  })

  set(erdsAtom, curErds => curErds.map(erd => erd.id === arg.erdUuid? ({...erd, nodes: nodes}): erd))
  set(nodesAtom, arg.nodes)
})

export interface IJsonData extends Omit<IData, 'columns'>{
  columns: IColumn[]
}

export interface IJsonNode extends Node<IJsonData>{}
export interface ISetJsonNode {
  nodes: IJsonNode[]
  erdUuid: string
}

export const setJsonNodes = atom(null, (get, set, args: ISetJsonNode) => {
  const nodes: any = args.nodes.map(node => {
    const columnAtoms = node.data.columns.map(column => atom(column))
    const columnsAtom = atom(columnAtoms)

    const dataAtom = atom({
      ...node.data,
      columns: columnsAtom
    })
    return {
      ...node,
      data: dataAtom
    }
  })

  set(setNodes, {erdUuid: args.erdUuid, nodes})
})
