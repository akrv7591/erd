import {Avatar, Popover, Text, Tooltip} from "@mantine/core";
import {useAuthStore} from "@/stores/useAuthStore.ts";
import classes from "./style.module.css"
import {useDisclosure} from "@mantine/hooks";
import {memo, useCallback, useEffect, useMemo} from "react";
import {useQuery} from "@tanstack/react-query";
import {userWithProfileApi} from "@/api/user.ts";
import {Player} from "@/types/playground";
import {FloatingCursor} from "./FloatingCursor";
import {IconUser} from "@tabler/icons-react";
import {usePlayground} from "@/contexts/playground/PlaygroundStoreContext.ts";

interface Props {
  player: Player
}

export const PlayerAvatar = memo((props: Props) => {
  const subscribedTo = usePlayground(state => state.subscribedTo)
  const subscribers = usePlayground(state => state.subscribers)
  const playground = usePlayground(state => state.playground)
  const user = useAuthStore(state => state.user)
  const [opened, {close, open}] = useDisclosure(false)
  const {data} = useQuery({
    queryKey: ["player-avatar", props.player.id],
    queryFn: () => userWithProfileApi(props.player.id),
  })

  const isFollowing = useMemo(() => subscribers?.some(subscriber => subscriber === props.player.id), [subscribers])
  const isSubscribedPlayer = subscribedTo === props.player.id
  const isYou = props.player.id === user.id
  const showFloatingCursor = data && !isYou


  const tooltipLabel = isSubscribedPlayer
    ? `Click on diagram plane to exit follow mode`
    : isFollowing
      ? "You can't follow who is already following you"
      : `Follow ${data?.name}`
  const isDisabled = isSubscribedPlayer || props.player.id === user.id
  const onSubscribe = useCallback(() => {
    if (!isFollowing && !isDisabled) {
      playground.handlePlayerSubscribe(props.player.id)
    }
  }, [isFollowing, isDisabled, playground])

  useEffect(() => {
    if (isFollowing) {
      open()

      setTimeout(() => {
        close()
      }, 3000)
    }
  }, [isFollowing])


  return (
    <>
      {showFloatingCursor && <FloatingCursor data={{...data, cursorPosition: props.player.cursorPosition}}/>}
      <Popover withArrow opened={opened}>
        <Popover.Target>
          <Tooltip hidden={isYou} label={tooltipLabel} {...isSubscribedPlayer && {opened: true}}>
            <Avatar
              size={30}
              src={data?.profile?.image?.url || null}
              alt={"user-avatar"}
              onClick={onSubscribe}
              className={isSubscribedPlayer ? classes.avatarSubscribed : classes.avatar}
            >
              <IconUser size={15}/>
            </Avatar>
          </Tooltip>
        </Popover.Target>
        <Popover.Dropdown p={"xs"}>
          <Text className={classes.followingText}>
            {data?.name} <br/> following
          </Text>
        </Popover.Dropdown>
      </Popover>
    </>

  )
})
