import {createFormContext} from "@mantine/form";
import {EntityData} from "@/types/diagram";

const [
  EntityConfigFormProvider,
  useEntityConfigContextForm,
  useEntityConfigForm
] = createFormContext<EntityData & {userId: string}>()

export {
  EntityConfigFormProvider,
  useEntityConfigContextForm,
  useEntityConfigForm
}
