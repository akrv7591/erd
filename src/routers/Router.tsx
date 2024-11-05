import {RouterProvider} from "react-router-dom";
import {useLogto} from "@logto/react";
import {routes} from "@/routers/routes";
import {memo, useEffect} from "react";
import {useLogToAuthStore} from "@/stores/useLogToAuthStore";
import LoadingBackdrop from "@/components/common/LoadingBackdrop";

export const Router = memo(() => {
  const logTo = useLogto()
  const authorized = useLogToAuthStore(state => state.authorized)
  const initialize = useLogToAuthStore(state => state.initialize)

  useEffect(() => {
    if (logTo.isAuthenticated && !authorized) {
      initialize(logTo)
    }
  }, [logTo, authorized]);

  if (logTo.isLoading) {
    return (
      <LoadingBackdrop title={"Initializing"}/>
    )
  }

  if (logTo.isAuthenticated && !authorized) {
    return (
      <LoadingBackdrop title={"Initializing authorization"}/>
    )
  }

  return (
    <RouterProvider router={routes} />
  )
})

