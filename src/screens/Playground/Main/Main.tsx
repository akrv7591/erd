import {FC, memo} from 'react';
import {ConnectionLineType, ReactFlow, SelectionMode,} from '@xyflow/react';
import {defaultEdgeOptions, edgeTypes} from "./EdgeTypes";
import {nodeTypes} from "./NodeTypes";
import '@xyflow/react/dist/style.css';
import {FlowUtils} from "@/screens/Playground/Main/FlowUtils";
import {useEdges} from "@/hooks/Diagram/useEdges.ts";
import {useNodes} from "@/hooks/Diagram/useNodes.ts";
import {useDiagramEventHandlers} from "@/hooks/Diagram/useDiagramEventHandlers.ts";
import "./style.css"

export const Main: FC = memo(() => {
  const nodes = useNodes()
  const edges = useEdges()
  const diagramEventHandlers = useDiagramEventHandlers()

  return (
    <div className={`erd-container`}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        // Default constants
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
