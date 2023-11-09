import React from "react";
import {useAuthStore} from "../../stores/useAuthStore";
import {Navigate} from "react-router-dom";
import {notifications} from "@mantine/notifications";

export default function ProtectedRoute(props: React.PropsWithChildren) {
  const authorization = useAuthStore(state => state.getAuthorization())

  if (!authorization) {
    notifications.show({
      title: "Authorization",
      message: "Oops. Login is required",
      color: "red",
    })
    return <Navigate to={"/auth"}/>
  }

  return (
    <>
      {props.children}
    </>
  )
}
