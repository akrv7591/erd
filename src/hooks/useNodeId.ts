import { useNodeId as useReactFlowNodeId } from "@xyflow/react";

export const useNodeId = () => {
    const nodeId = useReactFlowNodeId();

    if (!nodeId) {
        throw new Error("useNodeId must be used within a ReactFlow Node")
    }

    return nodeId
}