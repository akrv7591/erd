import { RELATION } from "@/namespaces"
import { EntityColumn, EntityNode } from "@/types/diagram"
import { NODE_TYPES } from "@/screens/Diagram/Main/NodeTypes"
import voca from "voca"
import {ShortId} from "@/utility/ShortId";
import { EntityEdge, EntityEdgeData } from "@/types/diagram/edge";
import { EDGE_TYPES } from "@/screens/Diagram/Main/EdgeTypes";

type GenerateEntityConnectDataArgs = {
  sourceEntity: EntityNode,
  targetEntity: EntityNode,
  relationType: RELATION.NAME
}

type EntityConnectData = {
  newRelations: EntityEdge[],
  newTargetNodeColumns: EntityColumn[],
  newEntities: EntityNode[]
}

type RelationArgs = Pick<GenerateEntityConnectDataArgs, 'sourceEntity' | 'targetEntity'> & {
  data: EntityConnectData
}

export class RelationUtils {
  static generateEntityConnectData = ({sourceEntity, targetEntity, relationType}: GenerateEntityConnectDataArgs) => {

    const data: EntityConnectData = {
      newRelations: [],
      newTargetNodeColumns: [],
      newEntities: []
    }

    switch (relationType) {
      case RELATION.NAME.ONE_TO_ONE:
        this.handleOneToOneRelation({ sourceEntity, targetEntity, data })
        break
      case RELATION.NAME.ONE_TO_MANY:
        this.handleOneToManyRelation({sourceEntity, targetEntity, data})
        break
      case RELATION.NAME.MANY_TO_MANY:
        this.handleManyToManyRelation({ sourceEntity, targetEntity, data })
        break
    }

    return data
  }

  private static handleOneToOneRelation = ({sourceEntity, targetEntity, data}: RelationArgs) => {
    const sourceColumns = sourceEntity.data.columns
    const sourcePrimaryKeys = sourceColumns.filter(column => column.primary)
    const sourceTableName = sourceEntity.data.name
    const relationData: EntityEdgeData = {
      foreignKeyColumns: [],
      relationName: RELATION.NAME.ONE_TO_ONE
    }

    sourcePrimaryKeys.forEach((column) => {
      const id = ShortId.create()
      const foreignKeyColumn: EntityColumn = {
        ...column,
        id,
        entityId: targetEntity.id,
        name: voca.snakeCase(sourceTableName + voca.titleCase(column.name)),
        foreignKey: true,
        primary: false,
        autoIncrement: false,
        unique: true,
      }
      relationData.foreignKeyColumns.push({
        sourceColumnId: id,
        targetColumnId: column.id
      })
      data.newTargetNodeColumns.push(foreignKeyColumn)
    })

    const foreignKeyRelation: EntityEdge = {
      id: ShortId.create(),
      type: EDGE_TYPES.ENTITY,
      source: sourceEntity.id,
      target: targetEntity.id,
      markerStart: RELATION.TYPE.ONE,
      markerEnd: RELATION.TYPE.MANY,
      data: relationData
    }
    data.newRelations.push(foreignKeyRelation)
  }

  private static handleOneToManyRelation = ({sourceEntity, targetEntity, data}: RelationArgs) => {
    const sourceColumns = sourceEntity.data.columns
    const sourceTablePrimaryKeys = sourceColumns.filter(column => column.primary)
    const sourceTableName = sourceEntity.data.name
    const relationData: EntityEdgeData = {
      foreignKeyColumns: [],
      relationName: RELATION.NAME.ONE_TO_MANY
    }

    sourceTablePrimaryKeys.map((column) => {
      const id = ShortId.create()
      const targetNodeForeignColumn: EntityColumn = {
          ...column,
          id,
          entityId: targetEntity.id,
          name: voca.snakeCase(sourceTableName + voca.titleCase(column.name)),
          foreignKey: true,
          primary: false,
          autoIncrement: false,
          unique: false
      }
      relationData.foreignKeyColumns.push({
        sourceColumnId: id,
        targetColumnId: column.id
      })
      data.newTargetNodeColumns.push(targetNodeForeignColumn)
    })
    const foreignKeyRelation: EntityEdge = {
      id: ShortId.create(),
      type: EDGE_TYPES.ENTITY,
      source: sourceEntity.id,
      target: targetEntity.id,
      markerStart: RELATION.TYPE.ONE,
      markerEnd: RELATION.TYPE.MANY,
      data: relationData
    }
    data.newRelations.push(foreignKeyRelation)
  }

  private static handleManyToManyRelation = ({sourceEntity, targetEntity, data}: RelationArgs) => {
    const entityName = sourceEntity.data.name + targetEntity.data.name
    const sourceColumns = sourceEntity.data.columns
    const targetColumns = targetEntity.data.columns

    const mnTable: EntityNode = {
      id: ShortId.create(),
      type: NODE_TYPES.ENTITY,
      position: {
        x: (sourceEntity.position.x + targetEntity.position.x) / 2,
        y: (sourceEntity.position.y + targetEntity.position.y) / 2
      },
      data: {
        name: entityName,
        color: "#006ab9",
        columns: [],
      }
    }

    function populateColumnsAndEdges(column: EntityColumn, tableName: string, relationData: EntityEdgeData) {
      const id = ShortId.create()

      relationData.foreignKeyColumns.push({
        sourceColumnId: column.id,
        targetColumnId: id
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

    const sourceRelationData: EntityEdgeData = {
      foreignKeyColumns: [],
      relationName: RELATION.NAME.ONE_TO_MANY
    }

    const targetRelationData: EntityEdgeData = {
      foreignKeyColumns: [],
      relationName: RELATION.NAME.ONE_TO_MANY
    }

    sourceColumns
      .filter(column => column.primary)
      .forEach(column => populateColumnsAndEdges(column, sourceEntity.data.name, sourceRelationData))
    targetColumns
      .filter(column => column.primary)
      .forEach(column => populateColumnsAndEdges(column, targetEntity.data.name, targetRelationData))

    const sourceRelation: EntityEdge = {
      id: ShortId.create(),
      type: EDGE_TYPES.ENTITY,
      source: sourceEntity.id,
      target: mnTable.id,
      markerStart: RELATION.TYPE.ONE,
      markerEnd: RELATION.TYPE.MANY,
      data: sourceRelationData
    }

    const targetRelation: EntityEdge = {
      id: ShortId.create(),
      type: EDGE_TYPES.ENTITY,
      source: targetEntity.id,
      target: mnTable.id,
      markerStart: RELATION.TYPE.ONE,
      markerEnd: RELATION.TYPE.MANY,
      data: targetRelationData
    }

    data.newRelations.push(sourceRelation, targetRelation)
    data.newEntities.push(mnTable)
  }
}
