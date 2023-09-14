import {atom} from "jotai";
import {Node} from "reactflow";
import {IDataAtom} from "../providers/TableDataProvider";
import {atomWithStorage} from "jotai/utils";

export interface INode extends Node<IDataAtom> {
}

export const nodesAtom = atom<INode[]>([])
export const setNodes = atom(null, (get, set, arg: INode[]) => {
  const data = arg.map(node => {
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
  set(dataStorageAtom, data as never[])
  set(nodesAtom, arg)
})

export const dataStorageAtom = atomWithStorage("data", [])
