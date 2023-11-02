import React from "react";
import {IErdNodeData} from "../types/erd-node";
import {useNodeId, useReactFlow} from "reactflow";

interface IErdTableDataContextProps {
  data: IErdNodeData
  setData: React.Dispatch<React.SetStateAction<IErdNodeData>>
}

const ErdTableDataContext = React.createContext<IErdTableDataContextProps>({} as IErdTableDataContextProps)

interface Props extends React.PropsWithChildren {
}

export const ErdTableDataProvider = React.memo((props: Props) => {
  const nodeId = useNodeId()
  const reactFlow = useReactFlow()
  const node = reactFlow.getNode(nodeId!)!
  const [data, setData] = React.useState(node.data)

  React.useEffect(() => {
    reactFlow.setNodes(cur => cur.map(node => {
      if (node.id !== nodeId) return node

      return {
        ...node,
        data
      }
    }))

  }, [data, nodeId, reactFlow])


  return (
    <ErdTableDataContext.Provider value={{data, setData}}>
      {props.children}
    </ErdTableDataContext.Provider>
  )
})

export const useErdTableData = () => React.useContext(ErdTableDataContext)
