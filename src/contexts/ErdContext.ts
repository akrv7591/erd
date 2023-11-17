import React from "react";
import {IErd} from "../types/data/erd";

export const ErdContext = React.createContext<IErd>({} as IErd)
export const useErd = () => React.useContext(ErdContext)
