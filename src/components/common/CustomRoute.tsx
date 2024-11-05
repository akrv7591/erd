import {Route, RouteProps} from "react-router-dom";
import {FC, memo, PropsWithChildren, useEffect} from "react";
import {useLogto} from "@logto/react";
import StorageUtils from "@/utility/StorageUtils";
import {config} from "@/config/config";
import LoadingBackdrop from "@/components/common/LoadingBackdrop";

type Props = RouteProps & {
  protected?: boolean
}

const ProtectedRoute: FC<PropsWithChildren> = memo((props) => {
  const {isAuthenticated, signIn} = useLogto()

  useEffect(() => {
    if (!isAuthenticated) {
      StorageUtils.setDestination(location.pathname)

      void signIn({
        redirectUri: `${config.client.url}/callback`,
      })
    }
  }, [isAuthenticated, signIn])

  if (!isAuthenticated) {
    return <LoadingBackdrop/>
  }

  return props.children
})

export const CustomRoute = memo(({protected: isProtected = false, ...routeProps}: Props) => {
  if (!isProtected) {
    return (
      <Route {...routeProps} />
    )
  }

  return (
    <Route
      {...routeProps}
      element={(
        <ProtectedRoute>
          {routeProps.element}
        </ProtectedRoute>
      )}
    />
  )
})
