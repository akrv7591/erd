import {memo} from "react";
import {EntityViewMode} from "@/enums/playground.ts";
import {EditorModeColumns} from "./EditorModeColumns";
import {SimplifiedModeColumns} from "./SimplifiedModeColumns";
import {DiagramStore} from "src/stores/diagram-store";
import {useDiagramStore} from "@/contexts/DiagramContext";
import {EntityColumn} from "@/providers/shared-diagram-store-provider/type.ts";

// Types


const selector = (state: DiagramStore) => state.entityViewMode

export const Row = memo(({data}: { data: EntityColumn }) => {
  const viewMode = useDiagramStore(selector)

  switch (viewMode) {
    case EntityViewMode.EDITOR:
      return <EditorModeColumns data={data}/>
    case EntityViewMode.LOGICAL:
      return <SimplifiedModeColumns data={data}/>
  }

})
