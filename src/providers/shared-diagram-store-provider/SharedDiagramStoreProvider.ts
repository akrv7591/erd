import {DiagramContext} from "@/contexts/DiagramContext";
import * as Y from "yjs";
import {StoreApi} from "zustand";
import {createSharedDiagramStore, SharedDiagramStore} from "@/stores/shared-diagram-store";
import {HocuspocusProvider, onSyncedParameters} from "@hocuspocus/provider";
import StorageUtils from "@/utility/StorageUtils.ts";
import {PROJECT} from "@/constants/project.ts";
import {NodeType} from "@/providers/shared-diagram-store-provider/type.ts";



export class SharedDiagramStoreProvider {
  url = PROJECT.BASE_API_URL.replace("http", "ws") + "/hocuspocus"
  yDoc: Y.Doc
  store: StoreApi<SharedDiagramStore>
  localStore: DiagramContext
  provider: HocuspocusProvider

  constructor(name: string, localStore: DiagramContext) {
    this.localStore = localStore
    this.yDoc = new Y.Doc();
    this.provider = new HocuspocusProvider({
      url: this.url,
      name,
      document: this.yDoc,
      token: `Bearer ${StorageUtils.getAuthorization()}`,
      onSynced: this.handleSynced
    })
    this.store = createSharedDiagramStore({
      id: name,
      yDoc: this.yDoc,
      store: this.localStore,
      yProvider: this.provider
    })
  }

  handleSynced = (data: onSyncedParameters) => {
    if (data.state) {
      const nodes = Object.entries(this.store.getState().nodes).map(([id, node]) => ({
        id,
        type: node.type,
        data: node.data,
        position: node.position
      })) as NodeType[]

      this.localStore.setState({
        nodes,
        synced: true
      })
    }

  }
}
