import { useDiagramStore } from "./useDiagramStore"
import { useEntityNode } from "./useEntityNode"
import { useCallback, useMemo } from "react"
import { NODE } from "@/namespaces/broadcast/node"
import { BROADCAST } from "@/namespaces"


export const useEntity = () => {
  const handleDataChange = useDiagramStore(state => state.handleDataChange)
  const {id, data} = useEntityNode()

  const changeName = useCallback((newValue: string) => {
    const current: NODE.ENTITY.NAME_UPDATE[] = [{
      type: NODE.ENTITY.TYPE.NAME_UPDATE,
      value: {
        id,
        name: data.name
      }
    }]

    const updates: BROADCAST.DATA[] = [{
      type: NODE.ENTITY.TYPE.NAME_UPDATE,
      value: {
        id,
        name: newValue
      }
    }]

    handleDataChange({
      updates,
      current
    })
  }, [data.name])

  const changeColor = useCallback((newValue: string) => {
    const current: NODE.ENTITY.COLOR_UPDATE[] = [{
      type: NODE.ENTITY.TYPE.COLOR_UPDATE,
      value: {
        id,
        color: data.color
      }
    }]

    const updates: NODE.ENTITY.COLOR_UPDATE[] = [{
      type: NODE.ENTITY.TYPE.COLOR_UPDATE,
      value: {
        id,
        color: newValue
      }
    }]

    handleDataChange({
      updates,
      current
    })

  }, [data.color])


  return useMemo(() => ({
    changeName,
    changeColor,
  }), [
    changeName,
    changeColor,
  ])
}
