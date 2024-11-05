import {memo} from "react";
import {ActionIcon, Tooltip} from "@mantine/core";
import {IconPlus} from "@tabler/icons-react";
import {useModal} from "@/hooks";
import {ErdModal} from "@/screens/Library/Main/ErdModal";
import type {UserTeam} from "@/types/log-to/user-team.ts";
import type {Erd} from "@/types/data/db-model-interfaces.ts";

type Props = {
  team: UserTeam | null
}

export const CreateErdButton = memo(({team}: Props) => {
  const modal = useModal<Erd>({initialOpen: false, baseTitle: "Erd", initialType: "view"})
  const handleErdCreateClick = () => modal.open({type: "create", data: null})

  return (
    <>
      <ErdModal key={team ? team.id : null} {...modal.modalProps} />
      <Tooltip label={"Create erd"}>
        <ActionIcon size={"md"} variant={"default"} onClick={handleErdCreateClick}>
          <IconPlus stroke={1} size={15}/>
        </ActionIcon>
      </Tooltip>
    </>
  )
})
