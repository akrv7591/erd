// Library imports
import {Stack} from "@mantine/core";

// Components
import {IconButton} from "./IconButton";

// Constants
import {EntityActions} from "./constants.ts";
import {useEntities} from "@/hooks";
import {memo} from "react";

export const EntityControls = memo(() => {
  const entities = useEntities()
  const isDisabled = !entities.some(entity => entity.data.columns.some(column => column.primary))

  return (
    <Stack gap={"5px"} px={"5px"}>
      {EntityActions.map(action => <IconButton key={action.value} disabled={isDisabled} data={action}/>)}
    </Stack>
  )
})
