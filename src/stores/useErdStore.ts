import {create} from "zustand";
import {Edge} from "reactflow";
import {ModalType} from "@/hooks/useModal";
import {v4} from "uuid";
import Timer from "@/utility/Timer";
import {INodes} from "@/types/playground";

export const initiateErdData = () => {
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

export interface IErd {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  nodes: INodes[];
  edges: Edge[];
}

interface IUseErdStore {
  erds: IErd[];
  initiated: boolean;

  // Actions
  getErd: (erdUuid: string) => IErd;
  setErds: (erds: IErd[]) => void;
  setErd: (erd: IErd, type: ModalType, callback?: VoidFunction) => Promise<void>
  init: () => Promise<void>
}

export const useErdStore = create<IUseErdStore>()((set, getState) => ({
  erds: [],
  initiated: false,
  // Actions
  getErd: (erdUuid) => getState().erds.find(erd => erd.id === erdUuid)!,
  setErds: (erds) => set(state => ({...state, erds})),
  setErd: async (erd, type, callback) => {
    await Timer.sleep(300)
    switch (type) {
      case "create":
        set(state => ({
          erds: [{
            ...erd,
            id: v4(),
            nodes: [],
            edges: [],
            createdAt: new Date()
          }, ...state.erds]
        }))
        break
      case "update":
        set(state => ({erds: state.erds.map(e => e.id === erd.id ? erd : e)}))
        break
      case "delete":
        set(state => ({erds: state.erds.filter(e => e.id !== erd.id)}))
    }

    if (callback) {
      callback()
    }

  },
  init: async () => {
    set({
      erds: initiateErdData(),
      initiated: true
    })
  }
}))

useErdStore.subscribe(state => {
  localStorage.setItem("erds", JSON.stringify(state.erds))
})
