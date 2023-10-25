import {atom} from "jotai";
import {Edge} from "reactflow";
import {erdsAtom} from "./erdsAtom";

export const edgesAtoms = atom<Edge[]>([])
export const edgesUpdateAtom = atom(
  get => get(edgesAtoms),
  (get, set, args: {edges: Edge[], erdUuid: string}) => {
    set(erdsAtom, curErds => curErds.map(erd => erd.id === args.erdUuid? ({...erd, edges: args.edges}): erd))
    set(edgesAtoms, args.edges)
  }
)
