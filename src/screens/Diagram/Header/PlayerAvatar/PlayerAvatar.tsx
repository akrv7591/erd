import { Avatar, Tooltip } from "@mantine/core";
import classes from "./style.module.css";
import { memo, useCallback, useMemo } from "react";
import { IconUser } from "@tabler/icons-react";
import { Client } from "@/types/diagram";
import { useClient, useDiagramStore } from "@/hooks";

interface Props {
  client: Client;
}

export const PlayerAvatar = memo((props: Props) => {
  const { data } = useClient(props.client.userId);
  const subscribe = useDiagramStore((state) => state.subscribe);
  const subscribedTo = useDiagramStore((state) => state.subscribedTo);
  const isFollowing = useMemo(() => {
    return subscribedTo === props.client.id
  }, [subscribedTo, props.client])

  const handleSubscribe: React.MouseEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      if (isFollowing) {
        return
      }

      e.stopPropagation();
      e.preventDefault();
      subscribe(props.client.id);
    },
    [subscribe, props.client, isFollowing],
  );

  const tooltipLabel = useMemo(() => {
    if (!data) {
      return "";
    }
    if (isFollowing) {
      return `Following ${data.name}`;
    }

    return `Follow ${data.name}`;
  }, [isFollowing, data]);

  const { color } = props.client;

  if (!data) {
    return null;
  }

  return (
    <Tooltip label={tooltipLabel}>
      <Avatar
        size={30}
        radius={"xl"}
        src={data.avatar || null}
        alt={"user-avatar"}
        color={color}
        classNames={{
          root: classes.root,
        }}
        styles={{
          root: {
            outlineColor: color,
            cursor: isFollowing? "not-allowed": "pointer"
          },
        }}
        onClick={handleSubscribe}
      >
        <IconUser size={15} />
      </Avatar>
    </Tooltip>
  );
});
