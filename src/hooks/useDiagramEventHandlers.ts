import {
  OnBeforeDelete,
  OnConnect,
  OnDelete,
  OnMove,
  ReactFlowProps,
  useReactFlow,
} from "@xyflow/react";
import { useDiagramStore } from "./useDiagramStore";
import { usePeerBroadcast } from "./usePeerBroadcast";
import {
  DragEventHandler,
  MouseEventHandler,
  useCallback,
  useMemo,
} from "react";
import { NodeType } from "@/types/diagram";
import { NODE_TYPES } from "@/screens/Diagram/Main/NodeTypes";
import { EntityUtils } from "@/utility/EntityUtils";
import { useUser } from "./useUser";
import { useAddNode } from "./useAddNode";
import { EdgeType } from "@/types/diagram/edge";
import { REACTFLOW } from "@/namespaces/broadcast/reactflow";

type ReturnType = Pick<
  ReactFlowProps<NodeType, EdgeType>,
  | "onEdgesChange"
  | "onConnect"
  | "onDrop"
  | "onBeforeDelete"
  | "onNodesDelete"
  | "onNodesChange"
  | "onNodeDrag"
  | "onMouseLeave"
  | "onMouseEnter"
  | "onMouseMove"
  | "onMove"
  | "onDragOver"
  | "onNodeDoubleClick"
  | "onBlur"
  | "onDrag"
  | "onNodeDragStart"
  | "onNodeDragStop"
  | "onDelete"
>;

export const useDiagramEventHandlers = (): ReturnType => {
  const { addNode } = useAddNode();
  const { data: user } = useUser();

  const userEntityConfig = useDiagramStore(
    useCallback(
      (state) => {
        return state.configs.find((config) => config.userId === user.id);
      },
      [user],
    ),
  );
  const handleNodesChange = useDiagramStore((state) => state.handleNodeChanges);
  const handleEdgesChange = useDiagramStore((state) => state.handleEdgesChange);
  const pushUndo = useDiagramStore(state => state.pushUndo)
  const handleNodeDragStart = useDiagramStore(
    (state) => state.handleNodeDragStart,
  );
  const handleNodeDragStop = useDiagramStore(
    (state) => state.handleNodeDragStop,
  );
  const requestNodesEdgesDelete = useDiagramStore(
    (state) => state.requestNodesEdgesDelete,
  );
  const requestNodesDelete = useDiagramStore(
    (state) => state.requestNodesDelete,
  );
  const requestEdgesDelete = useDiagramStore(
    (state) => state.requestEdgesDelete,
  );
  const handleEntityToEntityConnection = useDiagramStore(
    (state) => state.handleEntityToEntityConnection,
  );
  const { handleNodeDrag, handleCursorChange } = usePeerBroadcast();
  const reactFlow = useReactFlow();

  // Mouse event handlers
  const handleMouseLeave: ReturnType["onMouseLeave"] = useCallback(() => {
    handleCursorChange(null);
  }, [handleCursorChange]);

  const handleMouseMove: MouseEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      handleCursorChange({ x: e.clientX, y: e.clientY });
    },
    [handleCursorChange],
  );

  const handleMove: OnMove = useCallback(
    (e) => {
      if (e instanceof MouseEvent) {
        const position = { x: e.clientX, y: e.clientY };
        handleCursorChange(position);
      }
    },
    [handleCursorChange],
  );

  const handleNodeDoubleClick = useCallback((_: any, node: NodeType) => {
    try {
      reactFlow.fitView({
        nodes: [node],
        padding: 0.1,
        duration: 500,
      });
    } catch (e) {
      console.warn(e);
    }
  }, []);

  const handleDragOver: DragEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
    },
    [],
  );

  const handleDrop: DragEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      e.preventDefault();
      const type = e.dataTransfer.getData(
        "application/reactflow",
      ) as NODE_TYPES;

      // @ts-ignore
      const targetIsPane = e.target.classList.contains("react-flow__pane");

      // check if the dropped element is valid
      if (!targetIsPane) {
        return;
      }

      if (typeof type === "undefined" || !type) {
        return;
      }

      const position = reactFlow.screenToFlowPosition({
        x: e.clientX,
        y: e.clientY,
      });

      let node: NodeType;

      switch (type) {
        case NODE_TYPES.ENTITY:
          node = EntityUtils.genNewEntityNode(position, userEntityConfig);
          break;
        case NODE_TYPES.MEMO:
          node = EntityUtils.genNewEntityNode(position);
          break;
      }
      addNode(node);
    },
    [userEntityConfig],
  );

  const handleBeforeDelete: OnBeforeDelete<NodeType, EdgeType> = useCallback(
    ({ nodes, edges }) => {
      if (nodes.length && edges.length) {
        return requestNodesEdgesDelete(nodes, edges);
      } else if (nodes.length) {
        return requestNodesDelete(nodes);
      } else if (edges.length) {
        return requestEdgesDelete(edges);
      } else {
        return Promise.resolve(false);
      }
    },
    [],
  );

  const handleDelete: OnDelete<NodeType, EdgeType> = useCallback(
    ({ nodes, edges }) => {
      const updates: (REACTFLOW.NODE_CHANGE | REACTFLOW.EDGE_CHANGE)[] = [];
      const current: (REACTFLOW.NODE_CHANGE | REACTFLOW.EDGE_CHANGE)[] = [];

      if (nodes.length) {
        updates.push({
          type: REACTFLOW.TYPE.NODE_CHANGE,
          value: nodes.map((node) => ({
            type: "remove",
            id: node.id,
          })),
        });

        current.push({
          type: REACTFLOW.TYPE.NODE_CHANGE,
          value: nodes.map((item) => ({
            type: "add",
            item
          }))
        })
      }

      if (edges.length) {
        updates.push({
          type: REACTFLOW.TYPE.EDGE_CHANGE,
          value: edges.map((node) => ({
            type: "remove",
            id: node.id,
          })),
        });

        current.push({
          type: REACTFLOW.TYPE.EDGE_CHANGE,
          value: edges.map((item) => ({
            type: "add",
            item
          }))
        })
      }

      if (updates.length) {
        pushUndo({
          undo: current,
          redo: updates
        })
      }
    },
    [],
  );

  const handleConnect: OnConnect = useCallback(({ target, source }) => {
    const targetNode = reactFlow.getNode(target) as NodeType;
    const sourceNode = reactFlow.getNode(source) as NodeType;

    if (target === source) {
      return;
    }

    const sourceType = sourceNode.type;
    const targetType = targetNode.type;

    if (sourceType === NODE_TYPES.ENTITY && targetType === NODE_TYPES.ENTITY) {
      handleEntityToEntityConnection(sourceNode, targetNode);
    }
  }, []);

  const handleBlur = useCallback(() => {
    handleCursorChange(null);
  }, [handleCursorChange]);

  return useMemo(
    () => ({
      onEdgesChange: handleEdgesChange,
      onConnect: handleConnect,
      onDragOver: handleDragOver,
      onDrop: handleDrop,
      onBeforeDelete: handleBeforeDelete,
      onNodesChange: handleNodesChange,
      onNodeDrag: handleNodeDrag,
      onMouseLeave: handleMouseLeave,
      onMouseMove: handleMouseMove,
      onMove: handleMove,
      onNodeDoubleClick: handleNodeDoubleClick,
      onBlur: handleBlur,
      onNodeDragStart: handleNodeDragStart,
      onNodeDragStop: handleNodeDragStop,
      onDelete: handleDelete,
    }),
    [
      handleEdgesChange,
      handleConnect,
      handleDrop,
      handleBeforeDelete,
      handleNodesChange,
      handleNodeDrag,
      handleMouseLeave,
      handleMouseMove,
      handleMove,
      handleNodeDoubleClick,
      handleBlur,
      handleNodeDragStart,
      handleNodeDragStop,
      handleDragOver,
      handleDelete,
    ],
  );
};
