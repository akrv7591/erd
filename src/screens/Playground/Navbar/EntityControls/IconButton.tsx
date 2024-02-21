import {ActionIcon, Tooltip} from "@mantine/core";
import {IData} from "@/screens/Playground/Navbar/EntityControls";
import {usePlaygroundStore} from "@/stores/usePlaygroundStore.ts";

interface Props {
  data: IData;
  disabled?: boolean
}

const DISABLED_LABEL = "Please add at least 2 table with primary keys"


export default function IconButton({data, disabled}: Props) {
  const tool = usePlaygroundStore(state => state.tool)
  const setTool = usePlaygroundStore(state => state.setTool)
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
      <ActionIcon
        variant={isSelected ? "light" : "default"}
        w={"40px"}
        h={"40px"}
        style={{border: "none"}}
        disabled={isDisabled}
        {...buttonProps()}
      >
        <data.icon/>
      </ActionIcon>
    </Tooltip>

  )
}
