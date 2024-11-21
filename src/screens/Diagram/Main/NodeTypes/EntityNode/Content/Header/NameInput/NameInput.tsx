import {TextInput} from "@mantine/core"
import {IconTable} from "@tabler/icons-react"
import {ChangeEventHandler, useCallback} from "react"
import {useEntity, useEntityNode} from "@/hooks";

export const NameInput = () => {
  const {data} = useEntityNode()
  const {changeName} = useEntity()

  const handleNameChange: ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
    changeName(e.target.value)
  }, [changeName])
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
