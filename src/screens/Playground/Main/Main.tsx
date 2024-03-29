import {useRef} from 'react';
import {Background, BackgroundVariant, ConnectionLineType, MiniMap, ReactFlow, SelectionMode,} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import "./style.css"
import {defaultEdgeOptions, edgeTypes} from "./edges";
import {nodeTypes} from "./nodes";
import Icons from "./Icons";
import {Helmet} from "react-helmet-async";
import {usePlaygroundStore} from "@/stores/usePlaygroundStore.ts";
import PlayerCursor from "@/screens/Playground/Main/components/PlayerCursor";
import {usePlaygroundEvents} from "@/hooks/playground/usePlaygroundEvents.ts";
import {EntityNode} from "@/types/entity-node";
import ConfirmModal from "@/components/common/ConfirmModal";

export default function Main() {
  const nodes = usePlaygroundStore(state => state.getNodes());
  const edges = usePlaygroundStore(state => state.getEdges());
  const setNodeChanges = usePlaygroundStore(state => state.setNodeChanges)
  const setEdgeChanges = usePlaygroundStore(state => state.setEdgeChanges)
  const setConnection = usePlaygroundStore(state => state.setConnection)
  const subscribedTo = usePlaygroundStore(state => state.subscribedTo)
  const onBeforeDelete = usePlaygroundStore(state => state.onBeforeDelete)
  const minimap = usePlaygroundStore(state => state.minimap)
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const playgroundEvents = usePlaygroundEvents()

  return (
    <div
      className={`erd-container ${subscribedTo && "subscribed"}`}
      ref={reactFlowWrapper}
    >
      <Helmet>
        <title>Erdiagramly</title>
      </Helmet>
      <ConfirmModal />
      <Icons/>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={setNodeChanges}
        onEdgesChange={setEdgeChanges}
        onConnect={setConnection}
        connectionLineType={ConnectionLineType.Straight}
        minZoom={0.1}
        maxZoom={100}
        onBeforeDelete={onBeforeDelete}
        defaultEdgeOptions={defaultEdgeOptions}
        proOptions={{hideAttribution: true}}
        panOnScroll
        selectionOnDrag
        fitView
        panOnDrag={[1, 2]}
        selectionMode={SelectionMode.Partial}
        onNodeDragStop={(_, node, nodes) => {
          console.log({
            node, nodes
          })
        }}
        {...playgroundEvents}
      >
        <PlayerCursor/>
        {minimap && <MiniMap zoomable pannable nodeStrokeWidth={20} nodeColor={(node: EntityNode) => node.data.color}/>}
        <Background variant={BackgroundVariant.Dots} gap={20} size={1}/>
      </ReactFlow>
    </div>
  );
}

