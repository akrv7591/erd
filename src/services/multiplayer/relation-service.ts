import {Edge} from "@xyflow/react";
import {MultiplayerService} from "@/services/multiplayer/type";
import {CallbackDataStatus, RelationEnum} from "@/enums/playground.ts";

export const relationService: MultiplayerService = ({socket, store}) => {
  const set = store.setState

  socket.on(RelationEnum.add, (data, callback) => {
    try {
      const relation: Edge = {
        id: data.relation.id,
        source: data.relation.source,
        target: data.relation.target,
        markerEnd: data.relation.markerEnd
      }

      set(cur => ({relations: [...cur.relations, relation]}))
    } catch (e) {
      console.error(RelationEnum.add, e)
      callback(CallbackDataStatus.FAILED)
    }
  })

  socket.on(RelationEnum.delete, (data, callback) => {
    try {
      set(cur => ({relations: cur.relations.filter(t => !data.relationId.includes(t.id))}))
    } catch (e) {
      console.error(RelationEnum.delete, e)
      callback(CallbackDataStatus.FAILED)
    }
  })
}
