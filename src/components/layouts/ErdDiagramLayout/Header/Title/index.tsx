import {ActionIcon, Group, Text, TextInput} from "@mantine/core";
import {useErdStore} from "../../../../../stores/useErdStore";
import {IconCheck, IconEdit} from "@tabler/icons-react";
import React from "react";
import {useForm} from "@mantine/form";
import styles from "./style.module.css"
import {useErd} from "../../../../../providers/ErdProvider";

export default function Title() {
  const erd = useErd()
  const setErd = useErdStore(state => state.setErd)
  const [editable, setEditable] = React.useState(false)
  const form = useForm({
    initialValues: {
      name: erd.name
    }
  })

  if (!erd) return null

  return (
    <form onSubmit={form.onSubmit((data) => {
      // setErd({...erd, name: data.name}, "update");
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
          <Text className={styles.title}>{form.values.name}</Text>
          <ActionIcon onClick={() => setEditable(cur => !cur)}>
            <IconEdit stroke={1}/>
          </ActionIcon>
        </Group>
      }

    </form>
  )
}
