import {Tooltip} from "@mantine/core";
import {Link} from "react-router-dom";
import {IconDoorExit} from "@tabler/icons-react";
import {PlaygroundActionIcon} from "@/components/common/PlaygroundActionIcon";

export const ExitButton = () => {
  return (
    <Tooltip label={"Exit"} position={"left"}>
      <Link to={"/library"}>
        <PlaygroundActionIcon>
          <IconDoorExit color={"var(--mantine-color-text)"}/>
        </PlaygroundActionIcon>
      </Link>
    </Tooltip>
  )
}
