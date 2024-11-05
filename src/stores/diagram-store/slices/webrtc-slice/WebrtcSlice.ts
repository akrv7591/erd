import {WebrtcService} from "@/services";
import {StateCreator} from "zustand";
import {DiagramStore} from "@/stores/diagram-store";

interface WebrtcSliceState {
  webrtc: WebrtcService
}

interface WebrtcSliceAction {
  initWebrtc: (peerId: string) => void
}

export type WebrtcSlice = WebrtcSliceState & WebrtcSliceAction

export const webrtcSlice: StateCreator<DiagramStore, [], [], WebrtcSlice> = (set, __, api) => {
  return {
    webrtc: {} as WebrtcService,
    initWebrtc: (peerId: string) =>{
      console.log("Init webrtc")
      set({
        webrtc: new WebrtcService(peerId, api),
        synced: true
      })
    }
  }
}

