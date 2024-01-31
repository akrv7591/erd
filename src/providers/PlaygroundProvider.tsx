import React, {PropsWithChildren} from "react";
import {connect} from "socket.io-client";
import LoadingBackdrop from "@/components/common/LoadingBackdrop.tsx";
import {PlaygroundContext} from "@/contexts/PlaygroundContext.ts";
import {useAuthStore} from "@/stores/useAuthStore.ts";
import {useParams} from "react-router-dom";
import {usePlaygroundStore} from "@/stores/usePlaygroundStore.ts";
import {PlaygroundService} from "@/services/multiplayer/playground-service.ts";
import {useOnMount} from "@/hooks/useOnMount.ts";


export default function PlaygroundProvider(props: PropsWithChildren) {
  const playground = usePlaygroundStore(state => state.playground)
  const reset = usePlaygroundStore(state => state.reset)
  const player = useAuthStore(state => state.getAuthorization())
  const playgroundId = useParams<{ erdId: string }>().erdId!

  useOnMount(() => {
    const socket = connect(import.meta.env.VITE_BASE_URL, {
      auth: {playerId: player?.id, playgroundId},
      withCredentials: true,
      reconnection: true,
    })

    socket.on("connect", () => {
      new PlaygroundService(socket)
    })
  })

  React.useEffect(() => {
    if (!playground) {
      return
    }

    const disconnect = () => {
      playground.io.disconnect()
      reset()
    }

    window.addEventListener('beforeunload', disconnect);

    // Cleanup function
    return () => {
      window.removeEventListener('beforeunload', disconnect);
      disconnect()
    };

  }, [playground])


  if (!playground) return <LoadingBackdrop/>

  return (
    <PlaygroundContext.Provider value={playground}>
      {props.children}
    </PlaygroundContext.Provider>
  )
}
