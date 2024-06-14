import {connect} from "socket.io-client";
import {ReactFlowInstance, Viewport} from "@xyflow/react";
import {CallbackDataStatus, PlayerEnum} from "@/enums/playground.ts";
import {PROJECT} from "@/constants/project.ts";
import {SOCKET} from "@/constants/socket.ts";
import {NODE_TYPES} from "@/screens/Playground/Main/NodeTypes";
import {PlaygroundStore} from "@/contexts/playground/PlaygroundStoreContext.ts";
import {ServiceArgs} from "@/services/multiplayer/multiplayer";
import {MultiplayerSocket} from "@/services/multiplayer/type";
import {multiplayerServices} from "@/services/multiplayer/index.ts";
import {notifications} from "@mantine/notifications";

export class PlaygroundService {
  readonly socket: MultiplayerSocket
  readonly reactFlow: ReactFlowInstance
  readonly nodesType: Map<string, NODE_TYPES> = new Map()
  readonly playgroundStore: PlaygroundStore
  readonly playerId: string

  constructor(playerId: string, playgroundId: string, reactFlow: ReactFlowInstance, playgroundStore: PlaygroundStore) {
    this.socket = connect(PROJECT.BASE_API_URL, {
      auth: {playerId, playgroundId, type: SOCKET.TYPE.ERD},
      withCredentials: true,
      reconnection: true,
    })
    this.playerId = playerId
    this.reactFlow = reactFlow
    this.playgroundStore = playgroundStore
    this.initPlayground()
    this.socket.on("connect", () => {
      console.log("Connected to socket")
    })
    this.socket.on("disconnect", this.playgroundStore.getState().reset)
  }

  get serviceArgs(): ServiceArgs {
    return {
      store: this.playgroundStore,
      reactFlow: this.reactFlow,
      socket: this.socket
    }
  }

  private initPlayground() {
    multiplayerServices.forEach(service => service(this.serviceArgs))
  }

  public handleEmitResponse = (obj: { onSuccess: () => void, onError: () => void }, callback?: Function) => (status: CallbackDataStatus) => {
    switch (status) {
      case CallbackDataStatus.FAILED:
        obj.onError()
        break
      case CallbackDataStatus.OK:
        obj.onSuccess()
        break
    }

    if (callback) {
      callback()
    }
  }

  public notifyErrorMessage = (title: string, message: string, color: string = 'red') => () => {
    notifications.show({
      title,
      message,
      color
    })
  }

  public handleMouseMove = (position: { x: number, y: number } | null) => {
    const mouseChangeResponse = this.handleEmitResponse({
      onError: this.notifyErrorMessage(PlayerEnum.mouseChange, "Failed to change mouse position"),
      onSuccess: () => {}
    })

    const data = {
      cursorPosition: position? this.reactFlow.screenToFlowPosition(position, {snapToGrid: false}): null,
      playerId: this.playerId
    }

    this.socket.emit(PlayerEnum.mouseChange, data, mouseChangeResponse)
  }

  public handleViewportChange = (obj: {viewport: Viewport | null}) => {
    const viewpointChangeResponse = this.handleEmitResponse({
      onError: this.notifyErrorMessage(PlayerEnum.viewportChange, "Failed to change viewpoint"),
      onSuccess: () => {}
    })

    const data = {
      viewpoint: obj.viewport,
      playerId: this.playerId
    }

    this.socket.emit(PlayerEnum.viewportChange, data, viewpointChangeResponse)
  }

  public handlePlayerUnsubscribe = (subscribeTo: string) => {
    const playerUnsubscribeResponse = this.handleEmitResponse({
      onError: this.notifyErrorMessage(PlayerEnum.unsubscribe, "Failed to unsubscribe"),
      onSuccess: () => {}
    })

    const data = {
      playerId: subscribeTo
    }

    this.socket.emit(PlayerEnum.unsubscribe, data, playerUnsubscribeResponse)
  }

  public handlePlayerSubscribe = (subscribeTo: string) => {
    const playerSubscribeResponse = this.handleEmitResponse({
      onError: this.notifyErrorMessage(PlayerEnum.subscribe, "Failed to subscribe"),
      onSuccess: () => {}
    })

    const data = {
      playerId: subscribeTo
    }

    this.socket.emit(PlayerEnum.subscribe, data, playerSubscribeResponse)
  }
}
