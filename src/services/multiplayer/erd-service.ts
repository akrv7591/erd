import {MultiplayerService} from "@/services/multiplayer/type";
import {CallbackDataStatus, ErdEnum} from "@/enums/playground.ts";

export const erdService: MultiplayerService = ({store, socket}) => {
  const set = store.setState

  socket.on(ErdEnum.put, (data, callback) => {
    try {
      set(state => ({...state, ...data}))
    } catch (e) {
      console.error(ErdEnum.put, e)
      callback(CallbackDataStatus.FAILED)
    }
  })

  socket.on(ErdEnum.patch, (data, callback) => {
    try {
      set(state => ({...state, ...{[data.key]: data.value}}))
    } catch (e) {
      console.error(ErdEnum.patch, e)
      callback(CallbackDataStatus.FAILED)
    }
  })
}
