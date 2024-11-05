import {memo} from "react";
import {FloatingCursor} from "@/screens/Playground/Header/PlayerAvatar/FloatingCursor";
import {useDiagramStore} from "@/hooks";
import {useClient} from "@/hooks";
import {Client} from "@/types/diagram";
import { useReactFlow } from "@xyflow/react";

const Cursor = (props: Client) => {
  const {data} = useClient(props.userId)
  const reactflow = useReactFlow()

  if (!props.cursor) {
    return null
  }

  if (!data) {
    return null
  }

  const converted = reactflow.flowToScreenPosition(props.cursor)

  return (
    <FloatingCursor
      x={converted.x}
      y={converted.y}
      name={data.name}
      color={props.color}
    />
  )
}

export const UserCursors = memo(() => {
  const clients = useDiagramStore(state => state.clients)

  return (
    clients.map(client => (
      <Cursor key={client.peerId} {...client}/>
    ))
  )
})
