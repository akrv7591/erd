import React from "react";
import {IErd, useErdStore} from "../stores/useErdStore";
import {Navigate, useParams} from "react-router-dom";
import {ReactFlowProvider} from "reactflow";
import {validate} from "uuid";
import {useOnMount} from "../hooks/useOnMount";
import LoadingBackdrop from "../components/common/LoadingBackdrop";

const ErdContext = React.createContext<IErd>({} as IErd)
export const useErd = () => React.useContext(ErdContext)

export default function ErdProvider(props: React.PropsWithChildren) {
  const {erdUuid} = useParams()
  const [getErd, initiated, init] = useErdStore(state => [state.getErd, state.initiated, state.init])
  const [erd, setErd] = React.useState<IErd>()

  useOnMount(() => {
    if (!initiated) {
      init()
    }

    setErd(getErd(erdUuid as string))
  })

  console.log({erd})

  if (!validate(erdUuid as string)) {
    return <Navigate to={"/"}/>
  }

  if (!initiated) return <LoadingBackdrop />

  console.log("RENDERING")

  return (

    <ErdContext.Provider value={getErd(erdUuid as string)}>
      <ReactFlowProvider>
        {props.children}
      </ReactFlowProvider>
    </ErdContext.Provider>
  )
}
