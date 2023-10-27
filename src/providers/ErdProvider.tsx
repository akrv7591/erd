import React from "react";
import {Atom, useAtomValue, useSetAtom} from "jotai";
import {erdsAtom, IErd} from "../atoms/erdsAtom";
import {useParams} from "react-router-dom";
import {selectAtom} from "jotai/utils";
import {setJsonNodes} from "../atoms/nodesAtoms";
import {edgesUpdateAtom} from "../atoms/edgesAtoms";
import {useOnMount} from "../hooks/useOnMount";

const ErdContext = React.createContext<Atom<IErd>>({} as Atom<IErd>)
export const useErdAtom = () => React.useContext(ErdContext)

const ErdProvider = (props: React.PropsWithChildren) => {
  const params = useParams<{ erdUuid: string }>()
  const erdAtom = React.useMemo(() => {
    return selectAtom(erdsAtom, (erds) => erds.find(erd => erd.id === params.erdUuid)!)
  }, [params.erdUuid])
  const erd = useAtomValue(erdAtom)
  const setNodes = useSetAtom(setJsonNodes)
  const setEdges = useSetAtom(edgesUpdateAtom)
  const [mounted, setMounted] = React.useState(false)

  useOnMount(() => {
    setNodes({
      erdUuid: erd.id,
      nodes: erd.nodes
    })
    setEdges({
      erdUuid: erd.id,
      edges: erd.edges || []
    })
    setMounted(true)
  })

  if (!mounted) return null

  return (
    <ErdContext.Provider value={erdAtom}>
      {props.children}
    </ErdContext.Provider>
  )
}

export default ErdProvider
