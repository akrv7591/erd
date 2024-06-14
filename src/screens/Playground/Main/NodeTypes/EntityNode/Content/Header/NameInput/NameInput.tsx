import { usePlayground } from "@/contexts/playground/PlaygroundStoreContext.ts"
import { EntityEnum } from "@/enums/playground.ts"
import { useEntityNodeData } from "@/hooks/useEntityNodeData.ts"
import { PlaygroundStore } from "@/stores/playgroundStore.ts"
import { Input } from "@mantine/core"
import { IconTable } from "@tabler/icons-react"
import { ChangeEventHandler } from "react"
import { useShallow } from "zustand/react/shallow"

const selectors = ({playground, patchEntityData}: PlaygroundStore) => ({playground, patchEntityData})

export const NameInput = () => {
  const {data, id} = useEntityNodeData()
  const {playground, patchEntityData} = usePlayground(useShallow(selectors))
  const handleNameChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const data = {
      entityId: id,
      key: "name",
      value: e.target.value
    }
    const entityPatchResponse = playground.handleEmitResponse({
      onError: playground.notifyErrorMessage(EntityEnum.patch, "Failed to patch entity(name)"),
      onSuccess: () => {
        patchEntityData(data)
      }
    })
    playground.socket.emit(EntityEnum.patch, data, entityPatchResponse)
  }

  return (
    <Input
      value={data.name}
      onChange={handleNameChange}
      placeholder={"Table name"}
      autoFocus
      variant={"filled"}
      size={"sm"}
      leftSection={(
        <IconTable color={"var(--mantine-color-text)"}/>
      )}
      error={!data.name}
    />
  )
}
