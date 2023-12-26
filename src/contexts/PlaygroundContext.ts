import React from "react";
import {PlaygroundService} from "@/services/multiplayer/playground-service.ts";

export const PlaygroundContext = React.createContext<PlaygroundService>({} as PlaygroundService)

export const usePlayground = () => React.useContext(PlaygroundContext)
