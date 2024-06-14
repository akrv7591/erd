import {MultiplayerService} from "@/services/multiplayer/type";
import {CallbackDataStatus, MemoEnum} from "@/enums/playground.ts";

export const memoService: MultiplayerService = ({store, socket}) => {
  const set = store.setState

  socket.on(MemoEnum.patch, (data, callback) => {
    try {
      set(cur => ({
        nodes: cur.nodes.map(memo => memo.id === data.memoId ? {
          ...memo,
          data: {...memo.data, [data.key]: data.value}
        } : memo)
      }))
      callback(CallbackDataStatus.OK)
    } catch (e) {
      console.error(MemoEnum.patch, e)
      callback(CallbackDataStatus.FAILED)
    }
  })
}
