import {FC, memo, PropsWithChildren, useEffect, useRef, useState} from "react";
import { useParams } from "react-router-dom";
import { useReactFlow } from "@xyflow/react";
import { createDiagramStore } from "@/stores/diagram-store";
import { DiagramContext } from "@/contexts/DiagramContext";
import { LoadingBackdrop } from "@/components/common/LoadingBackdrop";

export const DiagramProvider: FC<PropsWithChildren> = memo((props) => {
  const reactflow = useReactFlow();
  const {erdId: roomId} = useParams<{ erdId: string }>();
  const [storeInitialized, setStoreInitialized] = useState(false);

  if (!roomId) {
    throw new Error("Room ID is required");
  }

  const storeRef = useRef<DiagramContext>();

  useEffect(() => {
    console.log("DiagramProvider mounted")

    if (!storeRef.current) {
      storeRef.current = createDiagramStore(reactflow, roomId)
      setStoreInitialized(true)
    }


    return () => {
      console.log("DiagramProvider unmounted")

      if (!storeRef.current) {
        return
      }

      const {webrtc, socket} = storeRef.current.getState()
      socket.cleanUp();
      webrtc.cleanUp();
    };
  }, []);

  if (!storeRef.current) {
    return (
      <LoadingBackdrop title="storef is not set yet" />
    )
  }

  if (!storeInitialized) {
    return (
      <LoadingBackdrop title="initializing store" />
    )
  }

  return (
    <DiagramContext.Provider value={storeRef.current}>
      {props.children}
    </DiagramContext.Provider>
  );
});
