import {
  Group,
  Modal,
  SegmentedControl,
  Stack,
  Switch,
  Text,
  Textarea,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { IconInfoCircle, IconSettings } from "@tabler/icons-react";
import { useModal } from "@/hooks/useModal.ts";
import {useForm} from "@mantine/form";
import type { Erd } from "@/types/data/db-model-interfaces.ts";
import ModalForm from "@/components/common/ModalForm";
import { useEffect } from "react";
import { EntityNameCases, ColumnNameCases } from "@/constants/playground";
import {PlaygroundActionIcon} from "@/components/common/PlaygroundActionIcon";
import {ErdStoreState} from "@/stores/shared-diagram-store/stores/erdStore.ts";
import {useSharedDiagramStore} from "@/contexts/SharedDiagramContext.ts";

interface Props {
  data: ErdStoreState['erd'];
}

export const Config = (props: Props) => {
  const form = useForm<Props['data']>({ initialValues: props.data });
  const modal = useModal({
    baseTitle: `${props.data.name}'s Settings`,
    initialOpen: false,
    initialType: "view",
  });
  const setErd = useSharedDiagramStore(state => state.setErd)
  const handleOpen = () => modal.open()
  const handleEntityNameCaseChange = (v: string) => form.setFieldValue("tableNameCase", v as Erd['tableNameCase'])
  const handleColumnNameCaseChange = (v: string) => form.setFieldValue("columnNameCase", v as Erd['columnNameCase'])
  const handleSubmit = form.onSubmit(data => {
    setErd(data)
    modal.modalProps.onClose()
  })

  useEffect(() => {
    form.setValues(props.data);
  }, [modal.modalProps.opened]);

  return (
    <form onSubmit={handleSubmit}>
      <Tooltip label={"Settings"} position={"bottom"} withArrow>
        <PlaygroundActionIcon onClick={handleOpen}>
          <IconSettings />
        </PlaygroundActionIcon>
      </Tooltip>
      <Modal {...modal.modalProps} size={"lg"}>
        <ModalForm onClose={modal.modalProps.onClose}>
          <Stack>
            <Group align={"flex-start"}>
              <TextInput
                {...form.getInputProps("name", { withFocus: true })}
                label={"Name"}
                required
                data-autofocus
                style={{ flex: 1 }}
              />
            </Group>
            <Textarea
              {...form.getInputProps("description")}
              label={"Description"}
            />
            <Group gap={"xs"} align={"center"}>
              <Switch
                label={"Public"}
                labelPosition={"left"}
                pr={0}
                {...form.getInputProps("isPublic", { type: "checkbox" })}
              />
              <Tooltip label={"Accessible by anyone, but users in respective team can modify it"}>
                <IconInfoCircle size={20} />
              </Tooltip>
            </Group>
            <Group>
              <Stack gap={1} flex={1}>
                <Text size={"sm"}>Entity name casing</Text>
                <SegmentedControl
                  value={form.values.tableNameCase}
                  onChange={handleEntityNameCaseChange}
                  data={ColumnNameCases}
                />
              </Stack>
              <Stack gap={1} flex={1}>
                <Text size={"sm"}>Entity column name casing</Text>
                <SegmentedControl
                  defaultValue={form.values.columnNameCase}
                  onChange={handleColumnNameCaseChange}
                  data={EntityNameCases}
                />
              </Stack>
            </Group>
          </Stack>
        </ModalForm>
      </Modal>
    </form>
  );
}
