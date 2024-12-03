import { RouterProvider } from "react-router-dom";
import { useLogto } from "@logto/react";
import { routes } from "@/routers/routes";
import { memo, Suspense, useEffect, useState } from "react";
import { Axios } from "@/services";

export const Router = memo(() => {
  const [initialLoad, setInitialLoad] = useState(true);
  const logTo = useLogto();

  useEffect(() => {
    Axios.instance.logTo = logTo;
    setInitialLoad(false)
  }, [logTo])

  if (initialLoad) {
    return null
  }

  return (
    <Suspense>
      <RouterProvider router={routes} />
    </Suspense>
  );
});
