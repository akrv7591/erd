import {ActionIcon, Tooltip} from "@mantine/core";
import {usePlaygroundStore} from "@/stores/usePlaygroundStore.ts";
import {useAuthStore} from "@/stores/useAuthStore.ts";
import {Player} from "@/enums/playground.ts";
import {LivePlayer} from "@/types/entity-node";
import classes from "./style.module.css"

interface Props {
  player: LivePlayer
}

export default function PlayerAvatar(props: Props) {
  const subscribedTo = usePlaygroundStore(state => state.subscribedTo)
  const playground = usePlaygroundStore(state => state.playground)
  const authorizedUser = useAuthStore(state => state.getAuthorization())
  const isSubscribedPlayer = subscribedTo?.id === props.player.id
  const tooltipLabel = isSubscribedPlayer
    ? `Click on diagram plane to exit follow mode`
    : props.player.id === authorizedUser?.id
      ? `You`
      : `Subscribe to ${props.player.name}`
  const isDisabled = isSubscribedPlayer || props.player.id === authorizedUser?.id

  return (
    <Tooltip label={tooltipLabel} {...isSubscribedPlayer && {opened: true}}>
      <ActionIcon
        className={ isSubscribedPlayer ? classes.avatarSubscribed : classes.avatar}
        size={"lg"}
        radius={"xl"}
        variant={"default"}
        onClick={() => playground.player(Player.subscribe, props.player)}
        disabled={isDisabled}

      >
        {props.player.name[0]}
      </ActionIcon>
    </Tooltip>
  )
}
