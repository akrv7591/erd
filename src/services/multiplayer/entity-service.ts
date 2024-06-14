import {MultiplayerService} from "@/services/multiplayer/type";
import {CallbackDataStatus, EntityEnum} from "@/enums/playground.ts";

export const entityService: MultiplayerService = ({store, socket}) => {
  const set = store.setState

  socket.on(EntityEnum.patch, (data, callback) => {
    try {
      set(cur => ({
        nodes: cur.nodes.map(entity => entity.id === data.entityId ? {
          ...entity,
          data: {...entity.data, [data.key]: data.value}
        } : entity)
      }))
      callback(CallbackDataStatus.OK)
    } catch (e) {
      console.error(EntityEnum.patch, e)
      callback(CallbackDataStatus.FAILED)
    }
  })
}
