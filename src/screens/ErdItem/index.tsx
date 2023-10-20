import React, {useRef} from 'react';
import ReactFlow, {
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  BackgroundVariant,
  ConnectionLineType,
  Controls,
  MiniMap,
  ReactFlowProvider,
  useReactFlow
} from 'reactflow';
import 'reactflow/dist/style.css';
import "./style.css"
import {useAtom, useAtomValue, useSetAtom} from "jotai";
import {nodesAtom, setNodes} from "../../atoms/nodesAtoms";
import {edgesAtoms} from "../../atoms/edgesAtoms";
import {dragPaneAtom} from "../../atoms/toolAtom";
import {defaultEdgeOptions, edgeTypes} from "./edges";
import {nodeTypes} from "./nodes";
import Icons from "./Icons";
import {handleAddRelationAtom} from "../../atoms/utils/relationAddAtom";
import {nodeAddAtom} from "../../atoms/utils/nodeAddAtom";


const ErdFlow = () => {
  const [nodes] = useAtom(nodesAtom)
  const [edges, setEdges] = useAtom(edgesAtoms)
  const setNode = useSetAtom(setNodes)
  const handleNodeAdd = useSetAtom(nodeAddAtom)
  const dragPane = useAtomValue(dragPaneAtom)
  const {project} = useReactFlow()
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const handleAddRelation = useSetAtom(handleAddRelationAtom)

  return (
    <div className={"erd-container"} ref={reactFlowWrapper}>
      <Icons/>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={changedNodes => setNode(applyNodeChanges(changedNodes, nodes))}
        onEdgesChange={changedEdges => setEdges(cur => applyEdgeChanges(changedEdges, cur))}
        edgesUpdatable={false}
        nodesDraggable={true}
        panOnDrag={dragPane}
        onClick={e => handleNodeAdd({e, reactFlowWrapper, project})}
        onConnect={params => handleAddRelation(params)}
        connectionLineType={ConnectionLineType.Straight}
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


export default function ErdItem() {
  return (
    <ReactFlowProvider>
      <ErdFlow/>
    </ReactFlowProvider>

  )
}
