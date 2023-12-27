import React, {PropsWithChildren} from "react";
import {connect} from "socket.io-client";
import LoadingBackdrop from "../components/common/LoadingBackdrop.tsx";
import {PlaygroundContext} from "../contexts/PlaygroundContext.ts";
import {useAuthStore} from "../stores/useAuthStore.ts";
import {useParams} from "react-router-dom";
import {useErdDiagramStore} from "../stores/useErdDiagramStore.ts";
import {PlaygroundService} from "@/services/multiplayer/playground-service.ts";
import {IPlayer} from "@/types/table-node";


export default function PlaygroundProvider(props: PropsWithChildren) {
  const playground = useErdDiagramStore(state => state.playground)
  const reset = useErdDiagramStore(state => state.reset)
  const player = useAuthStore(state => state.getAuthorization())
  const playgroundId = useParams<{ erdId: string }>().erdId!
  const isLoaded = React.useMemo(() => playground instanceof PlaygroundService, [playground])

  React.useEffect(() => {
    if (!isLoaded) {
      const socket = connect(import.meta.env.VITE_BASE_URL, {
        auth: {playerId: player?.id, playgroundId},
        withCredentials: true,
        reconnection: true,
      })

      socket.on("connect", () => {
        console.log("CONNECT")
        const playground = new PlaygroundService(socket)
        useErdDiagramStore.setState(cur => ({
          playground: playground,
          players: [...cur.players, player as unknown as IPlayer]
        }))
        socket.on("data", data => {
          console.log(data)
          useErdDiagramStore.setState(cur => ({...cur, ...data}))
        })
      })

    } else {
      const disconnect = () => {
        if (playground) {
          playground.io.disconnect()
          reset()
        }
      }


      window.addEventListener('beforeunload', disconnect);


      // Cleanup function
      return () => {
        window.removeEventListener('beforeunload', disconnect);


        disconnect()
      };
    }
  }, [])


  if (!isLoaded) return <LoadingBackdrop/>

  return (
    <PlaygroundContext.Provider value={playground}>
      {props.children}
    </PlaygroundContext.Provider>
  )
}
