import {useRef} from 'react';
import ReactFlow, {
  Background,
  BackgroundVariant,
  ConnectionLineType,
  Controls,
  MiniMap,
  SelectionMode,
  useReactFlow
} from 'reactflow';
import 'reactflow/dist/style.css';
import "./style.css"
import {defaultEdgeOptions, edgeTypes} from "./edges";
import {nodeTypes} from "./nodes";
import Icons from "./Icons";
import {useErdDiagramStore} from "@/stores/useErdDiagramStore.ts";
import {Helmet} from "react-helmet-async";
import RightToolbar from "./panels/RightToolbar";

const useErdDiagramSelectors = () => {
  const nodes = useErdDiagramStore(state => state.getNodes());
  const edges = useErdDiagramStore(state => state.getEdges());
  const setNodeChanges = useErdDiagramStore(state => state.setNodeChanges)
  const setEdgeChanges = useErdDiagramStore(state => state.setEdgeChanges)
  const setConnection = useErdDiagramStore(state => state.setConnection)
  const addTableOnClick = useErdDiagramStore(state => state.addTableOnClick)

  return {
    nodes,
    edges,
    setNodeChanges,
    setEdgeChanges,
    setConnection,
    addTableOnClick,
  }
}

const ErdDiagram = () => {
  const store = useErdDiagramSelectors()
  const reactFlowInstance = useReactFlow()

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
        onClick={e => store.addTableOnClick({e, reactFlowWrapper, reactFlowInstance})}
        onNodeDoubleClick={(_, node) => reactFlowInstance.fitView({nodes: [node], duration: 500})}
        onConnect={(connection) => store.setConnection(connection)}
        connectionLineType={ConnectionLineType.Straight}
        minZoom={0.1}
        maxZoom={100}
        defaultEdgeOptions={defaultEdgeOptions}
        proOptions={{hideAttribution: true}}
        panOnScroll
        selectionOnDrag
        fitView
        panOnDrag={[1, 2]}
        selectionMode={SelectionMode.Partial}
      >
        <RightToolbar/>
        <Controls/>
        <MiniMap style={{right: "50px"}} zoomable pannable nodeStrokeWidth={20} nodeColor={node => node.data.color}/>
        <Background variant={BackgroundVariant.Dots} gap={20} size={1}/>
      </ReactFlow>
    </div>
  );
}

export default ErdDiagram
