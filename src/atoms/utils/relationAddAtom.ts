import {atom, PrimitiveAtom} from "jotai";
import {Connection, Edge} from "reactflow";
import {v4} from "uuid";
import {toolAtom} from "../toolAtom";
import {RELATIONS} from "../../constants/relations";
import voca from "voca";
import {IColumn} from "../columnAtom";
import {IData} from "../../providers/TableDataProvider";
import {edgesAtoms, edgesUpdateAtom} from "../edgesAtoms";
import {INode, nodesAtom} from "../nodesAtoms";

export const handleAddRelationAtom = atom(null, (get, set, {connection, erdUuid}: {connection: Connection, erdUuid: string}) => {
  const nodes = get(nodesAtom)
  const targetNode = nodes.find(node => node.id === connection.target)!
  const sourceNode = nodes.find(node => node.id === connection.source)!

  if (targetNode.id === sourceNode.id) return

  const targetColumns = get(targetNode.data).columns
  const sourcePrimaryColumns = get(get(sourceNode.data).columns).filter(columnAtom => get(columnAtom).primary).map(columnAtom => ({...get(columnAtom), tableName: get(sourceNode.data).tableName, id: v4(), tableId: sourceNode.id}))
  let edges: Edge[] = []

  switch (get(toolAtom)) {
    case RELATIONS.ONE_TO_ONE:
      set(targetColumns, cur => [...cur, ...sourcePrimaryColumns.map(({tableName, tableId, ...column}) => {
        edges.push({
          source: sourceNode.id,
          target: targetNode.id,
          markerEnd: RELATIONS.ONE_TO_ONE,
          id: targetNode.id + column.id
        })
        return atom({
          ...column,
          column: voca.snakeCase(get(sourceNode.data).tableName+voca.titleCase(column.column)),
          foreignKey: true,
          primary: false,
          autoIncrement: false,
          unique: true
        })}
      )])
      break
    case RELATIONS.ONE_TO_MANY:
      set(targetColumns, cur => [...cur, ...sourcePrimaryColumns.map(({tableName, tableId,...column}) => {
        edges.push({
          source: sourceNode.id,
          target: targetNode.id,
          markerEnd: RELATIONS.ONE_TO_MANY,
          id: targetNode.id + column.id
        })
        return atom({
          ...column,
          column: voca.snakeCase(get(sourceNode.data).tableName+voca.titleCase(column.column)),
          primary: false,
          foreignKey: true,
          unique: false,
          autoIncrement: false,
        })}
      )])
      break
    case RELATIONS.MANY_TO_MANY:
      const targetPrimaryColumns = get(get(targetNode.data).columns).filter(columnAtom => get(columnAtom).primary).map(columnAtom => ({...get(columnAtom), tableName: get(targetNode.data).tableName, id: v4(), tableId: targetNode.id}))
      const columnsCombined = [...targetPrimaryColumns, ...sourcePrimaryColumns]
      const id = v4();
      const columns = atom<PrimitiveAtom<IColumn>[]>(columnsCombined.map(columnData => {
        return atom<IColumn>({
          ...columnData,
          primary: false,
          foreignKey: true,
          unique: false,
          autoIncrement: false,
          column: voca.snakeCase(columnData.tableName + "_" + columnData.column)
        })
      }))

      const dataAtom = atom<IData>({tableName: get(sourceNode.data).tableName + "_" + get(targetNode.data).tableName, columns, color: "dark-grey"})
      const newNode: INode = {
        id,
        type: "tableNode",
        position: {
          x: Math.abs(sourceNode.position.x - targetNode.position.x),
          y: Math.abs(sourceNode.position.y - targetNode.position.y)
        },
        data: dataAtom
      };

      set(nodesAtom, cur => [...cur, newNode])
      edges = columnsCombined.map(column => {
        return {
          source: column.tableId,
          target: id,
          markerEnd: RELATIONS.ONE_TO_MANY,
          id: id + column.id
        }
      })
  }

  const curEdges = get(edgesAtoms)
  console.log(curEdges)
  set(edgesUpdateAtom, {
    edges: [...curEdges, ...edges],
    erdUuid
  })
  set(toolAtom, 'grab')
})
