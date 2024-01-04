import React from "react";
import {useAuthStore} from "@/stores/useAuthStore";
import {Navigate, useLocation, useParams} from "react-router-dom";

export default function ProtectedRoute(props: React.PropsWithChildren) {
  const authorization = useAuthStore(state => state.getAuthorization())
  const location = useLocation()
  const params = useParams()

  if (!authorization) {
    const state: any = {
      ...location.state,
      alert: {
        title: "Authorization",
        message: "Oops. Login is required",
        color: "red",
      },
    }

    if (params.joinTeamId) {
      state['destination'] = `/team/${params.joinTeamId}/join`
    }

    return <Navigate to={"/auth"} state={state}/>
  }

  return (
    <>
      {props.children}
    </>
  )
}
