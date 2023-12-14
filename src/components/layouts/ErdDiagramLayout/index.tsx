import {AppShell} from "@mantine/core";
import {Navigate, Outlet, useParams,} from "react-router-dom";
import Header from "./Header";
import Navbar from "./Navbar";
import Footer from "./Footer";
import {ReactFlowProvider} from "reactflow";

export default function ErdDiagramLayout() {
  const {erdId} = useParams<{ erdId: string }>()

  if (!erdId) return <Navigate to={"/"}/>

  return (
    <AppShell
      header={{height: 50}}
      navbar={{width: 50, breakpoint: "none"}}
      footer={{height: 50}}
    >
      <AppShell.Header>
        <Header/>
      </AppShell.Header>
      <AppShell.Navbar>
        <Navbar/>
      </AppShell.Navbar>
      <AppShell.Main>
        <ReactFlowProvider>
          <Outlet/>
        </ReactFlowProvider>
      </AppShell.Main>
      <AppShell.Footer>
        <Footer/>
      </AppShell.Footer>
    </AppShell>
  )
}
