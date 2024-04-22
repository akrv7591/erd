import {MantineProvider} from "@mantine/core";
import {usePlaygroundStore} from "@/stores/usePlaygroundStore.ts";
import {MemoEnum} from "@/enums/playground.ts";
import {useMemoNodeData} from "@/hooks/useMemoNodeData.ts";
import {memo, useCallback, useEffect, useMemo} from "react";
import {MemoWebsocketPatch} from "@/services/multiplayer/memo-service.ts";
import '@mantine/tiptap/styles.css';
import {useEditor} from "@tiptap/react";
import {RichTextEditor} from "@mantine/tiptap";
import {erdEntityTheme} from "@/config/theme.ts";
import StarterKit from '@tiptap/starter-kit';
import {TextStyle} from "@tiptap/extension-text-style";
import {Color} from "@tiptap/extension-color";
import {IconTextColor, IconTrash} from "@tabler/icons-react";
import "./style.module.css"
import { useReactFlow} from "@xyflow/react";

interface Props {
  selected?: boolean
  id: string
}

const Editor = memo(() => {
  console.log("RENDERING MEMO")
  const {id, data} = useMemoNodeData()
  const playground = usePlaygroundStore(state => state.playground)
  const onPatch = useCallback((key: MemoWebsocketPatch['key'], value: string) => {
    if (!playground.memo) {
      return
    }
    playground.memo(MemoEnum.patch, {memoId: id, key, value})
  }, [playground])

  const reactFlow = useReactFlow()
  const handleDelete = useCallback(() => {
    if (!id) return

    reactFlow.deleteElements({nodes: [{id}]})

  }, [reactFlow])

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color
    ],
    content: data.content,
    onUpdate: p => {
      onPatch("content", p.editor.getHTML())
    },
  });

  useEffect(() => {
    editor?.commands.setContent(data.content)
  }, [data.content])

  return (
    <div onClick={() => editor?.commands.focus()} id={id}>
      <RichTextEditor editor={editor}>
        <RichTextEditor.Toolbar>
          <RichTextEditor.ColorPicker
            colors={[
              '#25262b',
              '#868e96',
              '#fa5252',
              '#e64980',
              '#be4bdb',
              '#7950f2',
              '#4c6ef5',
              '#228be6',
              '#15aabf',
              '#12b886',
              '#40c057',
              '#82c91e',
              '#fab005',
              '#fd7e14',
            ]}
          />
          <RichTextEditor.Control interactive={false}>
            <IconTextColor size="1rem"/>
          </RichTextEditor.Control>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Color color="#25262b"/>
            <RichTextEditor.Color color="#F03E3E"/>
            <RichTextEditor.Color color="#7048E8"/>
            <RichTextEditor.Color color="#1098AD"/>
            <RichTextEditor.Color color="#37B24D"/>
            <RichTextEditor.Color color="#F59F00"/>
          </RichTextEditor.ControlsGroup>
          <RichTextEditor.UnsetColor/>
          <RichTextEditor.Control>
            <IconTrash onClick={handleDelete}/>
          </RichTextEditor.Control>
        </RichTextEditor.Toolbar>
        <RichTextEditor.Content
          className={"nopan nodrag"}
          style={{cursor: "text"}}
          miw={300}
          mih={300}
          bg={"var(--mantine-primary-color-filled)"}
        />
      </RichTextEditor>
    </div>

  )
})

const ThemedNode = memo((props: Props) => {
  const {data} = useMemoNodeData()
  const theme = useMemo(() => erdEntityTheme(data.color), [data.color])
  return (
    <MantineProvider
      defaultColorScheme={"dark"}
      theme={theme}
      cssVariablesSelector={`#${props.id}`}
      getRootElement={() => document.getElementById(props.id) || undefined}
    >
      <Editor/>
    </MantineProvider>
  )
})

export default ThemedNode
