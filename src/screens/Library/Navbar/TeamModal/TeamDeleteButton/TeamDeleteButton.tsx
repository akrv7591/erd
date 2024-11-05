import {memo} from "react";
import {ButtonWithConfirm} from "@/components/common/ButtonWithConfirm";
import {Button, Group} from "@mantine/core";
import {IconTrash} from "@tabler/icons-react";
import {useUserTeam} from "@/hooks";

interface Props {
  onDelete: () => void
}

export const TeamDeleteButton = memo(({onDelete}: Props) => {
  const {team, isOwner} = useUserTeam()

  if (!isOwner) {
    return null
  }

  return (
    <Group w={"100%"} justify={"flex-end"}>
      <ButtonWithConfirm
        tooltip={"Delete team"}
        withinPortal
        position={"top"}
        isDanger
        target={(
          <Button
            leftSection={<IconTrash/>}
            color={"var(--mantine-color-red-filled)"}
            variant={"filled"}
            size={"xs"}
          >
            Delete
          </Button>
        )}
        message={`Do you really want to delete ${team.name} team`}
        onConfirm={onDelete}
      />
    </Group>
  )
})
