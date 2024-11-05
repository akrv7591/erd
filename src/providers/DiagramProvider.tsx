import {FC, memo, PropsWithChildren, useEffect, useRef} from "react";
import { useParams } from "react-router-dom";
import { useReactFlow } from "@xyflow/react";
import { createDiagramStore } from "@/stores/diagram-store";
import { DiagramContext } from "@/contexts/DiagramContext";

export const DiagramProvider: FC<PropsWithChildren> = memo((props) => {
  const reactflow = useReactFlow();
  const {erdId: roomId} = useParams<{ erdId: string }>();

  if (!roomId) {
    throw new Error("Room ID is required");
  }

  const storeRef = useRef<DiagramContext>();

  if (!storeRef.current) {
    storeRef.current = createDiagramStore(reactflow, roomId)
  }

  useEffect(() => {
    return () => {

      if (!storeRef.current) {
        return console.debug("storeRef is not defined! Weird ...")
      }

      const {webrtc, socket} = storeRef.current.getState()
      socket.cleanUp();
      webrtc.cleanUp();
      storeRef.current = undefined
    };
  }, []);

  return (
    <DiagramContext.Provider value={storeRef.current}>
      {props.children}
    </DiagramContext.Provider>
  );
});
