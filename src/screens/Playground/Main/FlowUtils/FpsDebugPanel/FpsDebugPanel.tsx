import {memo} from "react";
import {useFps} from "react-fps";
import classes from "./style.module.css"
import {Text} from "@mantine/core";

export const FpsDebugPanel = memo(() => {
  const {currentFps} = useFps(20)
  return (
    <div className={classes.root}>
      <Text>FPS: {currentFps}</Text>
    </div>
  )
})
