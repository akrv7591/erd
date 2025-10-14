import {TextInput} from "@mantine/core"
import {IconTable} from "@tabler/icons-react"
import {ChangeEventHandler, FC, memo, useCallback} from "react"
import { useEntityStoreData, useUpdateEntityName } from "@/hooks/useEntityData";

interface Props {}

export const NameInput: FC<Props> = memo(() => {
  const name = useEntityStoreData(state => state.name)
  const handleNameUpdate = useUpdateEntityName()
  const handleNameChange: ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
    handleNameUpdate(e.target.value)
  }, [])
  
  return (
    <TextInput
      value={name}
      onChange={handleNameChange}
      autoFocus
      variant={"default"}
      size={"sm"}
      leftSection={(
        <IconTable/>
      )}
      error={!name && "Entity name is required"}
    />
  )
})
