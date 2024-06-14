import {memo} from "react";
import {EntityViewMode} from "@/enums/playground.ts";
import {usePlayground} from "@/contexts/playground/PlaygroundStoreContext.ts";
import type {EntityNodeColumn} from "@/types/entity-node";
import {PlaygroundStore} from "@/stores/playgroundStore.ts";
import {EditorModeColumns} from "./EditorModeColumns";
import {SimplifiedModeColumns} from "./SimplifiedModeColumns";

const selector = (state: PlaygroundStore) => state.mode

export const Row = memo(({data}: { data: EntityNodeColumn }) => {
  const viewMode = usePlayground(selector)

  switch (viewMode) {
    case EntityViewMode.EDITOR:
      return <EditorModeColumns data={data}/>
    case EntityViewMode.LOGICAL:
      return <SimplifiedModeColumns data={data}/>
  }

})
