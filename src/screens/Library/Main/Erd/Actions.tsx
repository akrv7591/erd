import {IErd} from "@/types/data/db-model-interfaces";
import {ActionIcon, Group, Tooltip} from "@mantine/core";
import {IconExclamationCircle, IconSettings, IconTrash} from "@tabler/icons-react";
import {ROLE} from "@/enums/role.ts";
import {IUseModalType} from "@/hooks/useModal.ts";
import {MouseEventHandler} from "react";
import {useQuery} from "@tanstack/react-query";
import {userTeamApi} from "@/api/team.ts";

interface Props {
  erd: IErd
  modal: IUseModalType
}


export default function Actions(props: Props) {
  const {data: permission} = useQuery({
    queryKey: [`userTeam:${props.erd.teamId}`],
    queryFn: () => userTeamApi(props.erd.teamId)
  })
  const onDelete: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation()
    props.modal.open("delete")
  }

  const onUpdate: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation()
    props.modal.open("update")
  }

  if (!permission) return (
    <Tooltip label={"Not found"}>
      <IconExclamationCircle/>
    </Tooltip>
  )

  const actions = []

  switch (permission.role) {
    case ROLE.ADMIN:
      actions.push(
        <Tooltip key={"setting"} label={`Open ${props.erd.name} settings`}>
          <ActionIcon size={"sm"} variant={"default"} bg={"transparent"} onClick={onUpdate}>
            <IconSettings/>
          </ActionIcon>
        </Tooltip>
      )

      actions.push(
        <Tooltip key={"delete"} label={`Delete ${props.erd.name}`}>
          <ActionIcon size={"sm"} variant={"default"} bg={"transparent"} onClick={onDelete}>
            <IconTrash/>
          </ActionIcon>
        </Tooltip>
      )
      break

    case ROLE.WRITE:
      actions.push(
        <Tooltip key={"setting"} label={`Open ${props.erd.name} settings`}>
          <ActionIcon size={"sm"} variant={"default"} bg={"transparent"} onClick={onUpdate}>
            <IconSettings/>
          </ActionIcon>
        </Tooltip>
      )
  }

  return (
    <Group>
      {actions}
    </Group>
  )
}

