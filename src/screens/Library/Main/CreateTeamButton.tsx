import {memo} from "react";
import {IErd, ITeam} from "@/types/data/db-model-interfaces.ts";
import {ActionIcon, Tooltip} from "@mantine/core";
import {IconPlus} from "@tabler/icons-react";
import {useModal} from "@/hooks/useModal.ts";
import ErdModal from "@/screens/Library/Main/ErdModal";

type Props = {
  team: ITeam | null
}

export const CreateTeamButton = memo(({team}: Props) => {
  const modal = useModal<IErd>({initialOpen: false, baseTitle: "Erd", initialType: "view"})
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
