import {ActionIcon, Group, Text, TextInput} from "@mantine/core";
import {IconCheck, IconEdit} from "@tabler/icons-react";
import React from "react";
import {useForm} from "@mantine/form";
import styles from "./style.module.css"
import {useErdDiagramStore} from "../../../../../stores/useErdDiagramStore.ts";

export default function Title() {
  const [editable, setEditable] = React.useState(false)
  const name = useErdDiagramStore(state => state.name)
  const form = useForm({
    initialValues: {
      name
    },
  })

  return (
    <form onSubmit={form.onSubmit(() => {
      setEditable(cur => !cur)
    })}>
      {editable
        ? <TextInput
          {...form.getInputProps("name")}
          autoFocus
          rightSection={(
            <ActionIcon type={"button"} onClick={() => setEditable(cur => !cur)}>
              <IconCheck stroke={1}/>
            </ActionIcon>
          )}
        />
        : <Group>
          <Text className={styles.title}>{name}</Text>
          <ActionIcon onClick={() => setEditable(cur => !cur)}>
            <IconEdit stroke={1}/>
          </ActionIcon>
        </Group>
      }

    </form>
  )
}
