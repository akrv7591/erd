import {DiagramContext} from "@/contexts/DiagramContext";
import * as Y from "yjs";
import {StoreApi} from "zustand";
import {createSharedDiagramStore, SharedDiagramStore} from "@/stores/shared-diagram-store";
import {HocuspocusProvider, onSyncedParameters} from "@hocuspocus/provider";
import StorageUtils from "@/utility/StorageUtils.ts";
import {PROJECT} from "@/constants/project.ts";


export class SharedDiagramStoreProvider {
  url = PROJECT.BASE_API_URL.replace("http", "ws") + "/hocuspocus"
  yDoc: Y.Doc
  store: StoreApi<SharedDiagramStore>
  localStore: DiagramContext
  provider: HocuspocusProvider
  docName: string


  constructor(name: string, localStore: DiagramContext) {
    this.docName = name
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
      this.localStore.setState({
        synced: true
      })

      this.initUndoManager()
    }

  }

  initUndoManager = () => {
    const diagram = this.yDoc.getMap(this.docName)
    const undoManager = new Y.UndoManager(diagram, {
      ignoreRemoteMapChanges: false,
      captureTimeout: 0,
    })

    this.localStore.setState({
      undoManager,
    })

    const handleStackItemChange = (_: any, undoManager: Y.UndoManager) => {
      this.localStore.setState({
        canUndo: undoManager.canUndo(),
        canRedo: undoManager.canRedo()
      })
    }

    undoManager.on("stack-item-updated", handleStackItemChange)
    undoManager.on("stack-item-added", handleStackItemChange)
    undoManager.on("stack-item-popped", handleStackItemChange)
  }
}
