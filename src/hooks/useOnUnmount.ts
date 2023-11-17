import React from "react";

export const useOnUnmount = (callback: () => void) => {

  React.useEffect(() => {
    return callback()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
