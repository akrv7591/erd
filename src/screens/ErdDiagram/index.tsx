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
import {edgesUpdateAtom} from "../../atoms/edgesAtoms";
import {dragPaneAtom} from "../../atoms/toolAtom";
import {defaultEdgeOptions, edgeTypes} from "./edges";
import {nodeTypes} from "./nodes";
import Icons from "./Icons";
import {handleAddRelationAtom} from "../../atoms/utils/relationAddAtom";
import {nodeAddAtom} from "../../atoms/utils/nodeAddAtom";
import {useParams} from "react-router-dom";

const ErdFlow = () => {
  const [nodes] = useAtom(nodesAtom)
  const [edges, setEdges] = useAtom(edgesUpdateAtom)
  const setNode = useSetAtom(setNodes)
  const handleNodeAdd = useSetAtom(nodeAddAtom)
  const dragPane = useAtomValue(dragPaneAtom)
  const {project} = useReactFlow()
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const handleAddRelation = useSetAtom(handleAddRelationAtom)
  const params = useParams<{ erdUuid: string }>()

  return (
    <div className={"erd-container"} ref={reactFlowWrapper}>
      <Icons/>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={changedNodes => setNode({
          erdUuid: params.erdUuid as string,
          nodes: applyNodeChanges(changedNodes, nodes)
        })}
        onEdgesChange={changedEdges => setEdges({
          erdUuid: params.erdUuid as string,
          edges: applyEdgeChanges(changedEdges, edges)
        })}
        edgesUpdatable={false}
        nodesDraggable={true}
        panOnDrag={dragPane}
        onClick={e => handleNodeAdd({e, reactFlowWrapper, project})}
        onConnect={connection => handleAddRelation({erdUuid: params.erdUuid as string, connection})}
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


export default function ErdDiagram() {
  return (
    <ReactFlowProvider>
      <ErdFlow/>
    </ReactFlowProvider>

  )
}
