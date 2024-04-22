import {usePlaygroundStore} from "@/stores/usePlaygroundStore.ts";
import {Viewport} from "@xyflow/react";

export const playerService = () => {
  const set = usePlaygroundStore.setState

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
    set(cur => ({subscribers: cur.subscribers.filter((s) => s !== subscriberId)}))
  }

  function onViewportChange(viewport: Viewport) {
    set(({viewport}))
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
