import {useAuthStore} from "@/stores/useAuthStore";
import {Navigate, Outlet, useLocation, useParams} from "react-router-dom";

export default function ProtectedRoute() {
  const authorization = useAuthStore(state => state.getAuthorization())
  const location = useLocation()
  const params = useParams()

  if (!authorization) {
    const state: any = {
      ...location.state,
      alert: {
        title: "Authorization",
        message: "Oops. Login is required",
        color: "orange",
      },
    }

    if (params.joinTeamId) {
      state['destination'] = `/team/${params.joinTeamId}/join`
    }

    return <Navigate to={"/auth"} state={state}/>
  }

  return <Outlet/>
}
