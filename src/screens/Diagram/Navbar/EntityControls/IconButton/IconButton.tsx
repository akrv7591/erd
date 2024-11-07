//Library imports
import {Tooltip} from "@mantine/core";
import {FC} from "react";

// Type imports
import {EntityControl} from "../types";

//Component imports
import {PlaygroundActionIcon} from "@/components/common/PlaygroundActionIcon";
import {useDiagramStore} from "@/hooks";


interface Props {
  data: EntityControl;
  disabled?: boolean
}

const DISABLED_LABEL = "Please add at least 2 table with primary keys"


export const IconButton: FC<Props> = ({data, disabled}) => {
  const tool = useDiagramStore(state => state.tool)
  const setTool = useDiagramStore(state => state.setTool)
  const isDisabled = disabled && !data.allowOnDisabled
  const tooltipLabel = isDisabled ? DISABLED_LABEL : data.label
  const isSelected = tool === data.value

  const buttonProps = () => {
    if (data.onDragStart) {
      return {
        onDragStart: data.onDragStart,
        draggable: true
      }
    }

    return {
      onClick: () => setTool(data.value),
    }
  }


  return (
    <Tooltip withArrow position={"right"} label={tooltipLabel}>
      <PlaygroundActionIcon
        disabled={isDisabled}
        variant={isSelected ? "light" : "default"}
        {...buttonProps()}
      >
        <data.icon/>
      </PlaygroundActionIcon>
    </Tooltip>

  )
}
