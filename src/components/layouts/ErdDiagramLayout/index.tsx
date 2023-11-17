import {AppShell} from "@mantine/core";
import {Navigate, Outlet, useParams,} from "react-router-dom";
import Header from "./Header";
import Navbar from "./Navbar";
import Aside from "./Aside";
import Footer from "./Footer";

export default function ErdDiagramLayout() {
  const {erdId} = useParams<{ erdId: string }>()

  if (!erdId) return <Navigate to={"/"}/>

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
        <Outlet />
      </AppShell.Main>
      <AppShell.Footer>
        <Footer/>
      </AppShell.Footer>
    </AppShell>
  )
}
