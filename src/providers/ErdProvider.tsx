import React from "react";
import {useLocation} from "react-router-dom";
import {ReactFlowProvider} from "reactflow";
import {IErd} from "../types/data/erd";

const ErdContext = React.createContext<IErd>({} as IErd)
export const useErd = () => React.useContext(ErdContext)

export default function ErdProvider(props: React.PropsWithChildren) {
  const erd = useLocation().state.erd as IErd

  console.log("RENDERING")

  return (

    <ErdContext.Provider value={erd}>
      <ReactFlowProvider>
        {props.children}
      </ReactFlowProvider>
    </ErdContext.Provider>
  )
}
