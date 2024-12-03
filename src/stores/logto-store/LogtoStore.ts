import { useLogto } from "@logto/react";
import { create } from "zustand";

interface LogtoStoreState {
    logto: ReturnType<typeof useLogto> | null
}

export const useLogtoStore = create<LogtoStoreState>()(() => ({
    logto: null
}))