import {Outlet} from "react-router-dom";
import {useLogto} from "@logto/react";
import {LoadingBackdrop} from "@/components/common/LoadingBackdrop";
import {memo, useEffect} from "react";
import {config} from "@/config/config";
import StorageUtils from "@/utility/StorageUtils";

export const ProtectedRoute = memo(() => {
  const {isAuthenticated, isLoading, signIn} = useLogto()

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      StorageUtils.setDestination(location.pathname)

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

