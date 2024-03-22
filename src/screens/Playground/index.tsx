import {AppShell, LoadingOverlay} from "@mantine/core";
import {Navigate, useParams,} from "react-router-dom";
import Header from "@/screens/Playground/Header";
import Navbar from "@/screens/Playground/Navbar";
import Footer from "@/screens/Playground/Footer";
import {ReactFlowProvider} from "@xyflow/react";
import Aside from "@/screens/Playground/Aside";
import Main from "@/screens/Playground/Main/Main.tsx";
import {usePlaygroundStore} from "@/stores/usePlaygroundStore.ts";
import {useAuthStore} from "@/stores/useAuthStore.ts";
import {useOnMount} from "@/hooks/useOnMount.ts";
import {PlaygroundService} from "@/services/multiplayer/playground-service.ts";

export default function Playground() {
  const {erdId} = useParams<{ erdId: string }>()
  const connected = usePlaygroundStore(state => state.connected)
  const reset = usePlaygroundStore(state => state.reset)
  const player = useAuthStore(state => state.user)
  const playgroundId = useParams<{ erdId: string }>().erdId!

  useOnMount(() => {
    if (!player) return
    const playground = new PlaygroundService(player.id, playgroundId)
    usePlaygroundStore.setState({playground})

    const disconnect = () => {
      playground.io.close()
      reset()
    }

    window.addEventListener('beforeunload', disconnect);

    // Cleanup function
    return () => {
      disconnect()
      window.removeEventListener('beforeunload', disconnect);
    };
  })

  if (!erdId) return <Navigate to={"/"}/>

  return (
    <ReactFlowProvider initialEdges={[]} initialNodes={[]}>
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
        <AppShell.Main pos={"relative"}>
          {!connected && <LoadingOverlay visible loaderProps={{type: "bars"}}/>}
          <Main/>
        </AppShell.Main>
        <AppShell.Footer>
          <Footer/>
        </AppShell.Footer>
      </AppShell>
    </ReactFlowProvider>
  )
}
