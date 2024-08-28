// Library imports
import {Stack} from "@mantine/core";

// Components
import {IconButton} from "./IconButton";

// Constants
import {EntityActions} from "./constants.ts";
import {objValuesToArray} from "@/utility/ObjectUtils.ts";
import {useEntities} from "@/hooks/Diagram/useEntities.ts";
import {memo} from "react";

export const EntityControls = memo(() => {
  const entities = useEntities()
  const isDisabled = entities.reduce((isDisabled, entity) => {
    const columns = objValuesToArray(entity.data.columns)
    const hasPrimary = columns.some(c => c.primary)

    if (hasPrimary) {
      return false
    }

    return isDisabled
  }, true)

  return (
    <Stack gap={"5px"} px={"5px"}>
      {EntityActions.map(action => <IconButton key={action.value} disabled={isDisabled} data={action}/>)}
    </Stack>
  )
})
