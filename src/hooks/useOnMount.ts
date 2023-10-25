import React from "react";

export const useOnMount = (callback: React.EffectCallback) => {

  React.useEffect(() => {
    callback()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
