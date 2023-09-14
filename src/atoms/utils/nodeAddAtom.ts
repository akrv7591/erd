import {atom} from "jotai";
import {v4} from "uuid";
import {PrimitiveAtom} from "jotai";
import {IColumn} from "../columnAtom";
import {IData} from "../../providers/TableDataProvider";
import {INode, nodesAtom} from "../nodesAtoms";
import {toolAtom} from "../toolAtom";

export const nodeAddAtom = atom(null, (get, set, {e, reactFlowWrapper, project}) => {
    if (get(toolAtom) !== 'add-table') return

    const targetIsPane = e.target.classList.contains('react-flow__pane');

    if (targetIsPane && reactFlowWrapper.current) {
      const {top, left} = reactFlowWrapper.current.getBoundingClientRect();
      const id = v4();
      const columns = atom<PrimitiveAtom<IColumn>[]>([])
      const dataAtom = atom<IData>({tableName: `table_${get(nodesAtom).length}`, columns, color: "dark-grey"})
      const newNode: INode = {
        id,
        type: "tableNode",
        position: project({x: e.clientX - left - 75, y: e.clientY - top}),
        data: dataAtom
      };

      set(nodesAtom, cur => [...cur, newNode])
      set(toolAtom, "grab")
    }
})
