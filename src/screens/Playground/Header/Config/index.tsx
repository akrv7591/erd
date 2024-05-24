import {
  ActionIcon,
  Group,
  Modal,
  SegmentedControl,
  Select,
  Stack,
  Switch,
  Text,
  Textarea,
  TextInput,
  Tooltip
} from "@mantine/core";
import {IconInfoCircle, IconSettings} from "@tabler/icons-react";
import {useModal} from "@/hooks/useModal.ts";
import type {PlaygroundStoreState} from "@/stores/playgroundStore.ts";
import {useForm} from "@mantine/form";
import {IErd} from "@/types/data/db-model-interfaces";
import ModalForm from "@/components/common/ModalForm";
import {hasRoleAccess} from "@/utility/role-util.ts";
import {useLibraryStore} from "@/stores/useLibrary.ts";
import {ErdEnum} from "@/enums/playground.ts";
import {useEffect} from "react";
import {usePlayground} from "@/contexts/playground/PlaygroundStoreContext.ts";

interface Props {
  data: Omit<PlaygroundStoreState, 'playground'>
}
export default function Config(props: Props) {
  const form = useForm<IErd>({initialValues: props.data})
  const playground = usePlayground(state => state.playground)
  const modal = useModal({baseTitle: `${props.data.name}'s Settings`, initialOpen: false, initialType: "view"})
  const teams = useLibraryStore(state => state.teams)
  const handleSubmit = async (data: any) => playground.erd(ErdEnum.put, data)
  function handleOpen() {
    modal.open()
  }

  useEffect(() => {
    form.setValues(props.data)
  }, [modal.modalProps.opened])

  return (
    <>
      <Tooltip label={"Settings"} position={"bottom"} withArrow>
        <ActionIcon onClick={handleOpen} size={"lg"} variant={"default"}>
          <IconSettings/>
        </ActionIcon>
      </Tooltip>
      <Modal {...modal.modalProps} size={"lg"}>
        <ModalForm onClose={modal.modalProps.onClose} onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <Group align={"flex-start"}>
              <TextInput
                {...form.getInputProps("name", {withFocus: true})}
                label={"Name"}
                required
                data-autofocus
                style={{flex: 1}}
              />
              <Tooltip label={"You can't edit erd team"}>
                <Select
                  {...form.getInputProps("teamId", {withFocus: true})}
                  disabled
                  label={"Team"}
                  placeholder={"Select a team"}
                  data={teams.map(t => ({value: t.id, label: t.name, disabled: !hasRoleAccess(t.userTeam.role)}))}
                  checkIconPosition={"right"}
                />
              </Tooltip>
            </Group>
            <Textarea
              {...form.getInputProps("description")}
              label={"Description"}
            />
            <Group gap={"xs"} align={"center"}>
              <Switch
                label={"Public"}
                labelPosition={"left"}
                pr={0} {...form.getInputProps("isPublic", {type: "checkbox"})}
              />
              <Tooltip label={"Accessible by anyone, but users in respective team can modify it"}>
                <IconInfoCircle size={20}/>
              </Tooltip>
            </Group>
            <Group>
              <Stack gap={1} flex={1}>
                <Text size={'sm'}>Entity name casing</Text>
                <SegmentedControl
                  value={form.values.tableNameCase}
                  onChange={(v: any) => form.setFieldValue("tableNameCase", v)}
                  data={[{
                    label: "Pascal",
                    value: "pascal"
                  }, {
                    label: "Snake",
                    value: "snake"
                  }, {
                    label: "Camel",
                    value: "camel"
                  }]}
                />
              </Stack>
              <Stack gap={1} flex={1}>
                <Text size={"sm"}>Entity column name casing</Text>
                <SegmentedControl
                  value={form.values.columnNameCase}
                  onChange={(v: any) => form.setFieldValue("columnNameCase", v)}
                  data={[{
                    label: "Snake",
                    value: "snake"
                  }, {
                    label: "Camel",
                    value: "camel"
                  }]}
                />
              </Stack>
            </Group>
          </Stack>
        </ModalForm>
      </Modal>
    </>
  )
}
