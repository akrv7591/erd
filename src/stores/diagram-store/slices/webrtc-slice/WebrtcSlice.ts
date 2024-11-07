import {WebrtcService} from "@/services";
import {StateCreator} from "zustand";
import {DiagramStore} from "@/stores/diagram-store";

interface WebrtcSliceState {
  webrtc: WebrtcService
}

interface WebrtcSliceAction {
}

export type WebrtcSlice = WebrtcSliceState & WebrtcSliceAction

export const webrtcSlice: (peerId: string) => StateCreator<DiagramStore, [], [], WebrtcSlice> = (peerId) => (set, get, api) => {
  const webrtc = new WebrtcService(peerId, api)
  return {
    webrtc,
  }
}
