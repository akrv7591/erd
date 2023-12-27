import {Connection, Edge, EdgeChange, NodeChange, ReactFlowInstance, Viewport} from "reactflow";
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


export interface IErdDiagramState extends Omit<IErd, 'users' | 'relations' | 'tables'>{
  tool: ITools;
  players: IPlayer[];
  tables: ITableNode[];
  relations: Edge[];
  playground: PlaygroundService;
  subscribedTo: IPlayer | null;
  viewport: Viewport | null;
  subscribers: IPlayer[];
}

export interface IErdDiagramViews {
  getNodes: () => ITableNode[];
  getEdges: () => Edge[];
}

export interface IErDiagramActions {
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
  reset: () => void
}

export type IErdDiagram = IErdDiagramState & IErdDiagramViews & IErDiagramActions

export type INodes = ITableNode
