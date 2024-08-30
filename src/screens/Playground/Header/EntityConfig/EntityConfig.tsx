import {memo, useCallback} from "react";
import {PlaygroundActionIcon} from "@/components/common/PlaygroundActionIcon";
import {IconTableOptions} from "@tabler/icons-react";
import {Tooltip} from "@mantine/core";
import {useModal} from "@/hooks/useModal.ts";
import {EntityConfigModal} from "@/screens/Playground/Header/EntityConfig/EntityConfigModal";
import {useSharedDiagramStore} from "@/contexts/SharedDiagramContext.ts";
import {DefaultEntityConfig} from "@/stores/shared-diagram-store/stores/erdStore.ts";
import {useAuthStore} from "@/stores/useAuthStore.ts";
import {SharedDiagramStore} from "@/stores/shared-diagram-store";

export const EntityConfig = memo(() => {
  const modal = useModal({
    baseTitle: "Default Entity Config",
    initialType: "view",
    initialOpen: false,
  })
  const user = useAuthStore(state => state.user)
  const configSelector = useCallback((state: SharedDiagramStore) => state.entityConfigs[user.id], [])
  const entityConfig = useSharedDiagramStore(configSelector)
  const setEntityConfig = useSharedDiagramStore(state => state.setEntityConfig)
  const handleModalOpen = useCallback(() => {
    if (!entityConfig) {
      const initialConfig: DefaultEntityConfig = {
        name: "Table",
        color: "#2190ff",
        columns: []
      }

      setEntityConfig(user.id, initialConfig)
    }

    modal.open()

  }, [entityConfig])

  return (
    <>
      {entityConfig && (
        <EntityConfigModal {...modal.modalProps} configData={entityConfig}/>
      )}
      <Tooltip label={"Config your default entity"}>
        <PlaygroundActionIcon onClick={handleModalOpen}>
          <IconTableOptions/>
        </PlaygroundActionIcon>
      </Tooltip>
    </>
  )
})
