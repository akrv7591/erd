import {useHandleSignInCallback,} from "@logto/react";
import {useNavigate} from "react-router-dom";
import {LoadingBackdrop} from "@/components/common/LoadingBackdrop";
import StorageUtils from "@/utility/StorageUtils";

export default function LogToCallback() {
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
