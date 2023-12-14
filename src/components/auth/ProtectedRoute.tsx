import React from "react";
import {useAuthStore} from "../../stores/useAuthStore";
import {Navigate, useLocation} from "react-router-dom";

export default function ProtectedRoute(props: React.PropsWithChildren) {
  const authorization = useAuthStore(state => state.getAuthorization())
  const location = useLocation()

  if (!authorization) {
    return <Navigate to={"/auth"} state={{
      ...location.state,
      alert: {
        title: "Authorization",
        message: "Oops. Login is required",
        color: "red",
      },
    }}/>
  }

  return (
    <>
      {props.children}
    </>
  )
}
