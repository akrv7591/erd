import React from "react";
import {IconDiamondsFilled, IconKey} from "@tabler/icons-react";
import classes from "./style.module.css"
import {Tooltip} from "@mantine/core";
import {EntityColumn} from "@/types/diagram";

export const TypeIcon = React.memo(({data}: { data: Pick<EntityColumn, 'primary' | 'foreignKey'> }) => {

  if (data.primary) return (
    <Tooltip label={"Primary key"}>
      <IconKey className={classes.primary} size={20}/>
    </Tooltip>
  )

  if (data.foreignKey) return (
    <Tooltip label={"Foreign key"}>
      <IconKey className={classes.foreign} size={20}/>
    </Tooltip>
  )

  return (
    <Tooltip label={"Default"}>
      <IconDiamondsFilled className={classes.default} size={20}/>
    </Tooltip>
  )
})
