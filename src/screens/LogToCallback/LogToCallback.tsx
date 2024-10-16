import {useHandleSignInCallback,} from "@logto/react";
import {useNavigate} from "react-router-dom";
import LoadingBackdrop from "@/components/common/LoadingBackdrop.tsx";
import StorageUtils from "@/utility/StorageUtils.ts";

export const LogToCallback = () => {
  const navigate = useNavigate()

  const signInCallback = useHandleSignInCallback(() => {
    const destination = StorageUtils.getDestination()
    navigate(destination || "/", {replace: true})
  })

  if (signInCallback.isLoading) {
    return <LoadingBackdrop/>
  }

  if (signInCallback.error) {
    return <>{signInCallback.error.name}</>
  }

  return <>Wierd</>
}
