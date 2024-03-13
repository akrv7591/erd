import {usePlaygroundStore} from "@/stores/usePlaygroundStore.ts";
import {Viewport} from "@xyflow/react";
import {LivePlayer} from "@/types/entity-node";
import {notifications} from "@mantine/notifications";

export const playerService = () => {

  function onJoin(player: LivePlayer) {
    usePlaygroundStore.setState(state => state.players.some(({id}) => id === player.id) ? {} : {players: [...state.players, player]})
  }

  function onLeave(playerId: string) {
    usePlaygroundStore.setState(state => ({players: state.players.filter(({id}) => id !== playerId), ...state.subscribedTo && {subscribedTo: state.subscribedTo.id === playerId ? null : state.subscribedTo}}))
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
    usePlaygroundStore.setState(state => ({
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
