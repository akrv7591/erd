//Library imports
import {Tooltip} from "@mantine/core";
import {FC, HTMLAttributes, useCallback} from "react";

// Type imports
import {EntityControl} from "../types";

//Component imports
import {PlaygroundActionIcon} from "@/components/common/PlaygroundActionIcon";
import {useDiagramStore} from "@/hooks";

interface Props {
  data: EntityControl;
  disabled?: boolean
}

type AdditionalProps = HTMLAttributes<HTMLButtonElement>

const DISABLED_LABEL = "Please add at least 2 table with primary keys"


export const IconButton: FC<Props> = ({data, disabled}) => {
  const tool = useDiagramStore(state => state.tool)
  const setTool = useDiagramStore(state => state.setTool)
  const isDisabled = disabled && !data.allowOnDisabled
  const tooltipLabel = isDisabled ? DISABLED_LABEL : data.label
  const isSelected = tool === data.value

  const getAdditionalProps = useCallback((): Partial<AdditionalProps> => {
    if (!data.type) {
      return {
        onClick: () => setTool(data.value)
      }
    } else {
      return {
        draggable: true,
        onDragStart: (event) => {
          event.dataTransfer.setData('application/reactflow', data.type!);
          event.dataTransfer.effectAllowed = 'move';
        },
      }
    }

  }, [data])


  return (
    <Tooltip withArrow position={"right"} label={tooltipLabel}>
      <PlaygroundActionIcon
        disabled={isDisabled}
        variant={isSelected ? "light" : "default"}
        {...getAdditionalProps()}
      >
        <data.icon/>
      </PlaygroundActionIcon>
    </Tooltip>
  )
}
