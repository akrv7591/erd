import {useRef} from 'react';
import ReactFlow, {
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
import {Helmet} from "react-helmet-async";

const useErdDiagramSelectors = () => {
  const nodes = useErdDiagramStore(state => state.nodes);
  const edges = useErdDiagramStore(state => state.edges);
  const setNodeChanges = useErdDiagramStore(state => state.setNodeChanges)
  const setEdgeChanges = useErdDiagramStore(state => state.setEdgeChanges)
  const setConnection = useErdDiagramStore(state => state.setConnection)
  const addNode = useErdDiagramStore(state => state.addNode)
  const dragPane = useErdDiagramStore(state => state.dragPane)

  return {
    nodes,
    edges,
    setNodeChanges,
    setEdgeChanges,
    setConnection,
    addNode,
    dragPane,
  }
}

const ErdDiagram = () => {
  const store = useErdDiagramSelectors()
  const {project} = useReactFlow()
  const reactFlowWrapper = useRef<HTMLDivElement>(null)

  return (
    <div className={"erd-container"} ref={reactFlowWrapper}>
      <Helmet>
        <title>Erd diagram</title>
      </Helmet>
      <Icons/>
      <ReactFlow
        nodes={store.nodes}
        edges={store.edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesDelete={(nodes) => console.log(nodes)}
        onNodesChange={store.setNodeChanges}
        onEdgesChange={store.setEdgeChanges}
        edgesUpdatable={false}
        nodesDraggable={true}
        panOnDrag={store.dragPane}
        onClick={e => store.addNode({e, reactFlowWrapper, project})}
        onConnect={store.setConnection}
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
