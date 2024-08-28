import {memo} from "react";
import {FloatingCursor} from "@/screens/Playground/Header/PlayerAvatar/FloatingCursor";
import {useDiagramStore} from "@/contexts/DiagramContext";
import {useClient} from "@/hooks/Diagram/useClient.ts";
import {Client} from "@/types/playground";

const Cursor = (props: Client) => {
  const {data} = useClient(props.userId)

  if (!props.cursor) {
    return null
  }

  if (!data) {
    return null
  }

  return (
    <FloatingCursor
      x={props.cursor.x}
      y={props.cursor.y}
      name={data.name}
      color={props.color}
    />
  )
}

export const UserCursors = memo(() => {
  const clients = useDiagramStore(state => state.clients)

  return (
    clients.map(client => (
      <Cursor key={client.id} {...client}/>
    ))
  )
})
