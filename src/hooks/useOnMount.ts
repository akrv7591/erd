import React from "react";

export const useOnMount = (callback: React.EffectCallback) => {

  React.useEffect(callback, [])
}
