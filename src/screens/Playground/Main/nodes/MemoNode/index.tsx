import {Box, Collapse, MantineProvider} from "@mantine/core";
import {NodeProps} from "@xyflow/react";
import classes from "./style.module.css"
import React from "react";
import {useHover} from "@mantine/hooks";
import {erdEntityTheme} from "@/config/theme.ts";
import TextareaAutosize from 'react-textarea-autosize';
import {MemoNodeData} from "@/stores/playground/memoStore.ts";
import {usePlaygroundStore} from "@/stores/usePlaygroundStore.ts";
import {MemoEnum} from "@/enums/playground.ts";
import Controls from "@/screens/Playground/Main/nodes/MemoNode/Header";

interface Props extends NodeProps<MemoNodeData> {
}

const MemoNode = React.memo((props: Props) => {
  const {hovered, ref} = useHover()
  const headersIn = props.selected || hovered
  const theme = React.useMemo(() => erdEntityTheme(props.data.color), [props.data.color])
  const playground = usePlaygroundStore(state => state.playground)
  const onPatch = React.useCallback((key: string, value: string) => {
    playground.memo(MemoEnum.patch, {memoId: props.id, key, value})
  }, [playground])

  if (!props.data) return null

  let className = classes.textInput

  if (!props.dragging && props.selected) {
    className = `${classes.textInputActive} nodrag nopan`
  }

  return (
    <MantineProvider
      defaultColorScheme={"dark"}
      theme={theme}
      cssVariablesSelector={`#${props.id}`}
      getRootElement={() => document.getElementById(props.id) || undefined}
    >
      <Box ref={ref} className={classes.box} id={props.id} onMouseDown={e => e.stopPropagation()}>
        <Collapse in={headersIn} transitionDuration={0}>
          <div className={classes.controls}>
            <Controls/>
          </div>
        </Collapse>
        <TextareaAutosize
          onMouseDown={e => e.preventDefault()}
          className={className}
          value={props.data.content}
          onChange={e => onPatch("content", e.target.value)}
          placeholder={"Memo"}
        />
      </Box>
    </MantineProvider>
  )
})

export default MemoNode
