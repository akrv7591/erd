import {useErdStore} from "../../../stores/useErdStore";
import {useOnMount} from "../../../hooks/useOnMount";
import LoadingBackdrop from "../../common/LoadingBackdrop";
import React from "react";
import {Outlet} from "react-router-dom";

export default function ErdLayout() {
  // const [init, initiated] = useErdStore(state => [state.init, state.initiated])
  //
  // useOnMount(() => {
  //   let unsub: any
  //   init().then(() => {
  //     unsub = useErdStore.subscribe(({erds}) => {
  //       localStorage.setItem("erds", JSON.stringify(erds))
  //     })
  //   })
  //
  //   return () => unsub()
  // })
  //
  // if (!initiated) return <LoadingBackdrop />

  return <Outlet />
}
