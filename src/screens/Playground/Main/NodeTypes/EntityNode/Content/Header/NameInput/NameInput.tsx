import {useEntityNodeData} from "@/hooks/useEntityNodeData.ts"
import {TextInput} from "@mantine/core"
import {IconTable} from "@tabler/icons-react"
import {ChangeEventHandler, useCallback} from "react"

export const NameInput = () => {
  const {data, setData} = useEntityNodeData()

  const handleNameChange: ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
    setData({name: e.target.value})
  }, [setData])
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
