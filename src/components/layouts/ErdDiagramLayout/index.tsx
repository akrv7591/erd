import {AppShell} from "@mantine/core";
import {Navigate, Outlet, useParams,} from "react-router-dom";
import Header from "./Header";
import Navbar from "./Navbar";
import Footer from "./Footer";
import {ReactFlowProvider} from "reactflow";
import Aside from "components/layouts/ErdDiagramLayout/Aside";

export default function ErdDiagramLayout() {
  const {erdId} = useParams<{ erdId: string }>()

  if (!erdId) return <Navigate to={"/"}/>

  return (
    <ReactFlowProvider>
      <AppShell
        header={{height: 50}}
        navbar={{width: 50, breakpoint: "none"}}
        footer={{height: 50}}
        aside={{width: 50, breakpoint: "none"}}
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
    </ReactFlowProvider>
  )
}
