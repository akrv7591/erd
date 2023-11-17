import React from "react";
import {useLocation} from "react-router-dom";
import {ReactFlowProvider} from "reactflow";
import {IErd} from "../types/data/erd";
import {useOnMount} from "../hooks/useOnMount.ts";
import {MULTIPLAYER_SOCKET} from "../constants/multiplayer.ts";
import {useErdDiagramStore} from "../hooks/erd/useErdDiagramStore.ts";
import {useAuthStore} from "../stores/useAuthStore.ts";
import {ErdContext} from "../contexts/ErdContext.ts";


export default function ErdProvider(props: React.PropsWithChildren) {
  const erd = useLocation().state.erd as IErd
  const multiplayer = useErdDiagramStore(state => state.multiplayer)
  const user = useAuthStore(state => state.getAuthorization())
  const erdId = erd.id
  useOnMount(() => {
    multiplayer.off(erdId).on(MULTIPLAYER_SOCKET.NEW_USER_JOINED, newUser => {
      console.log("NEW_USER", newUser)
    })
    if (erdId) {
      multiplayer.emit(MULTIPLAYER_SOCKET.ON_JOIN_ROOM, erdId, user?.id, () => {
        console.log("USER JOINED")
      })
    }

    return () => {
      multiplayer.emit(MULTIPLAYER_SOCKET.ON_LEAVE_ROOM, erdId, user?.id, () => {
        console.log("USER LEFT")
      })
    }
  })

  return (
    <ErdContext.Provider value={erd}>
      <ReactFlowProvider>
        {props.children}
      </ReactFlowProvider>
    </ErdContext.Provider>
  )
}
