import {MantineProvider} from "@mantine/core";
import {NodeProps} from "@xyflow/react";
import classes from "./style.module.css"
import React from "react";
import {useHover} from "@mantine/hooks";
import {erdEntityTheme} from "@/config/theme.ts";
import type {MemoNodeData} from "@/stores/playground/memoStore.ts";
import {usePlaygroundStore} from "@/stores/usePlaygroundStore.ts";
import {MemoEnum} from "@/enums/playground.ts";
import Controls from "@/screens/Playground/Main/nodes/MemoNode/Header";
import {AutoTextArea} from 'react-textarea-auto-witdth-height'

interface Props extends NodeProps<MemoNodeData> {
}

const MemoNode = React.memo((props: Props) => {
  const {hovered, ref} = useHover<HTMLDivElement>()
  const theme = React.useMemo(() => erdEntityTheme(props.data.color), [props.data.color])
  const playground = usePlaygroundStore(state => state.playground)
  const onPatch = React.useCallback((key: string, value: string) => {
    playground.memo(MemoEnum.patch, {memoId: props.id, key, value})
  }, [playground])

  if (!props.data) return null

  let className = classes.textInput

  if (!props.dragging && props.selected) {
    className = `${classes.textInputActive} nopan nodrag`
  }

  const headersIn = props.selected || hovered

  return (
    <MantineProvider
      defaultColorScheme={"dark"}
      theme={theme}
      cssVariablesSelector={`#${props.id}`}
      getRootElement={() => document.getElementById(props.id) || undefined}
    >
      <div
        className={classes.box}
        id={props.id}
        ref={ref}
      >
        <div className={headersIn ? classes.controls : classes.controlsHidden}>
          <Controls/>
        </div>
        <AutoTextArea
          className={className}
          value={props.data.content}
          onChange={e => onPatch("content", e.target.value)}
          placeholder={"Memo"}
        />
      </div>
    </MantineProvider>
  )
})

export default MemoNode
