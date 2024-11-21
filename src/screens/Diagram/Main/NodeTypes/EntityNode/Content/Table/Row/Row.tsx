import {memo, useCallback} from "react";
import {EditorModeColumns} from "./EditorModeColumns";
import {SimplifiedModeColumns} from "./SimplifiedModeColumns";
import {DiagramStore} from "src/stores/diagram-store";
import {useDiagramStore} from "@/hooks";
import {EntityColumn} from "@/types/diagram";
import {useUpdateEntityColumn} from "@/hooks";
import {DIAGRAM} from "@/namespaces";

const selector = (state: DiagramStore) => state.entityViewMode

export const Row = memo(({data}: { data: EntityColumn }) => {
  const viewMode = useDiagramStore(selector)
  const patchColumn = useUpdateEntityColumn(data.id)

  const handleChange = useCallback((key: keyof EntityColumn): React.ChangeEventHandler<HTMLInputElement> => (e) => {
    switch(e.target.type) {
      case "text":
        patchColumn(key, e.target.value, data[key])
        break
      case "checkbox":
        patchColumn(key, e.target.checked, data[key])
        break
    }
  }, [data, patchColumn])

  switch (viewMode) {
    case DIAGRAM.ENTITY.VIEW_MODE.EDITOR:
      return <EditorModeColumns data={data} handleChange={handleChange}/>
    case DIAGRAM.ENTITY.VIEW_MODE.LOGICAL:
      return <SimplifiedModeColumns data={data} handleChange={handleChange}/>
  }

})
