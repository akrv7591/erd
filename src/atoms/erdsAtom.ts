import {atomWithStorage} from "jotai/utils";
import {atom} from "jotai";
import {v4} from "uuid";
import {ModalType} from "../hooks/useModal";
import {IJsonNode} from "./nodesAtoms";
import {Edge} from "reactflow";

export interface IErd {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  nodes: IJsonNode[];
  edges: Edge[]
}

interface ISetErdArgs {
  type: ModalType;
  data: IErd;
}

export const getErdData = () => {
  const unknownData = localStorage.getItem("erds") || "[]"
  let defaultErdData: IErd[]
  try {
    const arr = JSON.parse(unknownData) as IErd[]

    if (Array.isArray(arr)) {
      defaultErdData = arr
    } else {
      defaultErdData = []
    }
  } catch (e) {
    console.warn("local storage erd data is not valid")
    defaultErdData = []
  }

  return defaultErdData

}

export const erdsAtom = atomWithStorage("erds", getErdData())
export const setErds = atom(
  get => get(erdsAtom),
  (get, set, args: ISetErdArgs) => {
    const {type, data} = args
    let erds: IErd[] = get(erdsAtom)
    switch (type) {
      case "create":
        erds = [{
          ...data,
          id: v4(),
          createdAt: new Date(),
          nodes: [],
          edges: []
        }, ...erds]
        break

      case "update":
        erds = erds.map(erd => erd.id !== data.id ? erd : data)
        break
      case "delete":
        erds = erds.filter(erd => erd.id !== data.id)
        break
    }

    set(erdsAtom, erds)
  })

