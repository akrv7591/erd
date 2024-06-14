import {FC, memo} from 'react';
import {ConnectionLineType, ReactFlow, ReactFlowProps, SelectionMode} from '@xyflow/react';
import {defaultEdgeOptions, edgeTypes} from "./EdgeTypes";
import {NODE_TYPES, nodeTypes} from "./NodeTypes";
import {PlaygroundStore} from "@/stores/playgroundStore.ts";
import {FlowUtils} from "@/screens/Playground/Main/FlowUtils/FlowUtils.tsx";
import {NodeType} from "@/types/playground";
import {useShallow} from "zustand/react/shallow";
import {usePlayground} from "@/contexts/playground/PlaygroundStoreContext.ts";
import '@xyflow/react/dist/style.css';
import "./style.css"

const reactFlowSelectors = (state: PlaygroundStore): Partial<ReactFlowProps<NodeType>> => ({
  nodes: state.showMemos ? state.nodes : state.nodes.filter(node => node.type !== NODE_TYPES.MEMO),
  edges: state.relations,
  onNodesChange: state.setNodeChanges,
  onEdgesChange: state.setEdgeChanges,
  onConnect: state.setConnection,
  onDrop: state.nodeOnDragAdd,
  onNodeDrag: (e) => state.playground.handleMouseMove({x: e.clientX, y: e.clientY}),
  onMouseLeave: () => state.playground.handleMouseMove(null),
  onMouseEnter: (e) => state.playground.handleMouseMove({x: e.clientX, y: e.clientY}),
  onBeforeDelete: ({nodes, edges}) => state.onBeforeDelete(state, nodes, edges),
  onNodeDoubleClick: (_, node) => state.playground.reactFlow.fitView({nodes: [node], duration: 500, padding: 0.3}),
  onMouseMove: (e) => state.playground.handleMouseMove({x: e.clientX, y: e.clientY}),
  onClick: () => {
    if (state.subscribedTo) {
      state.playground.handlePlayerUnsubscribe(state.subscribedTo)
    }
  },
  onDragOver: (e: any) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  },
  onMove: (e, viewport) => {
    if (e instanceof MouseEvent) {
      state.playground.handleMouseMove({x: e.clientX, y: e.clientY})
    }

    if (state.subscribers.length) {
      state.playground.handleViewportChange({viewport})
    }
  },
})


export const Main: FC = memo(() => {
  const reactFlowProps = usePlayground(useShallow(reactFlowSelectors))

  return (
    <div className={`erd-container`}>
      <ReactFlow
        // Default constants
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
        // snapToGrid
        // snapGrid={[30, 30]}

        {...reactFlowProps}
      >
        <FlowUtils/>
      </ReactFlow>
    </div>
  );
})
