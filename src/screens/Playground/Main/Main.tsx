import {FC, memo} from 'react';
import {ConnectionLineType, ReactFlow, ReactFlowProps, SelectionMode,} from '@xyflow/react';
import {defaultEdgeOptions, edgeTypes} from "./edges";
import {NODE_TYPES, nodeTypes} from "./nodes";
import Icons from "./Icons";
import {Helmet} from "react-helmet-async";
import {UsePlaygroundStore, usePlaygroundStore} from "@/stores/usePlaygroundStore.ts";
import ConfirmModal from "@/components/common/ConfirmModal";
import '@xyflow/react/dist/style.css';
import "./style.css"
import FlowUtils from "@/screens/Playground/Main/FlowUtils/FlowUtils.tsx";
import {PlayerEnum} from "@/enums/playground.ts";
import {NodeType} from "@/types/playground";
import {useShallow} from "zustand/react/shallow";

const reactFlowSelectors = (state: UsePlaygroundStore): Partial<ReactFlowProps<NodeType>> => ({
  nodes: state.showMemos ? state.nodes : state.nodes.filter(node => node.type !== NODE_TYPES.MEMO),
  edges: state.relations,
  onNodesChange: state.setNodeChanges,
  onEdgesChange: state.setEdgeChanges,
  onConnect: state.setConnection,
  viewport: state.viewport || undefined,
  onDrop: state.nodeOnDragAdd,
  onNodeDrag: (e) => state.playground.handleMouseMove({x: e.clientX, y: e.clientY}),
  onMouseLeave: () => state.playground.handleMouseMove(null),
  onMouseMove: (e) => state.playground.handleMouseMove({x: e.clientX, y: e.clientY}),
  onMove: (e, viewport) => {
    if (state.subscribers.length > 0) {
      state.playground.player(PlayerEnum.viewpointChange, viewport)
    }

    if (!e) {
      return
    }

    if (e instanceof TouchEvent) {
      // TODO implement mouse move handler
    } else {
      state.playground.handleMouseMove({x: e.clientX, y: e.clientY})
    }
  },
  onClick: () => {
    if (state.subscribedTo) {
      state.playground.player(PlayerEnum.unsubscribe, state.subscribedTo)
    }
  },
  onDragOver: (e: any) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  },
  onBeforeDelete: ({nodes, edges}) => state.onBeforeDelete(state, nodes, edges),
})

const Main: FC = memo(() => {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onBeforeDelete,
    viewport,
    onDragOver,
    onDrop,
    onNodeDrag,
    onMouseLeave,
    onMouseMove,
    onMove,
    onNodeDoubleClick,
    onClick
  } = usePlaygroundStore(useShallow(reactFlowSelectors))
  const subscribedTo = usePlaygroundStore(useShallow(state => state.subscribedTo))

  return (
    <div className={`erd-container ${subscribedTo && "subscribed"}`}>
      <Helmet>
        <title>Erdiagramly</title>
      </Helmet>
      <ConfirmModal/>
      <Icons/>
      <ReactFlow

        // From state
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onBeforeDelete={onBeforeDelete}
        viewport={viewport}

        // Constants
        colorMode={"dark"}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        connectionLineType={ConnectionLineType.Straight}
        minZoom={0.1}
        maxZoom={100}
        defaultEdgeOptions={defaultEdgeOptions}
        proOptions={{hideAttribution: true}}
        panOnScroll
        fitView
        selectionOnDrag
        panOnDrag={[0, 1, 2, 3, 4]}
        selectionMode={SelectionMode.Partial}

        // Event handlers
        onDragOver={onDragOver}
        onDrop={onDrop}
        onClick={onClick}
        onMove={onMove}
        onNodeDoubleClick={onNodeDoubleClick}
        onNodeDrag={onNodeDrag}
        onMouseLeave={onMouseLeave}
        onMouseMove={onMouseMove}

      >
        <FlowUtils/>
      </ReactFlow>
    </div>
  );
})

export default Main
