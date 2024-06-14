import {LoadingOverlay} from "@mantine/core";
import {Navigate, useParams,} from "react-router-dom";
import {useReactFlow} from "@xyflow/react";
import {useAuthStore} from "@/stores/useAuthStore.ts";
import {useOnMount} from "@/hooks/useOnMount.ts";
import {PlaygroundService} from "@/services/multiplayer/playground-service.ts";
import {memo} from "react";
import {usePlayground, usePlaygroundStore} from "@/contexts/playground/PlaygroundStoreContext.ts";
import {Main} from "./Main";


export const Playground = memo(() => {
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
      playground.socket.close()
      reset()
    }

    window.addEventListener('beforeunload', disconnect);

    // Cleanup function
    return () => {
      disconnect()
      window.removeEventListener('beforeunload', disconnect);
    };
  })

  if (!playgroundId) return (
    <Navigate to={"/"}/>
  )

  if (!connected) return (
    <LoadingOverlay visible loaderProps={{type: "bars"}}/>
  )

  return (
    <Main/>
  )
})

