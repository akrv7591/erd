import { RouterProvider } from "react-router-dom";
import { useLogto } from "@logto/react";
import { routes } from "@/routers/routes";
import { memo, Suspense, useEffect } from "react";
import { Axios } from "@/services";

export const Router = memo(() => {
  const logTo = useLogto();

  useEffect(() => {
    Axios.instance.logTo = logTo;
  }, []);

  return (
    <Suspense fallback={null}>
      <RouterProvider router={routes} />
    </Suspense>
  );
});
