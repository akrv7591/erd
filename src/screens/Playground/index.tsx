import {AppShell, LoadingOverlay} from "@mantine/core";
import {Navigate, useParams,} from "react-router-dom";
import Header from "@/screens/Playground/Header";
import Navbar from "@/screens/Playground/Navbar";
import Footer from "@/screens/Playground/Footer";
import {ReactFlowProvider, useReactFlow} from "@xyflow/react";
import Aside from "@/screens/Playground/Aside";
import Main from "@/screens/Playground/Main/Main.tsx";
import {useAuthStore} from "@/stores/useAuthStore.ts";
import {useOnMount} from "@/hooks/useOnMount.ts";
import {PlaygroundService} from "@/services/multiplayer/playground-service.ts";
import {FpsView} from "react-fps";
import {memo} from "react";
import PlaygroundStoreProvider from "@/providers/PlaygroundStoreProvider.tsx";
import {usePlayground, usePlaygroundStore} from "@/contexts/playground/PlaygroundStoreContext.ts";
import {Helmet} from "react-helmet-async";

const Playground = memo(() => {
  const {erdId: playgroundId} = useParams<{ erdId: string }>()
  const connected = usePlayground(state => state.connected)
  const reset = usePlayground(state => state.reset)
  const player = useAuthStore(state => state.user)
  const reactFlow = useReactFlow()
  const playgroundStore = usePlaygroundStore()

  useOnMount(() => {
    if (!player) return
    if (!playgroundId) return
    const playground = new PlaygroundService(player.id, playgroundId, reactFlow, playgroundStore)
    playgroundStore.setState({playground})

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

  if (!playgroundId) return <Navigate to={"/"}/>

  return (
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
          {connected ? (
            <>
              {import.meta.env.DEV && <FpsView top={55} left={"calc(100% - 160px)"} width={100}/>}
              <Main/>
            </>
            ) : (
              <LoadingOverlay visible loaderProps={{type: "bars"}}/>
            )
          }

        </AppShell.Main>
        <AppShell.Footer>
          <Footer/>
        </AppShell.Footer>
      </AppShell>
  )
})

export default function PlaygroundWithReactFlowProvider() {
  return (
    <PlaygroundStoreProvider>
      <ReactFlowProvider>
        <Playground/>
      </ReactFlowProvider>
    </PlaygroundStoreProvider>
  )
}
