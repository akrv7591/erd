import {Connection, Edge, EdgeChange, NodeChange, ReactFlowInstance, Viewport} from "@xyflow/react";
import {IPlayer, ITableNode, ITableNodeColumn, ITools} from "@/types/table-node";
import {IErd} from "@/types/data/db-model-interfaces";
import {PlaygroundService, ResponseData} from "@/services/multiplayer/playground-service.ts";
import React from "react";
import {Playground} from "@/enums/playground.ts";

export interface IAddNodeProps {
  reactFlowInstance: ReactFlowInstance
}

export interface IConnectionData {
  relations: Edge[]
  columns: ITableNodeColumn[]
  tables: ITableNode[]
}

interface IHighlightedRelation {
  startNodeId: string
  endNodeColumnId: string
}


export interface IPlaygroundState extends Omit<IErd, 'users' | 'relations' | 'tables'>{
  tool: ITools;
  players: IPlayer[];
  tables: ITableNode[];
  relations: Edge[];
  playground: PlaygroundService;
  subscribedTo: IPlayer | null;
  viewport: Viewport | null;
  subscribers: string[];
  highlightedRelation: null | IHighlightedRelation;
  zoom: number
}

export interface IPlaygroundViews {
  getNodes: () => ITableNode[];
  getEdges: () => Edge[];
}

export interface IPlaygroundActions {
  // Actions
  setViewport: (viewport: Viewport) => void

  // Node actions
  setNodeChanges: (nodeChanges: NodeChange[]) => void
  // setNodeChanges: React.DragEventHandler

  nodeOnDragAdd: (props: IAddNodeProps) => React.DragEventHandler<HTMLDivElement>

  // Relation actions
  setEdgeChanges: (edgeChanges: EdgeChange[]) => void
  setConnection: (connection: Connection) => void
  addOneToOneRelations: (sourceNode: ITableNode, targetNode: ITableNode, data: IConnectionData) => void
  addOneToManyRelations: (sourceNode: ITableNode, targetNode: ITableNode, data: IConnectionData) => void
  addManyToManyRelations: (sourceNode: ITableNode, targetNode: ITableNode, data: IConnectionData) => void

  // Tools
  setTool: (tool: ITools) => void
  handlePlaygroundResponse: (res: ResponseData<Playground>) => void

  // Other
  setHighlightedRelation: (highlightedRelation: null | IHighlightedRelation) => void
  setZoom: (zoom: number) => void

  // Cleanup
  reset: () => void
}

export type IErdDiagram = IPlaygroundState & IPlaygroundViews & IPlaygroundActions
