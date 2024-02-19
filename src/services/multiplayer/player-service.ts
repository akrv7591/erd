import {usePlaygroundStore} from "@/stores/usePlaygroundStore.ts";
import {Viewport} from "@xyflow/react";
import {IPlayer} from "@/types/table-node";
import {notifications} from "@mantine/notifications";

export const playerService = () => {

  function onJoin(player: IPlayer) {
    usePlaygroundStore.setState(cur => cur.players.some(({id}) => id === player.id) ? {} : {players: [...cur.players, player]})
  }

  function onLeave(playerId: string) {
    usePlaygroundStore.setState(cur => ({players: cur.players.filter(({id}) => id !== playerId), ...cur.subscribedTo && {subscribedTo: cur.subscribedTo.id === playerId ? null : cur.subscribedTo}}))
  }

  function onSubscribe(subscriberId: string) {
    const subscriber = usePlaygroundStore.getState().players.find(({id}) => id === subscriberId)

    if (!subscriber) {
      return
    }

    notifications.show({
      title: "New follower",
      message: `${subscriber.name} is following you!`,
      color: "var(--mantine-color-orange-filled)",
    })
    usePlaygroundStore.setState(cur => cur.subscribers.includes(subscriberId) ? {} : {subscribers: [...cur.subscribers, subscriberId]})
  }

  function onUnsubscribe(subscriberId: string) {
    const subscriber = usePlaygroundStore.getState().players.find(({id}) => id === subscriberId)

    if (!subscriber) {
      return
    }

    notifications.show({
      title: "Follower left",
      message: `${subscriber.name} is no longer following you!`,
      color: "var(--mantine-color-orange-filled)"
    })
    usePlaygroundStore.setState(cur => ({subscribers: cur.subscribers.filter((s) => s !== subscriberId)}))
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
