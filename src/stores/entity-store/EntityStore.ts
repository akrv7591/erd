import {createStore} from "zustand";
import { EntityData } from "@/types/diagram";

interface EntityStoreState extends EntityData {}
interface EntityStoreActions {}

export type EntityStore = EntityStoreState & EntityStoreActions

export const createEntityStore = (data: EntityStoreState) => {
  
  const entityStore = createStore<EntityStore>()(() => data)
  return entityStore
}
