import {Outlet} from "react-router-dom";
import {useLogto} from "@logto/react";
import LoadingBackdrop from "@/components/common/LoadingBackdrop.tsx";
import {memo, useEffect} from "react";
import {config} from "@/config/config.ts";
import StorageUtils from "@/utility/StorageUtils.ts";

export const ProtectedRoute = memo(() => {
  const {isAuthenticated, isLoading, signIn} = useLogto()

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      StorageUtils.setDestination(location.pathname)

      console.log("Signing in ...")

      void signIn({
        redirectUri: `${config.client.url}/callback`,
      })
    }
  }, [isAuthenticated, isLoading, signIn])

  if (!isAuthenticated) {
    return <LoadingBackdrop/>
  }

  return <Outlet/>
})

