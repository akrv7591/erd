import {FC, memo} from 'react';
import {ConnectionLineType, ReactFlow, ReactFlowProps, SelectionMode,} from '@xyflow/react';
import {defaultEdgeOptions, edgeTypes} from "./edges";
import {NODE_TYPES, nodeTypes} from "./nodes";
import {Helmet} from "react-helmet-async";
import {UsePlaygroundStore, usePlaygroundStore} from "@/stores/usePlaygroundStore.ts";
import FlowUtils from "@/screens/Playground/Main/FlowUtils/FlowUtils.tsx";
import {PlayerEnum} from "@/enums/playground.ts";
import {NodeType} from "@/types/playground";
import {useShallow} from "zustand/react/shallow";
import '@xyflow/react/dist/style.css';
import "./style.css"

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
  onMouseEnter: (e) => state.playground.handleMouseMove({x: e.clientX, y: e.clientY}),
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
  onNodeDoubleClick: (_, node) => state.playground.reactFlow.fitView({nodes: [node], duration: 500, padding: 0.3}),
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
    onMouseEnter,
    onMove,
    onNodeDoubleClick,
    onClick,
    onEdgeMouseEnter,
    onEdgeMouseLeave
  } = usePlaygroundStore(useShallow(reactFlowSelectors))
  // const subscribedTo = usePlaygroundStore(useShallow(state => state.subscribedTo))

  console.log("RENDERING MAIN")


  return (
    <div className={`erd-container`}>
      <Helmet>
        <title>Erdiagramly</title>
      </Helmet>
      <ReactFlow
        // From state
        nodes={nodes}
        edges={edges}
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
        snapToGrid
        snapGrid={[30, 30]}

        // Event handlers from state
        onDragOver={onDragOver}
        onDrop={onDrop}
        onClick={onClick}
        onMove={onMove}
        onNodeDoubleClick={onNodeDoubleClick}
        onNodeDrag={onNodeDrag}
        onMouseLeave={onMouseLeave}
        onMouseEnter={onMouseEnter}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onBeforeDelete={onBeforeDelete}
        onEdgeMouseEnter={onEdgeMouseEnter}
        onEdgeMouseLeave={onEdgeMouseLeave}
      >
        <FlowUtils/>
      </ReactFlow>
    </div>
  );
})

export default Main
