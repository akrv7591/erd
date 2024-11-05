import {
  Edge,
  OnBeforeDelete,
  OnConnect,
  OnMove,
  ReactFlowProps,
  useReactFlow,
} from "@xyflow/react";
import {
  useDiagramStore,
  useDiagramStoreApi,
} from "./useDiagramStore";
import {
  usePeerBroadcast
} from "./usePeerBroadcast";
import {DragEventHandler, MouseEventHandler, useCallback, useMemo} from "react";
import { EntityNode, NodeType } from "@/types/diagram";
import { NODE_TYPES } from "@/screens/Playground/Main/NodeTypes";
import { EntityUtils } from "@/utility/EntityUtils";
import { DiagramStore } from "@/stores/diagram-store";
import { RelationUtils } from "@/utility/RelationUtils";
import {BROADCAST, RELATION} from "@/namespaces";
import {DataBroadcast} from "@/types/diagram";

type ReturnType = Pick<
  ReactFlowProps<NodeType>,
  | "onEdgesChange"
  | "onConnect"
  | "onDrop"
  | "onBeforeDelete"
  | "onNodesDelete"
  | "onNodesChange"
  | "onNodeDragStop"
  | "onNodeDrag"
  | "onMouseLeave"
  | "onMouseEnter"
  | "onMouseMove"
  | "onMove"
  | "onDragOver"
  | "onNodeDoubleClick"
>;

export const useDiagramEventHandlers = (): ReturnType => {
  const addNode = useDiagramStore((state) => state.addNode);
  const handleNodesChange = useDiagramStore(state => state.handleNodeChanges);
  const handleEdgesChange = useDiagramStore(state => state.handleEdgesChange)
  const {
    handleNodeDrag,
    handleNodeDragStop,
    handleCursorChange
  } = usePeerBroadcast();

  const reactFlow = useReactFlow();
  const diagramStoreApi = useDiagramStoreApi();

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

  const handleDragOver: DragEventHandler<HTMLDivElement> = useCallback((e) => {
    e.preventDefault();

    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = "move";
    }
  }, []);

  const handleNodeDoubleClick = useCallback((_: any, node: NodeType) => {
    try {
      void reactFlow.fitView({
        nodes: [node],
        padding: 0.1,
        duration: 500,
      });
    } catch (e) {
      console.warn(e);
    }
  }, []);

  const handleDrop: DragEventHandler<HTMLDivElement> = useCallback((e) => {
    e.preventDefault();

    const type = e.dataTransfer.getData("application/reactflow") as NODE_TYPES;

    // @ts-ignore
    const targetIsPane = e.target.classList.contains("react-flow__pane");

    // check if the dropped element is valid
    if (!targetIsPane) {
      return;
    }

    if (typeof type === "undefined" || !type) {
      console.warn("Dropped element is not a valid reactflow node");
      return;
    }

    const position = reactFlow.screenToFlowPosition({
      x: e.clientX,
      y: e.clientY,
    });

    let node: NodeType;

    switch (type) {
      case NODE_TYPES.ENTITY:
        node = EntityUtils.genNewEntityNode(position);
        break;
      case NODE_TYPES.MEMO:
        node = EntityUtils.genNewEntityNode(position);
        break;
    }
    addNode(node);
  }, []);

  const handleBeforeDelete: OnBeforeDelete<NodeType, Edge> = useCallback(
    ({ nodes, edges }) =>
      new Promise<boolean>((resolve) => {
        diagramStoreApi.setState((state) => {
          if (nodes.length && edges.length) {
            return {
              confirmModal: {
                ...state.confirmModal,
                opened: true,
                message:
                  "Are you sure to delete all selected nodes and relations",
                onConfirm: (callback) => {
                  resolve(true);
                  callback?.();
                },
                onCancel: (callback) => {
                  resolve(false);
                  callback?.();
                },
              },
            };
          } else if (nodes.length) {
            const message = nodes.length > 1 ? "Are you sure to delete all selected nodes" : "Are you sure to delete selected node"
            return {
              confirmModal: {
                ...state.confirmModal,
                opened: true,
                message,
                onConfirm: (callback) => {
                  resolve(true);
                  callback?.();
                },
                onCancel: (callback) => {
                  resolve(false);
                  callback?.();
                },
              },
            };
          } else if (edges.length) {
            const message = edges.length? "Are you sure to delete all selected relations": "Are you sure to delete selected relation"
            return {
              confirmModal: {
                ...state.confirmModal,
                opened: true,
                message,
                onConfirm: (callback) => {
                  resolve(true);
                  callback?.();
                },
                onCancel: (callback) => {
                  resolve(false);
                  callback?.();
                },
              },
            };
          } else {
            resolve(false)
            return {}
          }
        });
      }),
    [],
  );

  const handleConnect: OnConnect = useCallback( ({target, source}) => {
    const targetNode = reactFlow.getNode(target) as EntityNode
    const sourceNode = reactFlow.getNode(source) as EntityNode

    if (target === source) {
      return
    }

    if (!targetNode || !sourceNode) {
      return console.warn("On connect target or source node is not found")
    }

    if (targetNode.type !== NODE_TYPES.ENTITY || sourceNode.type !== NODE_TYPES.ENTITY) {
      return console.debug("You are trying to conect other than entity nodes")
    }

    diagramStoreApi.setState(state => {
      const updatedState: Partial<DiagramStore> = {
        tool: "hand-grab"
      }

      const {newEntities, newRelations, newTargetNodeColumns} = RelationUtils.generateEntityConnectData({
        sourceNode,
        targetNode,
        relationType: state.tool as RELATION.NAME
      })

      const broadcastData: DataBroadcast[] = []

      if (newEntities.length) {
        broadcastData.push({
          type: BROADCAST.DATA.TYPE.REACTFLOW_NODE_CHANGE,
          value: newEntities.map(item => ({
            type: "add",
            item
          }))
        })

        updatedState.nodes = [...state.nodes, ...newEntities]
      }

      if (newTargetNodeColumns.length) {

        if (!updatedState.nodes) {
          updatedState.nodes = state.nodes
        }

        updatedState.nodes = updatedState.nodes.map(node => {
          if (node.id !== targetNode.id) {
            return node
          }

          if (node.type !== NODE_TYPES.ENTITY) {
            throw new Error("")
          }

          const updatedEntity = {
            ...node,
            data: {
              ...node.data,
              columns: [...node.data.columns, ...newTargetNodeColumns]
            }
          }

          broadcastData.push({
            type: BROADCAST.DATA.TYPE.NODE_DATA_UPDATE,
            value: {
              id: updatedEntity.id,
              data: updatedEntity.data
            }
          })

          return updatedEntity
        })
      }

      if (newRelations.length) {
        broadcastData.push({
          type: BROADCAST.DATA.TYPE.REACTFLOW_EDGE_CHANGE,
          server: true,
          value: newRelations.map(relation => ({
            type: "add",
            item: relation,
          }))
        })

        updatedState.edges = [...state.edges, ...newRelations]
      }

      state.webrtc.broadcastData(broadcastData)

      return updatedState
    })
  }, [])

  return useMemo(() => ({
    onEdgesChange: handleEdgesChange,
    onConnect: handleConnect,
    onDrop: handleDrop,
    onBeforeDelete: handleBeforeDelete,
    onNodesChange: handleNodesChange,
    onNodeDragStop: handleNodeDragStop,
    onNodeDrag: handleNodeDrag,
    onMouseLeave: handleMouseLeave,
    onMouseMove: handleMouseMove,
    onMove: handleMove,
    onDragOver: handleDragOver,
    onNodeDoubleClick: handleNodeDoubleClick,
  }), [])
};
