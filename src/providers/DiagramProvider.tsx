import {FC, memo, PropsWithChildren, useEffect, useRef, useState} from "react";
import { useParams } from "react-router-dom";
import { useReactFlow } from "@xyflow/react";
import { createDiagramStore } from "@/stores/diagram-store";
import { DiagramContext } from "@/contexts/DiagramContext";
import { useUser } from "@/hooks";

export const DiagramProvider: FC<PropsWithChildren> = memo((props) => {
  const reactflow = useReactFlow();
  const {erdId: roomId} = useParams<{ erdId: string }>();
  const [storeInitialized, setStoreInitialized] = useState(false);
  const {data: user} = useUser()

  if (!roomId) {
    throw new Error("Room ID is required");
  }

  const storeRef = useRef<DiagramContext | null>(null);

  useEffect(() => {
    if (!storeRef.current) {
      storeRef.current = createDiagramStore({
        reactflow,
        roomId,
        user,
      })
      setStoreInitialized(true)
    }

    return () => {
      console.log("DiagramProvider unmounted")

      if (!storeRef.current) {
        return
      }

      const {socket} = storeRef.current.getState()
      socket.cleanUp();
    };
  }, []);

  return (
    <>
      {storeInitialized && storeRef.current && (
        <DiagramContext.Provider value={storeRef.current}>
          {props.children}
        </DiagramContext.Provider>
      )}
    </>
  );
});
