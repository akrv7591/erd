import {TextInput} from "@mantine/core"
import {IconTable} from "@tabler/icons-react"
import {ChangeEventHandler, useCallback} from "react"
import {useDiagramStore, useEntityNode} from "@/hooks";

export const NameInput = () => {
  const {data, id} = useEntityNode()
  const changeName = useDiagramStore(state => state.updateEntityName)

  const handleNameChange: ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
    changeName({
      id,
      name: e.target.value
    })
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
