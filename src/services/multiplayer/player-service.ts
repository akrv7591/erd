import {MultiplayerService} from "@/services/multiplayer/type";
import {CallbackDataStatus, PlayerEnum} from "@/enums/playground.ts";

export const playerService: MultiplayerService = ({store, reactFlow, socket}) => {
  const set = store.setState
  const state = store.getState

  socket.on(PlayerEnum.subscribe, (data, callback) => {
    try {
      set(state => ({subscribers: [...state.subscribers, data.playerId]}))
      callback(CallbackDataStatus.OK)
    } catch (e) {
      console.error(PlayerEnum.subscribe, e)
      callback(CallbackDataStatus.FAILED)
    }
  })

  socket.on(PlayerEnum.unsubscribe, (data, callback) => {
    try {
      set(state => ({subscribers: state.subscribers.filter((s) => s !== data.playerId)}))
      callback(CallbackDataStatus.OK)
    } catch (e) {
      console.error(PlayerEnum.unsubscribe, e)
      callback(CallbackDataStatus.FAILED)
    }
  })

  socket.on(PlayerEnum.viewportChange, (data, callback) => {

    try {
      if (!state().subscribedTo) return

      if (!data.viewpoint) return

      reactFlow.setViewport(data.viewpoint)
      callback(CallbackDataStatus.OK)
    } catch (e) {
      console.error(PlayerEnum.viewportChange, e)
      callback(CallbackDataStatus.FAILED)
    }
  })

  socket.on(PlayerEnum.mouseChange, (data, callback) => {
    try {
      set(state => ({
        players: state.players.map(player => player.id === data.playerId
          ? {...player, cursorPosition: data.cursorPosition }
          : player
        )
      }))
      callback(CallbackDataStatus.OK)
    } catch (e) {
      console.error(PlayerEnum.mouseChange, e)
      callback(CallbackDataStatus.FAILED)
    }
  })
}
