import {memo, useCallback,} from "react";
import {useDiagramStore} from "@/hooks";
import {EntityData} from "@/types/diagram";
import {PlaygroundActionIcon} from "@/components/common/PlaygroundActionIcon";
import {IconTableOptions} from "@tabler/icons-react";
import {Tooltip} from "@mantine/core";
import {useModal} from "@/hooks";
import {EntityConfigModal} from "./EntityConfigModal";
import {useUser} from "@/hooks";
import {CustomTheme} from "@/components/common/CustomTheme";

export const EntityConfig = memo(() => {
  const modal = useModal({
    baseTitle: "Default Entity Config",
    initialType: "view",
    initialOpen: false,
  })
  const { data: user } = useUser()
  const entityConfig = useDiagramStore(useCallback(state => state.configs.find(config => config.userId === user.id), [user.id]))
  const setEntityConfig = useDiagramStore(state => state.setConfig)
  const handleModalOpen = useCallback(() => {
    if (!entityConfig) {
      const initialConfig: EntityData & { userId: string } = {
        name: "Table",
        color: "#2190ff",
        columns: [],
        userId: user.id
      }

      setEntityConfig(initialConfig)
    }

    modal.open()

  }, [entityConfig, user.id])

  return (
    <CustomTheme color={entityConfig? entityConfig.color : "#2190ff"} id={user.id}>
      {entityConfig && (
        <EntityConfigModal {...modal.modalProps} configData={entityConfig}/>
      )}
        <Tooltip label={"Config your default entity"}>
          <PlaygroundActionIcon onClick={handleModalOpen}>
            <IconTableOptions/>
          </PlaygroundActionIcon>
        </Tooltip>
    </CustomTheme>
  )
})
