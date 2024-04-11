import {MantineProvider} from "@mantine/core";
import classes from "./style.module.css"
import {useHover} from "@mantine/hooks";
import {erdEntityTheme} from "@/config/theme.ts";
import {usePlaygroundStore} from "@/stores/usePlaygroundStore.ts";
import {MemoEnum} from "@/enums/playground.ts";
import Controls from "@/screens/Playground/Main/nodes/MemoNode/Header";
import {AutoTextArea} from 'react-textarea-auto-witdth-height'
import {useMemoNodeData} from "@/hooks/useMemoNodeData.ts";
import {memo, useCallback, useMemo} from "react";

interface Props {
  selected?: boolean
  id: string
}

const ThemedNode = memo((props: Props) => {
  const {hovered, ref} = useHover<HTMLDivElement>()
  const {data} = useMemoNodeData()!
  const theme = useMemo(() => erdEntityTheme(data.color), [data.color])
  const playground = usePlaygroundStore(state => state.playground)
  const onPatch = useCallback((key: string, value: string) => {
    playground.memo(MemoEnum.patch, {memoId: props.id, key, value})
  }, [playground])

  if (!data) return null

  let className = classes.textInput

  if (props.selected) {
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
      <div className={classes.box} id={props.id} ref={ref}>
        <div className={headersIn ? classes.controls : classes.controlsHidden}>
          <Controls/>
        </div>
        <AutoTextArea
          className={className}
          value={data.content}
          onChange={e => onPatch("content", e.target.value)}
          placeholder={"Memo"}
        />
      </div>
    </MantineProvider>
  )
})

export default ThemedNode
