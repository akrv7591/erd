import React from "react";
import {ITableNodeColumn} from "@/types/table-node";
import {IconDiamondsFilled, IconKey} from "@tabler/icons-react";
import classes from "./style.module.css"

const ColumnTypeIcon = React.memo(({data}: { data: ITableNodeColumn }) => {

  if (data.primary) return <IconKey stroke={2} color={"#ffcd62"} size={20}/>

  if (data.foreignKey) return <IconDiamondsFilled style={{color: "#f84219"}} size={20}/>

  return <IconDiamondsFilled className={classes.defaultColumnIcon} size={20}/>
})


export default ColumnTypeIcon
