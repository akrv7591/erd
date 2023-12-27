import React, {useRef} from 'react';
import ReactFlow, {
  Background,
  BackgroundVariant,
  ConnectionLineType,
  Controls,
  MiniMap,
  SelectionMode,
  useOnViewportChange,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import "./style.css"
import {defaultEdgeOptions, edgeTypes} from "./edges";
import {nodeTypes} from "./nodes";
import Icons from "./Icons";
import {Helmet} from "react-helmet-async";
import {Player} from "@/enums/playground.ts";
import {useErdDiagramStore} from "@/stores/useErdDiagramStore.ts";
import PlayerCursor from "@/screens/ErdDiagram/components/PlayerCursor";


const ErdDiagram = () => {
  const nodes = useErdDiagramStore(state => state.getNodes());
  const edges = useErdDiagramStore(state => state.getEdges());
  const setNodeChanges = useErdDiagramStore(state => state.setNodeChanges)
  const setEdgeChanges = useErdDiagramStore(state => state.setEdgeChanges)
  const setConnection = useErdDiagramStore(state => state.setConnection)
  const nodeOnDragAdd = useErdDiagramStore(state => state.nodeOnDragAdd)
  const subscribedTo = useErdDiagramStore(state => state.subscribedTo)
  const playground = useErdDiagramStore(state => state.playground)
  const subscribers = useErdDiagramStore(state => state.subscribers)
  const viewport = useErdDiagramStore(state => state.viewport)

  const reactFlowInstance = useReactFlow()
  const reactFlowWrapper = useRef<HTMLDivElement>(null)

  useOnViewportChange({
    onChange: (viewport) => {
      if (subscribers.length > 0) {
        playground.player(Player.viewpointChange, viewport)
      }
    }
  })

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
        onConnect={(connection) => setConnection(connection)}
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
        panOnDrag={[1, 2]}
        selectionMode={SelectionMode.Partial}
        onMouseMove={(e) => {
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

export default ErdDiagram
