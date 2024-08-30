import {createFormContext} from "@mantine/form";
import {DefaultEntityConfig} from "@/stores/shared-diagram-store/stores/erdStore.ts";

const [EntityConfigFormProvider, useEntityConfigContextForm, useEntityConfigForm] = createFormContext<DefaultEntityConfig>()

export {
  EntityConfigFormProvider,
  useEntityConfigContextForm,
  useEntityConfigForm
}
