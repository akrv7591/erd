import {Viewport} from "@xyflow/react";
import {ServiceArgs} from "@/services/multiplayer/multiplayer";

export const playerService = ({store, reactFlow}: ServiceArgs) => {
  const set = store.setState
  const state = store.getState


  function onJoin(playerId: string) {
    set(state => ({
      players: [...state.players, {
        id: playerId,
        cursorPosition: null
      }]
    }))
  }

  function onLeave(playerId: string) {
    set(state => ({
      players: state.players.filter(({id}) => id !== playerId),
      ...state.subscribedTo && {
        subscribedTo: state.subscribedTo === playerId
          ? null
          : state.subscribedTo
      }
    }))
  }

  function onSubscribe(subscriberId: string) {
    set(state => ({subscribers: [...state.subscribers, subscriberId]}))
  }

  function onUnsubscribe(subscriberId: string) {
    set(state => ({subscribers: state.subscribers.filter((s) => s !== subscriberId)}))
  }

  function onViewportChange(viewport: Viewport) {
    if (state().subscribedTo) {
      reactFlow.setViewport(viewport)
    }
  }

  function onMouseChange({playerId, cursorPosition}: any) {
    set(state => ({
      players: state.players.map(player => player.id === playerId
        ? {...player, cursorPosition}
        : player
      )
    }))
  }

  return {
    onJoin,
    onLeave,
    onSubscribe,
    onUnsubscribe,
    onViewportChange,
    onMouseChange
  }

}
