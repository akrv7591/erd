import {atomWithStorage} from "jotai/utils";

export interface IErd {
  id: string,
  name: string,
}

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

export const erdsAtom = atomWithStorage("erds", defaultErdData)

