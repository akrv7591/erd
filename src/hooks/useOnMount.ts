import {useEffect, type EffectCallback} from "react";

export const useOnMount = (callback: EffectCallback) => {
  useEffect(callback, [])
}
