import {FC, memo, useMemo} from 'react';
import {ConnectionLineType, ReactFlow, SelectionMode} from '@xyflow/react';
import {defaultEdgeOptions, edgeTypes} from "./EdgeTypes";
import {nodeTypes} from "./NodeTypes";
import '@xyflow/react/dist/style.css';
import {FlowUtils} from "@/screens/Diagram/Main/FlowUtils";
import {useDiagramEventHandlers} from "@/hooks";
import "./style.css"
import { useDiagramStore } from '@/hooks';
import { LoadingBackdrop } from '@/components/common/LoadingBackdrop';

export const Main: FC = memo(() => {
  const nodes = useDiagramStore(state => state.nodes)
  const edges = useDiagramStore(state => state.edges)
  const diagramEventHandlers = useDiagramEventHandlers()
  const isConnected = useDiagramStore(state => state.isConnected)
  const subscribedTo = useDiagramStore(state => state.subscribedTo)
  const clients = useDiagramStore(state => state.clients)
  const subscribedClient = useMemo(() => {
    return clients.find(client => client.id === subscribedTo)
  }, [subscribedTo, clients])

  const style = useMemo(() => {
    if (!subscribedClient) {
      return {
        border: "1px solid transparent"
      }
    }

    return {
      border: `1px solid ${subscribedClient.color}`
    }
  }, [subscribedClient])

  if (!isConnected) {
    return (
      <LoadingBackdrop title="Socket is disconnected" />
    )
  }

  return (
    <div className={`erd-container`}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        colorMode={"dark"}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        connectionLineType={ConnectionLineType.Straight}
        minZoom={0}
        maxZoom={100}
        defaultEdgeOptions={defaultEdgeOptions}
        proOptions={{hideAttribution: true}}
        panOnScroll
        fitView
        snapToGrid
        snapGrid={[1,1]}
        style={style}
        selectionMode={SelectionMode.Partial}
        {...diagramEventHandlers}
      >
        <FlowUtils/>
      </ReactFlow>
    </div>
  );
})
