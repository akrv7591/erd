import React from "react";
import {ITableNodeColumn} from "@/types/table-node";
import {IconDiamondsFilled, IconKey} from "@tabler/icons-react";
import classes from "./style.module.css"
import {Tooltip} from "@mantine/core";

const ColumnTypeIcon = React.memo(({data}: { data: ITableNodeColumn }) => {

  if (data.primary) return (
    <Tooltip label={"Primary key"}>
      <IconKey style={{color: "#ffdc21"}} size={20}/>
    </Tooltip>
  )

  if (data.foreignKey) return (
    <Tooltip label={"Foreign key"}>
      <IconKey style={{color: "#f84219"}} size={20}/>
    </Tooltip>
  )

  return (
    <Tooltip label={"Default"}>
      <IconDiamondsFilled className={classes.defaultColumnIcon} size={20}/>
    </Tooltip>
  )
})


export default ColumnTypeIcon
