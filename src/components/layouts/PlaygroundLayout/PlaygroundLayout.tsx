import {AppShell} from "@mantine/core";
import {Helmet} from "react-helmet-async";
import {Header} from "@/screens/Playground/Header";
import {Navbar} from "@/screens/Playground/Navbar";
import {Aside} from "@/screens/Playground/Aside";
import {Footer} from "@/screens/Playground/Footer";
import {Outlet} from "react-router-dom";
import {ReactFlowProvider} from "@xyflow/react";
import {DiagramProvider} from "@/providers/DiagramProvider.tsx";

export const PlaygroundLayout = () => {
  return (
      <ReactFlowProvider>
        <DiagramProvider>
          <AppShell
              header={{height: 50}}
              navbar={{width: 50, breakpoint: "none"}}
              footer={{height: 50}}
              aside={{width: 50, breakpoint: "none"}}
          >
            <Helmet>
              <title>Erdiagramly</title>
            </Helmet>
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
        </DiagramProvider>
      </ReactFlowProvider>
  )
}
