import {atom} from "jotai";

export type ITools = 'grab' | 'add-table' | 'select-all' | 'one-to-one' | 'one-to-many' | 'many-to-many'

export const toolAtom = atom<ITools>("grab")
export const dragPaneAtom = atom<boolean>(true)
