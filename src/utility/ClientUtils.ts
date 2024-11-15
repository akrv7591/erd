import {DiagramStore} from "@/stores/diagram-store";
import {CLIENT} from "@/namespaces/broadcast/client";

export class ClientUtils {
  static updateCursor = (updatedState: Partial<DiagramStore>, state: DiagramStore, data: CLIENT.CURSOR.CHANGE['value']) => {
    if (!updatedState.clients) {
      updatedState.clients = state.clients
    }
    updatedState.clients = updatedState.clients.map(client => {
      if (client.id === data.id) {
        return {
          ...client,
          cursor: data.cursor
        }
      }
      return client
    })
  }
}
