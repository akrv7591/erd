import {AppShell} from "@mantine/core";
import {Helmet} from "react-helmet-async";
import {Header} from "@/screens/Playground/Header";
import {Navbar} from "@/screens/Playground/Navbar";
import {Aside} from "@/screens/Playground/Aside";
import {Footer} from "@/screens/Playground/Footer";
import {Outlet} from "react-router-dom";
import PlaygroundStoreProvider from "@/providers/PlaygroundStoreProvider.tsx";
import {ReactFlowProvider} from "@xyflow/react";
import {FpsView} from "react-fps";

export const PlaygroundLayout = () => {
  return (
    <PlaygroundStoreProvider>
      <ReactFlowProvider>
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
          <AppShell.Main pos={"relative"}>
            {import.meta.env.DEV && (
                <FpsView top={55} left={"calc(100% - 160px)"} width={100} height={50}/>
            )}
            <Outlet/>
          </AppShell.Main>
          <AppShell.Footer>
            <Footer/>
          </AppShell.Footer>
        </AppShell>
      </ReactFlowProvider>
    </PlaygroundStoreProvider>
  )
}
