import {TextInput} from "@mantine/core"
import {IconTable} from "@tabler/icons-react"
import {ChangeEventHandler, useCallback} from "react"
import {useEntityNode} from "@/hooks";

export const NameInput = () => {
  const {onChange, data} = useEntityNode()

  const handleNameChange: ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
    onChange({name: e.target.value})
  }, [])
  return (
    <TextInput
      value={data.name}
      onChange={handleNameChange}
      autoFocus
      variant={"default"}
      size={"sm"}
      leftSection={(
        <IconTable/>
      )}
      error={!data.name && "Entity name is required"}
    />
  )
}
