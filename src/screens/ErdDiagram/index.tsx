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
import {useErdDiagramStore} from "@/stores/useErdDiagramStore.ts";
import {Helmet} from "react-helmet-async";

const useErdDiagramSelectors = () => {
  const nodes = useErdDiagramStore(state => state.getNodes());
  const edges = useErdDiagramStore(state => state.getEdges());
  const setNodeChanges = useErdDiagramStore(state => state.setNodeChanges)
  const setEdgeChanges = useErdDiagramStore(state => state.setEdgeChanges)
  const setConnection = useErdDiagramStore(state => state.setConnection)
  const addTableOnClick = useErdDiagramStore(state => state.addTableOnClick)
  const setSubscribedTo = useErdDiagramStore(state => state.setSubscribedTo)
  const subscribedTo = useErdDiagramStore(state => state.subscribedTo)

  return {
    nodes,
    edges,
    setNodeChanges,
    setEdgeChanges,
    setConnection,
    addTableOnClick,
    setSubscribedTo,
    subscribedTo
  }
}


const ErdDiagram = () => {
  const store = useErdDiagramSelectors()
  const multiplayer = useErdDiagramStore(state => state.multiplayer)
  const viewport = useErdDiagramStore(state => state.viewport)
  const reactFlowInstance = useReactFlow()
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  useOnViewportChange({onChange: (viewport) => multiplayer.handleSubscribeData("viewport", viewport)})

  const onDragOver: React.DragEventHandler = React.useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);


  React.useEffect(() => {
    if (viewport && store.subscribedTo) {
      reactFlowInstance.setViewport(viewport)
    }
  }, [viewport, store.subscribedTo, reactFlowInstance.setViewport])


  const onDrop: React.DragEventHandler = React.useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');

      console.log({type})

      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }

      store.addTableOnClick({e: event, reactFlowInstance})
    },
    [reactFlowInstance],
  );

  return (
    <div className={"erd-container"} ref={reactFlowWrapper} style={store.subscribedTo? {border: "2px solid var(--mantine-primary-color-filled)"}: {border: "2px solid transparent"}}>
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
        onNodeDoubleClick={(_, node) => reactFlowInstance.fitView({nodes: [node], duration: 500})}
        onConnect={(connection) => store.setConnection(connection)}
        connectionLineType={ConnectionLineType.Straight}
        minZoom={0.1}
        maxZoom={100}
        onDragOver={onDragOver}
        onDrop={onDrop}
        defaultEdgeOptions={defaultEdgeOptions}
        proOptions={{hideAttribution: true}}
        panOnScroll
        selectionOnDrag
        fitView
        panOnDrag={[1, 2]}
        selectionMode={SelectionMode.Partial}
        onClick={() => store.setSubscribedTo(null)}
      >
        {/*<RightToolbar/>*/}
        <Controls/>
        <MiniMap style={{right: "50px"}} zoomable pannable nodeStrokeWidth={20} nodeColor={node => node.data.color}/>
        <Background variant={BackgroundVariant.Dots} gap={20} size={1}/>
      </ReactFlow>
    </div>
  );
}

export default ErdDiagram
