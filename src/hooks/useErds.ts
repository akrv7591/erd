import {useAtom} from "jotai/index";
import {v4} from "uuid";
import {erdsAtom, IErd} from "../atoms/erdsAtom";

export const useErds = () => {
  const [erds, setErds] = useAtom(erdsAtom)
  const addErd = () => setErds(erds => [...erds, {id: v4(), name: "Table " + erds.length}])
  const removeErd = (erd: IErd) => setErds(erds => erds.filter(e => e.id !== erd.id))

  return {
    erds,
    addErd,
    removeErd
  }
}
