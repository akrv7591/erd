import React, {useRef} from 'react';
import ReactFlow, {
  applyEdgeChanges,
  Background,
  BackgroundVariant,
  ConnectionLineType,
  Controls,
  MiniMap,
  useReactFlow
} from 'reactflow';
import 'reactflow/dist/style.css';
import "./style.css"
import {defaultEdgeOptions, edgeTypes} from "./edges";
import {nodeTypes} from "./nodes";
import Icons from "./Icons";
import {useErdDiagramStore} from "../../hooks/erd/useErdDiagramStore";
import {useOnMount} from "../../hooks/useOnMount";
import {Helmet} from "react-helmet-async";

const ErdDiagram = () => {
  const [nodes, edges, setNodeChanges, setEdges, setConnection, addNode, dragPane] = useErdDiagramStore(state => [state.nodes, state.edges, state.setNodeChanges, state.setEdges, state.setConnection, state.addNode, state.dragPane])

  const {project} = useReactFlow()
  const reactFlowWrapper = useRef<HTMLDivElement>(null)

  useOnMount(() => {
  })

  return (
    <div className={"erd-container"} ref={reactFlowWrapper}>
      <Helmet>
        <title>Erd diagram</title>
      </Helmet>
      <Icons/>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={setNodeChanges}
        onEdgesChange={changedEdges => setEdges(applyEdgeChanges(changedEdges, edges))}
        edgesUpdatable={false}
        nodesDraggable={true}
        panOnDrag={dragPane}
        onClick={e => addNode({e, reactFlowWrapper, project})}
        onConnect={setConnection}
        connectionLineType={ConnectionLineType.Straight}
        fitView
        minZoom={0.1}
        maxZoom={100}
        defaultEdgeOptions={defaultEdgeOptions}
        proOptions={{hideAttribution: true}}
      >
        <Controls/>
        <MiniMap zoomable pannable nodeStrokeWidth={20}/>
        <Background variant={BackgroundVariant.Dots} gap={20} size={1}/>
      </ReactFlow>
    </div>
  );
}

export default ErdDiagram
