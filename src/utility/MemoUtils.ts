import { BROADCAST } from "@/namespaces";
import { NODE } from "@/namespaces/broadcast/node";
import { NODE_TYPES } from "@/screens/Diagram/Main/NodeTypes";
import { DiagramStore } from "@/stores/diagram-store";
import { MemoNode } from "@/types/diagram";
import { ShortId } from "@/utility/ShortId";
import { XYPosition } from "@xyflow/react";

type StateUpdate<T extends BROADCAST.DATA> = (
  updatedState: Partial<DiagramStore>,
  state: DiagramStore,
  changes: T,
) => Partial<DiagramStore>;

export class MemoUtils {
  static genNewMemo(position: XYPosition) {
    const memoNode: MemoNode = {
      id: ShortId.create(),
      type: NODE_TYPES.MEMO,
      data: {
        color: "yellow",
        content: ""
      },
      position
    }

    return memoNode
  }

  static updateMemoContent: StateUpdate<NODE.MEMO.CONTENT_UPDATE> = (updatedState, state, {value}) => {
    if (!updatedState.nodes) {
      updatedState.nodes = state.nodes
    }

    updatedState.nodes = updatedState.nodes.map(node => {
      if (node.type !== NODE_TYPES.MEMO) {
        return node
      }

      if (node.id !== value.memoId) {
        return node
      }

      return {
        ...node,
        data: {
          ...node.data,
          content: value.content
        }
      }
    })

    return updatedState
  }
}
