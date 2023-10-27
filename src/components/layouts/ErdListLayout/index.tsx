import {Outlet} from "react-router-dom";
import {AppShell} from "@mantine/core";
import Header from "./Header";
import {useSetAtom} from "jotai";
import {erdsAtom, getErdData} from "../../../atoms/erdsAtom";
import React from "react";
import {useOnMount} from "../../../hooks/useOnMount";

export default function ErdListLayout() {
  const setErd = useSetAtom(erdsAtom)
  const [mounted, setMounted] = React.useState(false)

  useOnMount(() => {
    setErd(getErdData())
    setMounted(true)
  })

  if (!mounted) return null

  return (
    <AppShell
      header={{height: 70}}
    >
      <AppShell.Header>
        <Header/>
      </AppShell.Header>
      <AppShell.Main>
        <Outlet/>
      </AppShell.Main>
    </AppShell>
  )
}
