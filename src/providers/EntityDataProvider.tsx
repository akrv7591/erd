import { EntityDateContext } from "@/contexts/EntityDataContext"
import { createEntityStore } from "@/stores/entity-store"
import { EntityData } from "@/types/diagram"
import { FC, PropsWithChildren, useEffect, useRef } from "react"

export const EntityDataProvider: FC<PropsWithChildren<{ data: EntityData }>> = ({ children, data }) => {
  const storeRef = useRef<ReturnType<typeof createEntityStore>>(createEntityStore(data))

  useEffect(() => {
    storeRef.current.setState(data)
  }, [data])

  return (
    <EntityDateContext.Provider value={storeRef.current}>
      {children}
    </EntityDateContext.Provider>
  )
}