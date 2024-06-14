import {MultiplayerService} from "@/services/multiplayer/type";
import {CallbackDataStatus, WorkerEnum} from "@/enums/playground.ts";

export const workerService: MultiplayerService = ({store, socket}) => {
  const set = store.setState

  socket.on(WorkerEnum.join, (data, callback) => {
    try {
      set(state => ({
        players: [...state.players, {...data, cursorPosition: null}]
      }))
      callback(CallbackDataStatus.OK)
    } catch (e) {
      console.error(WorkerEnum.join, e)
      callback(CallbackDataStatus.FAILED)
    }
  })

  socket.on(WorkerEnum.leave, (data, callback) => {
    try {
      set(state => ({
        players: state.players.filter(({id}) => id !== data.id),
        ...state.subscribedTo && {
          subscribedTo: state.subscribedTo === data.id
            ? null
            : state.subscribedTo
        }
      }))
      callback(CallbackDataStatus.OK)
    } catch (e) {
      console.error(WorkerEnum.leave, e)
      callback(CallbackDataStatus.FAILED)
    }
  })

  socket.on(WorkerEnum.data, (data, callback) => {
    try {
      set({...data, connected: true})
      callback(CallbackDataStatus.OK)
    } catch (e) {
      console.error(WorkerEnum.data, e)
      callback(CallbackDataStatus.FAILED)
    }
  })
}
