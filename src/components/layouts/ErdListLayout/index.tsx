import {Outlet} from "react-router-dom";
import {AppShell} from "@mantine/core";
import Header from "./Header";
export default function ErdListLayout() {
  return (
    <AppShell
      header={{ height: 70 }}
    >
      <AppShell.Header>
        <Header/>
      </AppShell.Header>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  )
}
