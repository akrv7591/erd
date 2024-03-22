import {Outlet} from "react-router-dom";
import {useAuthStore} from "@/stores/useAuthStore.ts";
import {useEffect, useState} from "react";

export default function InitialLoadOutlet() {
  const accessToken = useAuthStore(state => state.accessToken);
  const fetchAndSetUser = useAuthStore(state => state.fetchAndSetUser);
  const [initialLoad, setInitialLoad] = useState(!!accessToken);

  useEffect(() => {
    if (!initialLoad) return

    fetchAndSetUser().then(() => setInitialLoad(false))

  }, [initialLoad])

  if (initialLoad) {
    return null
  }

  return (
    <Outlet />
  )
}
