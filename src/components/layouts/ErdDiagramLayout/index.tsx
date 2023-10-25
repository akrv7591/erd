import {AppShell} from "@mantine/core";
import {Outlet, useParams} from "react-router-dom";
import Header from "./Header";
import Navbar from "./Navbar";
import Aside from "./Aside";
import {Atom, useAtomValue, useSetAtom} from "jotai";
import {erdsAtom, IErd} from "../../../atoms/erdsAtom";
import React from "react";
import {selectAtom} from "jotai/utils";
import {nodesAtom, setJsonNodes} from "../../../atoms/nodesAtoms";
import {useOnMount} from "../../../hooks/useOnMount";
import {edgesUpdateAtom} from "../../../atoms/edgesAtoms";

const ErdContext = React.createContext<Atom<IErd>>({} as Atom<IErd>)
export const useErdAtom = () => React.useContext(ErdContext)

const LayoutOutlet = () => {
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

  if(!mounted) return null

  return (
    <ErdContext.Provider value={erdAtom}>
      <Outlet/>
    </ErdContext.Provider>
  )
}

export default function ErdDiagramLayout() {


  return (
    <AppShell
      header={{height: 50}}
      navbar={{width: 50, breakpoint: "none"}}
      aside={{width: 50, breakpoint: "none"}}
      footer={{height: 50}}
    >
      <AppShell.Header>
        <Header/>
      </AppShell.Header>
      <AppShell.Navbar>
        <Navbar/>
      </AppShell.Navbar>
      <AppShell.Aside>
        <Aside/>
      </AppShell.Aside>
      <AppShell.Main>
        <LayoutOutlet/>
      </AppShell.Main>
      <AppShell.Footer>Footer</AppShell.Footer>
    </AppShell>

  )
}
