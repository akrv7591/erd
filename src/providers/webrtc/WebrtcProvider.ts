import * as Y from 'yjs'
import {ProviderOptions, WebrtcProvider as YWebRTC} from 'y-webrtc'
import * as awarenessProtocol from 'y-protocols/awareness.js'
import {DiagramContext} from "@/contexts/DiagramContext";
import randomColor from "randomcolor";
import {MESSAGE_KEYS} from "@/providers/webrtc/constants.ts";
import {XYPosition} from "@xyflow/react";
import {config} from "@/config/config.ts";
import {useLogToAuthStore} from "@/stores/useLogToAuthStore.ts";

type AwarenessChange = {
  added: number[],
  removed: number[],
  updated: number[],
}

export class WebrtcProvider {
  webrtc: YWebRTC
  awareness: awarenessProtocol.Awareness
  store: DiagramContext

  constructor(room: string, store: DiagramContext) {
    const yDoc = new Y.Doc()
    const awareness = new awarenessProtocol.Awareness(yDoc)
    const providerOptions: ProviderOptions = {
      awareness,
      signaling: [config.webrtcSignallingServer],
      maxConns: Number.POSITIVE_INFINITY,
      filterBcConns: false
    }
    this.awareness = awareness
    this.store = store
    this.webrtc = new YWebRTC(
      room,
      yDoc,
      providerOptions
    )

    store.setState({awareness})
    awareness.setLocalState({
      userId: useLogToAuthStore.getState().user?.sub,
      cursor: null,
      color: randomColor()
    })
    awareness.on("change", this.handleAwarenessUpdate)
  }

  // Awareness event handlers
  handleAwarenessUpdate = ({added, removed, updated}: AwarenessChange) => {
    if (added.length) {
      this.handleAwarenessAdded(added)
    }

    if (removed.length) {
      this.handleAwarenessRemoved(removed)
    }

    if (updated.length) {
      this.handleAwarenessUpdated(updated)
    }
  }

  handleAwarenessAdded = (clientIds: number[]) => {
    const states = this.awareness.getStates()

    const clients = clientIds.map(id => {
      const client = states.get(id)

      if (!client) {
        return null
      }

      return {
        id,
        cursor: client.cursor,
        userId: client.userId,
        color: client.color,
      }
    })

    console.log(clients)

    this.store.setState(state => {
      return {
        clients: [...state.clients, ...clients.filter(client => client !== null)]
      }
    })
  }

  handleAwarenessRemoved = (clientIds: number[]) => {
    this.store.setState(state => {
      return {
        clients: state.clients.filter(client => !clientIds.includes(client.id))
      }
    })
  }

  handleAwarenessUpdated = (clientIds: number[]) => {
    const states = this.awareness.getStates()

    clientIds.forEach(clientId => {
      const clientState = states.get(clientId)

      if (clientState) {
        const positionChanges = clientState[MESSAGE_KEYS.position] as string[]

        if (positionChanges && positionChanges.length) {

          const nodeChangesMap = new Map<string, XYPosition>()

          positionChanges.forEach(positionChange => {
            const [id, x, y] = positionChange.split("|") as [string, string, string]

            nodeChangesMap.set(id, {x: Number(x), y: Number(y)})
          })

          this.store.setState(state => ({
            nodes: state.nodes.map(node => {
              const positionChange = nodeChangesMap.get(node.id)

              if (!positionChange) {
                return node
              } else {
                return {
                  ...node,
                  position: positionChange
                }
              }
            })
          }))

        }
      }

    })

    this.store.setState(state => {
      return {
        clients: state.clients.map(client => {
          if (clientIds.includes(client.id)) {
            const clientState = states.get(client.id)
            if (clientState) {
              return {
                ...client,
                cursor: clientState.cursor? state.reactflow.flowToScreenPosition(clientState.cursor): null
              }
            }
          }
          return client
        })
      }
    })
  }
}
