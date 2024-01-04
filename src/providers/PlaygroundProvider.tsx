import React, {PropsWithChildren} from "react";
import {connect} from "socket.io-client";
import LoadingBackdrop from "../components/common/LoadingBackdrop.tsx";
import {PlaygroundContext} from "../contexts/PlaygroundContext.ts";
import {useAuthStore} from "../stores/useAuthStore.ts";
import {useParams} from "react-router-dom";
import {usePlaygroundStore} from "../stores/usePlaygroundStore.ts";
import {PlaygroundService} from "@/services/multiplayer/playground-service.ts";
import {IPlayer} from "@/types/table-node";


export default function PlaygroundProvider(props: PropsWithChildren) {
  const playground = usePlaygroundStore(state => state.playground)
  const reset = usePlaygroundStore(state => state.reset)
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
        const playground = new PlaygroundService(socket)
        usePlaygroundStore.setState(cur => ({
          playground: playground,
          players: [...cur.players, player as unknown as IPlayer]
        }))
        socket.on("data", data => {
          console.log(data)
          usePlaygroundStore.setState(cur => ({...cur, ...data}))
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

        console.log("PLAYGROUND UNMOUNTING")
        disconnect()
      };
    }
  }, [playgroundId, playground])


  if (!isLoaded) return <LoadingBackdrop/>

  return (
    <PlaygroundContext.Provider value={playground}>
      {props.children}
    </PlaygroundContext.Provider>
  )
}
