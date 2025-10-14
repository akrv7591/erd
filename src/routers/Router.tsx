import { RouterProvider } from "react-router-dom";
import { routes } from "@/routers/routes";
import { memo, Suspense } from "react";
import { useLogtoStore } from "@/stores/logto-store";
import { useLogto } from "@logto/react";
import {useOnMount} from "@/hooks/useOnMount";

export const Router = memo(() => {
  const logTo = useLogto()
  const logtoStore = useLogtoStore(state => state.logto)

  useOnMount(() => {
    useLogtoStore.setState({ logto: logTo })

    return () => {
      useLogtoStore.setState({ logto: null })
    }
  })

  if (!logtoStore) {
    return null
  }

  return (
    <Suspense>
      <RouterProvider router={routes} />
    </Suspense>
  );
});
