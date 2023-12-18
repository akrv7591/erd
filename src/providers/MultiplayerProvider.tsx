import React, {PropsWithChildren} from "react";
import {connect} from "socket.io-client";
import LoadingBackdrop from "../components/common/LoadingBackdrop.tsx";
import {MultiplayerContext} from "../contexts/MultiplayerContext.ts";
import {MultiplayerService} from "../services/multiplayer/MultiplayerService.ts";
import {useAuthStore} from "../stores/useAuthStore.ts";
import {useParams} from "react-router-dom";
import {useErdDiagramStore} from "../stores/useErdDiagramStore.ts";

export default function MultiplayerProvider(props: PropsWithChildren) {
  const [multiplayer, setMultiplayer] = React.useState<MultiplayerService | null>(null)
  const userId = useAuthStore(state => state.getAuthorization()!.id)
  const resetFlow = useErdDiagramStore(state => state.reset)
  const erdId = useParams<{ erdId: string }>().erdId!

  React.useEffect(() => {
    if (!multiplayer) {
      const socket = connect(import.meta.env.VITE_BASE_URL)
      socket.on("connect", () => {
        const multiplayer = new MultiplayerService(socket, erdId)

        setMultiplayer(multiplayer)
      })
    } else {
      multiplayer.joinRoom(userId)
      // Function to execute before page unload
      const handleBeforeUnload = () => {
        multiplayer.leaveRoom(userId)
        console.log("LEAVING A ROOM")
        resetFlow()
        setMultiplayer(null)
      };

      window.addEventListener('beforeunload', handleBeforeUnload);

      // Cleanup function
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
        console.log("UNMOUNTING")
        handleBeforeUnload()
      };
    }

  }, [multiplayer, erdId])


  if (!multiplayer) return <LoadingBackdrop/>

  return (
    <MultiplayerContext.Provider value={multiplayer}>
      {props.children}
    </MultiplayerContext.Provider>
  )
}
