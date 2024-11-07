import { RELATION } from "@/namespaces"
import { EntityColumn, EntityNode } from "@/types/diagram"
import { NODE_TYPES } from "@/screens/Diagram/Main/NodeTypes"
import { createId } from "@paralleldrive/cuid2"
import { Edge } from "@xyflow/react"
import voca from "voca"

type GenerateEntityConnectDataArgs = {
  sourceNode: EntityNode,
  targetNode: EntityNode,
  relationType: RELATION.NAME
}

type EntityConnectData = {
  newRelations: Edge[],
  newTargetNodeColumns: EntityColumn[],
  newEntities: EntityNode[]
}

type RelationArgs = Pick<GenerateEntityConnectDataArgs, 'sourceNode' | 'targetNode'> & {
  data: EntityConnectData
}

export class RelationUtils {
  static generateEntityConnectData = ({sourceNode, targetNode, relationType}: GenerateEntityConnectDataArgs) => {

    const data: EntityConnectData = {
      newRelations: [],
      newTargetNodeColumns: [],
      newEntities: []
    }

    switch (relationType) {
      case RELATION.NAME.ONE_TO_ONE:
        this.handleOneToOneRelation({ sourceNode, targetNode, data })
        break
      case RELATION.NAME.ONE_TO_MANY:
        this.handleOneToManyRelation({sourceNode, targetNode, data})
        break
      case RELATION.NAME.MANY_TO_MANY:
        this.handleManyToManyRelation({ sourceNode, targetNode, data })
        break
    }

    return data
  }

  private static handleOneToOneRelation = ({sourceNode, targetNode, data}: RelationArgs) => {
    const sourceColumns = sourceNode.data.columns
    const sourcePrimaryKeys = sourceColumns.filter(column => column.primary)
    const sourceTableName = sourceNode.data.name

    sourcePrimaryKeys.forEach((column) => {
      const id = createId()
      const foreignKeyRelation: Edge = {
        id,
        source: sourceNode.id,
        target: targetNode.id,
        markerEnd: RELATION.NAME.ONE_TO_ONE,
      }
      const foreignKeyColumn: EntityColumn = {
        ...column,
        id,
        entityId: targetNode.id,
        name: voca.snakeCase(sourceTableName + voca.titleCase(column.name)),
        foreignKey: true,
        primary: false,
        autoIncrement: false,
        unique: true,
      }

      data.newRelations.push(foreignKeyRelation)
      data.newTargetNodeColumns.push(foreignKeyColumn)
    })
  }

  private static handleOneToManyRelation = ({sourceNode, targetNode, data}: RelationArgs) => {
    const sourceColumns = sourceNode.data.columns
    const sourceTablePrimaryKeys = sourceColumns.filter(column => column.primary)
    const sourceTableName = sourceNode.data.name

    sourceTablePrimaryKeys.map((column) => {
      const id = createId()
      const foreignKeyRelation: Edge = {
        id,
        source: sourceNode.id,
        target: targetNode.id,
        markerEnd: RELATION.NAME.ONE_TO_MANY,
      }
      const targetNodeForeignColumn: EntityColumn = {
          ...column,
          id,
          entityId: targetNode.id,
          name: voca.snakeCase(sourceTableName + voca.titleCase(column.name)),
          foreignKey: true,
          primary: false,
          autoIncrement: false,
          unique: false
      }
      data.newRelations.push(foreignKeyRelation)
      data.newTargetNodeColumns.push(targetNodeForeignColumn)
    })
  }

  private static handleManyToManyRelation = ({sourceNode, targetNode, data}: RelationArgs) => {
    const entityName = sourceNode.data.name + targetNode.data.name
    const sourceColumns = sourceNode.data.columns
    const targetColumns = targetNode.data.columns

    const mnTable: EntityNode = {
      id: createId(),
      type: NODE_TYPES.ENTITY,
      position: {
        x: (sourceNode.position.x + targetNode.position.x) / 2,
        y: (sourceNode.position.y + targetNode.position.y) / 2
      },
      data: {
        name: entityName,
        color: "#006ab9",
        columns: [],
      }
    }

    function populateColumnsAndEdges(column: EntityColumn, tableName: string, nodeId: string) {
      const id = createId()

      data.newRelations.push({
        id,
        source: nodeId,
        target: mnTable.id,
        markerEnd: RELATION.NAME.ONE_TO_MANY,
      })

      mnTable.data.columns.push({
        ...column,
        entityId: mnTable.id,
        id,
        name: voca.snakeCase(tableName + voca.titleCase(column.name)),
        foreignKey: true,
        primary: true,
        unique: false
      })
    }

    sourceColumns
      .filter(column => column.primary)
      .forEach(column => populateColumnsAndEdges(column, sourceNode.data.name, sourceNode.id))
    targetColumns
      .filter(column => column.primary)
      .forEach(column => populateColumnsAndEdges(column, targetNode.data.name, targetNode.id))

    data.newEntities.push(mnTable)
  }
}
