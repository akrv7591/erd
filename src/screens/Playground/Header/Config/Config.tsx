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
import { useForm } from "@mantine/form";
import type { IErd } from "@/types/data/db-model-interfaces";
import ModalForm from "@/components/common/ModalForm";
import { ErdEnum } from "@/enums/playground.ts";
import { useEffect } from "react";
import {
  usePlayground,
  usePlaygroundStore,
} from "@/contexts/playground/PlaygroundStoreContext.ts";
import { EntityNameCases, ColumnNameCases } from "@/constants/playground";
import { notifications } from "@mantine/notifications";
import {ErdStoreState} from "@/stores/playground/erdStore.ts";
import {PlaygroundActionIcon} from "@/components/common/PlaygroundActionIcon";

interface Props {
  data: ErdStoreState;
}

export const Config = (props: Props) => {
  const form = useForm<Props['data']>({ initialValues: props.data });
  const playground = usePlayground((state) => state.playground);
  const store = usePlaygroundStore();
  const modal = useModal({
    baseTitle: `${props.data.name}'s Settings`,
    initialOpen: false,
    initialType: "view",
  });


  const handleSubmit = form.onSubmit(async(data) => {
    const erdPutResponse = playground.handleEmitResponse(
      {
        onError: playground.notifyErrorMessage(
          ErdEnum.put,
          "Failed to update erd",
        ),
        onSuccess: () => {
          notifications.show({
            title: "Erd updated",
            message: "Successfully",
          })
          store.setState(data)
        },
      },
      modal.modalProps.onClose,
    );
    playground.socket.emit(ErdEnum.put, data, erdPutResponse);
  })

  const handleOpen = () => modal.open()
  const hadleEntityNameCaseChange = (v: string) => form.setFieldValue("tableNameCase", v as IErd['tableNameCase'])
  const handleColumnNameCaseChange = (v: string) => form.setFieldValue("columnNameCase", v as IErd['columnNameCase'])

  useEffect(() => {
    form.setValues(props.data);
  }, [modal.modalProps.opened]);

  return (
    <>
      <Tooltip label={"Settings"} position={"bottom"} withArrow>
        <PlaygroundActionIcon onClick={handleOpen}>
          <IconSettings />
        </PlaygroundActionIcon>
      </Tooltip>
      <Modal {...modal.modalProps} size={"lg"}>
        <ModalForm onClose={modal.modalProps.onClose} onSubmit={handleSubmit}>
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
                  onChange={hadleEntityNameCaseChange}
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
    </>
  );
}
