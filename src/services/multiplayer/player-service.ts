import {usePlaygroundStore} from "@/stores/usePlaygroundStore.ts";
import {Viewport} from "@xyflow/react";
import {IPlayer} from "@/types/table-node";

export const playerService = () => {

  function onJoin(player: IPlayer) {
    usePlaygroundStore.setState(cur => cur.players.some(({id}) => id === player.id) ? {} : {players: [...cur.players, player]})
  }

  function onLeave(playerId: string) {
    usePlaygroundStore.setState(cur => ({players: cur.players.filter(({id}) => id !== playerId), ...cur.subscribedTo && {subscribedTo: cur.subscribedTo.id === playerId ? null : cur.subscribedTo}}))
  }

  function onSubscribe(subscriber: IPlayer) {
    usePlaygroundStore.setState(cur => cur.subscribers.some(s => s.id === subscriber.id) ? {} : {subscribers: [...cur.subscribers, subscriber]})
  }

  function onUnsubscribe(subscriber: IPlayer) {
    usePlaygroundStore.setState(cur => ({subscribers: cur.subscribers.filter((s) => s.id !== subscriber.id)}))
  }

  function onViewportChange(viewport: Viewport) {
    usePlaygroundStore.setState(({viewport}))
  }

  function onMouseChange({playerId, cursorPosition}: any) {
    usePlaygroundStore.setState(cur => ({
      players: cur.players.map(p => p.id === playerId ? {
        ...p,
        cursorPosition
      } : p)
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
