import { memo, useCallback } from "react";
import { EntityData } from "@/types/diagram";
import { PlaygroundActionIcon } from "@/components/common/PlaygroundActionIcon";
import { IconTableOptions } from "@tabler/icons-react";
import { Portal, Tooltip } from "@mantine/core";
import { EntityConfigModal } from "./EntityConfigModal";
import { CustomTheme } from "@/components/common/CustomTheme";
import {useUser} from "@/hooks/useUser";
import {useModal} from "@/hooks/useModal";
import {useDiagramStore} from "@/hooks/useDiagramStore";

export const EntityConfig = memo(() => {
  const modal = useModal({
    baseTitle: "Default Entity Config",
    initialType: "view",
    initialOpen: false,
  });
  const { data: user } = useUser();
  const entityConfig = useDiagramStore(
    useCallback(
      (state) => state.configs.find((config) => config.userId === user.id),
      [user.id],
    ),
  );
  const setEntityConfig = useDiagramStore((state) => state.updateEntityConfig);
  const handleModalOpen = useCallback(() => {
    if (!entityConfig) {
      const initialConfig: EntityData & { userId: string } = {
        name: "Table",
        color: "#2190ff",
        columns: [],
        userId: user.id,
      };

      setEntityConfig(initialConfig);
    }

    modal.open();
  }, [entityConfig, user.id]);

  return (
    <>
      <Tooltip label={"Config your default entity"}>
        <PlaygroundActionIcon onClick={handleModalOpen}>
          <IconTableOptions />
        </PlaygroundActionIcon>
      </Tooltip>
      <Portal>
        <CustomTheme
          color={entityConfig ? entityConfig.color : "#2190ff"}
          id={user.id}
        >
          {entityConfig && (
            <EntityConfigModal
              {...modal.modalProps}
              configData={entityConfig}
              key={JSON.stringify(entityConfig)}
            />
          )}
        </CustomTheme>
      </Portal>
    </>
  );
});
