// Library imports
import {useMemo} from "react";
import {Stack} from "@mantine/core";
import {useShallow} from "zustand/react/shallow";

// Custom hooks
import {usePlayground} from "@/contexts/playground/PlaygroundStoreContext.ts";

// Components
import {IconButton} from "./IconButton";

// Constants
import {EntityActions, selector} from "./constants.ts";

export const EntityControls = () => {
  const {entities} = usePlayground(useShallow(selector))
  const disabled = useMemo(() => {
    return entities.reduce((count, entity) => {
      const hasPrimary = entity.data.columns.some(c => c.primary)

      return count + (hasPrimary ? 1 : 0)
    }, 0) < 2
  }, [entities])

  return (
    <Stack gap={"5px"} px={"5px"}>
      {EntityActions.map(action => <IconButton key={action.value} disabled={disabled} data={action}/>)}
    </Stack>
  )
}
