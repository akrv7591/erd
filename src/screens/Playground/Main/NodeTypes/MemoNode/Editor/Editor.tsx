import {Tooltip} from "@mantine/core";
import {PlaygroundStore} from "@/stores/playgroundStore.ts";
import {MemoEnum} from "@/enums/playground.ts";
import {useMemoNodeData} from "@/hooks/useMemoNodeData.ts";
import {memo, useCallback, useEffect} from "react";
import {useEditor} from "@tiptap/react";
import {RichTextEditor} from "@mantine/tiptap";
import StarterKit from '@tiptap/starter-kit';
import {TextStyle} from "@tiptap/extension-text-style";
import {Color} from "@tiptap/extension-color";
import {IconTextColor, IconTrash} from "@tabler/icons-react";
import {useReactFlow} from "@xyflow/react";
import {useShallow} from "zustand/react/shallow";
import {usePlayground} from "@/contexts/playground/PlaygroundStoreContext.ts";
import '@mantine/tiptap/styles.css';
import "./style.module.css"

const extensions = [
  StarterKit,
  TextStyle,
  Color
]

const selector = (state: PlaygroundStore) => ({
  playground: state.playground
})

export const Editor = memo(() => {
  const {id, data} = useMemoNodeData()
  const {playground} = usePlayground(useShallow(selector))
  const reactFlow = useReactFlow()

  const editor = useEditor({
    extensions,
    content: data.content,
    onUpdate: p => {
      onPatch("content", p.editor.getHTML())
    },
  });

  const onClick = useCallback(() => {
    if (!editor?.isFocused) {
      editor?.commands.focus()
    }
  }, [])

  const handleDelete = useCallback(() => {
    if (!id) return

    reactFlow.deleteElements({nodes: [{id}]})

  }, [])

  const onPatch = useCallback((key: string, value: string) => {
    const memoPatchResponse = playground.handleEmitResponse({
      onError: playground.notifyErrorMessage(MemoEnum.patch, "Failed to patch memo"),
      onSuccess: () => {}
    })
    const data = {
      memoId: id,
      key,
      value
    }
    playground.socket.emit(MemoEnum.patch, data, memoPatchResponse)
  }, [])

  useEffect(() => {
    editor?.commands.setContent(data.content)
  }, [data.content])

  return (
    <div onClick={onClick} id={id}>
      <RichTextEditor editor={editor} styles={{
        content: {
          backgroundColor: "#ffdc21",
          minHeight: "100px",
          color: "#333333"
        },
      }}>
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
            <IconTextColor size="1rem" />
          </RichTextEditor.Control>
          <Tooltip label={"Unset color"}>
            <RichTextEditor.UnsetColor/>
          </Tooltip>
          <RichTextEditor.Control ml="auto">
            <Tooltip label={"Delete memo"}>
              <IconTrash onClick={handleDelete}/>
            </Tooltip>
          </RichTextEditor.Control>
        </RichTextEditor.Toolbar>
        <RichTextEditor.Content className={"nopan nodrag memoContent"}/>
      </RichTextEditor>
    </div>
  )
})
