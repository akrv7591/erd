import {Avatar, Tooltip} from "@mantine/core";
import {usePlaygroundStore} from "@/stores/usePlaygroundStore.ts";
import {useAuthStore} from "@/stores/useAuthStore.ts";
import {Player} from "@/enums/playground.ts";
import {IPlayer} from "@/types/table-node";

interface Props {
  player: IPlayer
}

export default function PlayerAvatar(props: Props) {
  const subscribedTo = usePlaygroundStore(state => state.subscribedTo)
  const playground = usePlaygroundStore(state => state.playground)
  const authorizedUser = useAuthStore(state => state.getAuthorization())
  const isSubscribedPlayer = subscribedTo?.id === props.player.id
  const avatarStyle = isSubscribedPlayer ? {border: "1px solid var(--mantine-primary-color-filled)", zIndex: 1} : {}
  const tooltipLabel = isSubscribedPlayer
    ? `Click on diagram plane to exit follow mode`
    : props.player.id === authorizedUser?.id
      ? `You`
      : `Subscribe to ${props.player.name}`
  const isDisabled = isSubscribedPlayer || props.player.id === authorizedUser?.id

  return (
    <Tooltip label={tooltipLabel} {...isSubscribedPlayer&&{ opened: true }}>
      <Avatar
        style={avatarStyle}
        component={'button'}
        onClick={() => playground.player(Player.subscribe, props.player)}
        disabled={isDisabled}
      >
        {props.player.name[0]}
      </Avatar>
    </Tooltip>
  )
}
