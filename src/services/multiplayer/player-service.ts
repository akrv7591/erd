import {IPlayer, useErdDiagramStore} from "@/stores/useErdDiagramStore.ts";
import {IUser} from "@/types/data/user";
import {Viewport} from "reactflow";

export const playerService = () => {

  function onJoin(player: IPlayer) {
    useErdDiagramStore.setState(cur => cur.players.some(({id}) => id === player.id)? {}: {players: [...cur.players, player]})
  }
  function onLeave(playerId: string) {
    useErdDiagramStore.setState(cur => ({players: cur.players.filter(({id}) => id !== playerId)}))
  }
  function onSubscribe(subscriber: IUser) {
    console.log({subscriber: subscriber})
    useErdDiagramStore.setState(cur => cur.subscribers.some(s => s.id === subscriber.id)? {}: {subscribers: [...cur.subscribers, subscriber]})
  }
  function onUnsubscribe(subscriber: IUser) {
    useErdDiagramStore.setState(cur => ({subscribers: cur.subscribers.filter((s) => s.id !== subscriber.id)}))
  }
  function onViewportChange(viewport: Viewport) {
    console.log({viewport})
    useErdDiagramStore.setState(({viewport}))
  }
  function onMouseChange({playerId, cursorPosition}: any) {
    console.log({cursorPosition})
    useErdDiagramStore.setState(cur => ({players: cur.players.map(p => p.id === playerId? {...p, cursorPosition }: p)}))
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
