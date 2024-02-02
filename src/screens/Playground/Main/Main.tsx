import React, {useRef} from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  ConnectionLineType,
  Controls,
  MiniMap,
  SelectionMode,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import "./style.css"
import {defaultEdgeOptions, edgeTypes} from "./edges";
import {nodeTypes} from "./nodes";
import Icons from "./Icons";
import {Helmet} from "react-helmet-async";
import {Player} from "@/enums/playground.ts";
import {usePlaygroundStore} from "@/stores/usePlaygroundStore.ts";
import PlayerCursor from "@/screens/Playground/Main/components/PlayerCursor";


export default function Main() {
  const nodes = usePlaygroundStore(state => state.getNodes());
  const edges = usePlaygroundStore(state => state.getEdges());
  const setNodeChanges = usePlaygroundStore(state => state.setNodeChanges)
  const setEdgeChanges = usePlaygroundStore(state => state.setEdgeChanges)
  const setConnection = usePlaygroundStore(state => state.setConnection)
  const nodeOnDragAdd = usePlaygroundStore(state => state.nodeOnDragAdd)
  const subscribedTo = usePlaygroundStore(state => state.subscribedTo)
  const playground = usePlaygroundStore(state => state.playground)
  const subscribers = usePlaygroundStore(state => state.subscribers)
  const viewport = usePlaygroundStore(state => state.viewport)
  const reactFlowInstance = useReactFlow()
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const onDragOver: React.DragEventHandler = React.useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  React.useEffect(() => {
    if (viewport && subscribedTo) {
      reactFlowInstance.setViewport(viewport)
    }
  }, [viewport, subscribedTo, reactFlowInstance.setViewport])

  React.useEffect(() => {
    if (reactFlowWrapper) {
      const onBlur = () => {
        playground.player(Player.mouseChange, null)
      }
      window.addEventListener('blur', onBlur)
      return () => {
        window.removeEventListener('blur', onBlur)
      }
    }
  }, [reactFlowWrapper])


  return (
    <div className={"erd-container"} ref={reactFlowWrapper}
         style={subscribedTo ? {border: "2px solid var(--mantine-primary-color-filled)"} : {border: "2px solid transparent"}}>
      <Helmet>
        <title>Erdiagramly</title>
      </Helmet>
      <Icons/>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={setNodeChanges}
        onEdgesChange={setEdgeChanges}
        onNodeDoubleClick={(_, node) => reactFlowInstance.fitView({nodes: [node], duration: 500})}
        onConnect={setConnection}
        connectionLineType={ConnectionLineType.Straight}
        minZoom={0.1}
        maxZoom={100}
        onDragOver={onDragOver}
        onDrop={nodeOnDragAdd({reactFlowInstance})}
        defaultEdgeOptions={defaultEdgeOptions}
        proOptions={{hideAttribution: true}}
        panOnScroll
        selectionOnDrag
        fitView
        onNodeDrag={(e) => {
          playground.player(Player.mouseChange, reactFlowInstance.screenToFlowPosition({
            x: e.clientX,
            y: e.clientY
          }))
        }}
        onMove={(_, viewport) => {
          console.log({viewport})
          if (subscribers.length > 0) {
            playground.player(Player.viewpointChange, viewport)
          }

        }}
        panOnDrag={[1, 2]}
        selectionMode={SelectionMode.Partial}
        onPaneMouseMove={(e) => {
          playground.player(Player.mouseChange, reactFlowInstance.screenToFlowPosition({
            x: e.clientX,
            y: e.clientY
          }))
        }}


        onClick={() => {
          if (subscribedTo) {
            console.log("subscribedTo")
            playground.player(Player.unsubscribe, subscribedTo)
          }
        }}
      >
        <PlayerCursor/>
        <Controls/>
        <MiniMap style={{right: "50px"}} zoomable pannable nodeStrokeWidth={20} nodeColor={node => node.data.color}/>
        <Background variant={BackgroundVariant.Dots} gap={20} size={1}/>
      </ReactFlow>
    </div>
  );
}

