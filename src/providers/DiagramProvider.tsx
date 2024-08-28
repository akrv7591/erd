import {FC, PropsWithChildren, useEffect, useRef, useState} from "react";
import {SharedDiagramContext} from "@/contexts/SharedDiagramContext.ts";
import {useParams} from "react-router-dom";
import {useReactFlow} from "@xyflow/react";
import {createDiagramStore} from "@/stores/diagram-store";
import {WebrtcProvider} from "./webrtc/WebrtcProvider.ts";
import LoadingBackdrop from "@/components/common/LoadingBackdrop.tsx";
import {AwarenessContext} from "@/contexts/AwarenessContext.ts";
import {SharedDiagramStoreProvider} from "@/providers/shared-diagram-store-provider/SharedDiagramStoreProvider";
import {DiagramContext} from "@/contexts/DiagramContext.ts";

type StoreRef = {
  localStore: DiagramContext | null
  sharedStore: SharedDiagramContext | null
  awareness: AwarenessContext | null
}

type ProviderRef = {
  webrtcProvider: WebrtcProvider | null
  sharedDiagramStoreProvider: SharedDiagramStoreProvider | null
}

export const DiagramProvider: FC<PropsWithChildren> = (props) => {
  const storeRef = useRef<StoreRef>({
    localStore: null,
    sharedStore: null,
    awareness: null
  })
  const providerRef = useRef<ProviderRef>({
    webrtcProvider: null,
    sharedDiagramStoreProvider: null
  })

  const params = useParams<{ erdId: string }>()
  const reactflow = useReactFlow()
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!params.erdId) {
      return
    }

    const store = storeRef.current
    const providers = providerRef.current

    const storesInitialized = store.sharedStore && store.localStore && store.awareness
    const providersInitialized = providers.sharedDiagramStoreProvider && providers.webrtcProvider

    if (!(storesInitialized && providersInitialized)) {

      const localStore = createDiagramStore(reactflow)
      providers.webrtcProvider = new WebrtcProvider(params.erdId, localStore)
      providers.sharedDiagramStoreProvider = new SharedDiagramStoreProvider(params.erdId, localStore)

      store.sharedStore = providers.sharedDiagramStoreProvider.store
      store.awareness = providers.webrtcProvider.awareness
      store.localStore = localStore

      setLoaded(true)
    }

    return () => {
      providers.webrtcProvider?.webrtc.destroy()
      providers.sharedDiagramStoreProvider?.provider.destroy()
    }
  }, [storeRef, providerRef]);

  if (!loaded) {
    return (
      <LoadingBackdrop/>
    )
  }

  if (!storeRef.current.localStore) {
    return
  }

  if (!storeRef.current.sharedStore) {
    return
  }

  if (!storeRef.current.awareness) {
    return
  }


  return (
    <DiagramContext.Provider value={storeRef.current.localStore}>
      <SharedDiagramContext.Provider value={storeRef.current.sharedStore}>
        <AwarenessContext.Provider value={storeRef.current.awareness}>
          {props.children}
        </AwarenessContext.Provider>
      </SharedDiagramContext.Provider>
    </DiagramContext.Provider>

  )
}
