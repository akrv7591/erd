import React from "react";
import {MultiplayerService} from "../services/multiplayer/MultiplayerService.ts";

export const MultiplayerContext = React.createContext<MultiplayerService>({} as MultiplayerService)

export const useMultiplayer = () => React.useContext(MultiplayerContext)
