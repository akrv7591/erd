import {AppShell} from "@mantine/core";
import {Navigate, Outlet, useParams,} from "react-router-dom";
import Header from "@/components/layouts/PlaygroundLayout/Header";
import Navbar from "@/components/layouts/PlaygroundLayout/Navbar";
import Footer from "@/components/layouts/PlaygroundLayout/Footer";
import {ReactFlowProvider} from "reactflow";
import Aside from "@/components/layouts/PlaygroundLayout/Aside";
import PlaygroundProvider from "@/providers/PlaygroundProvider.tsx";

export default function PlaygroundLayout() {
  const {erdId} = useParams<{ erdId: string }>()

  if (!erdId) return <Navigate to={"/"}/>

  return (
    <PlaygroundProvider>
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
    </PlaygroundProvider>
  )
}
