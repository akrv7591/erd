import {AppShell} from "@mantine/core";
import {Outlet,} from "react-router-dom";
import Header from "./Header";
import Navbar from "./Navbar";
import Aside from "./Aside";
import React from "react";
import Footer from "./Footer";
import {useOnMount} from "../../../hooks/useOnMount";
import {useErdDiagramStore} from "../../../hooks/erd/useErdDiagramStore";
import {useErd} from "../../../providers/ErdProvider";
import {useShallow} from "zustand/react/shallow";


export default function ErdDiagramLayout() {
  const erd = useErd()
  const setErdDiagramState = useErdDiagramStore(useShallow(state => state.setState))

  // console.log("RENDERING")

  useOnMount(() => {
    setErdDiagramState({
      erdUuid: erd.id,
      nodes: erd.nodes,
      edges: erd.edges
    })
  })

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
        <Outlet/>
      </AppShell.Main>
      <AppShell.Footer>
        <Footer/>
      </AppShell.Footer>
    </AppShell>
  )
}
