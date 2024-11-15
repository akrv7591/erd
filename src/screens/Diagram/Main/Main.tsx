import {FC, memo} from 'react';
import {ConnectionLineType, ReactFlow, SelectionMode} from '@xyflow/react';
import {defaultEdgeOptions, edgeTypes} from "./EdgeTypes";
import {nodeTypes} from "./NodeTypes";
import '@xyflow/react/dist/style.css';
import {FlowUtils} from "@/screens/Diagram/Main/FlowUtils";
import {useDiagramEventHandlers} from "@/hooks";
import "./style.css"
import { useDiagramStore } from '@/hooks';

export const Main: FC = memo(() => {
  const nodes = useDiagramStore(state => state.nodes)
  const edges = useDiagramStore(state => state.edges)
  const diagramEventHandlers = useDiagramEventHandlers()

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
        selectionMode={SelectionMode.Partial}
        {...diagramEventHandlers}
      >
        <FlowUtils/>
      </ReactFlow>
    </div>
  );
})
