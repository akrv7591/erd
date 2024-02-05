import {AppShell} from "@mantine/core";
import {Navigate, useParams,} from "react-router-dom";
import Header from "@/screens/Playground/Header";
import Navbar from "@/screens/Playground/Navbar";
import Footer from "@/screens/Playground/Footer";
import {ReactFlowProvider} from "@xyflow/react";
import Aside from "@/screens/Playground/Aside";
import PlaygroundProvider from "@/providers/PlaygroundProvider.tsx";
import Main from "@/screens/Playground/Main/Main.tsx";

export function Component() {
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
            <Main/>
          </AppShell.Main>
          <AppShell.Footer>
            <Footer/>
          </AppShell.Footer>
        </AppShell>
      </ReactFlowProvider>
    </PlaygroundProvider>
  )
}
