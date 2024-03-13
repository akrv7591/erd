import {
  ActionIcon,
  Group,
  Input,
  Modal,
  SegmentedControl,
  Select,
  Stack,
  Switch,
  Textarea,
  TextInput,
  Tooltip
} from "@mantine/core";
import {IconInfoCircle, IconSettings} from "@tabler/icons-react";
import {useModal} from "@/hooks/useModal.ts";
import {usePlaygroundStore} from "@/stores/usePlaygroundStore.ts";
import {useLocation} from "react-router-dom";
import {useForm} from "@mantine/form";
import {IErd} from "@/types/data/db-model-interfaces";
import {useMutation, useQueryClient} from "react-query";
import {notifications} from "@mantine/notifications";
import erdApi from "@/api/erdApi.tsx";
import ModalForm from "@/components/common/ModalForm";
import {hasRoleAccess} from "@/utility/role-util.ts";
import {useLibraryStore} from "@/stores/useLibrary.ts";
import {useOnMount} from "@/hooks/useOnMount.ts";

const erdMutationFn = (data: IErd) => erdApi.put("/v1/erd", data)

export default function Config() {
  const name = usePlaygroundStore(state => state.name)
  const modal = useModal({baseTitle: `${name}'s Settings`, initialOpen: false, initialType: "view"})
  const teams = useLibraryStore(state => state.teams)
  const form = useForm<IErd>({})
  const location = useLocation()

  const queryClient = useQueryClient()
  const mutation = useMutation({mutationFn: ({data}: { data: IErd }) => erdMutationFn(data)})

  const handleSubmit = async (data: any) => {
    mutation.mutate({data}, {
      onSuccess: async (res) => {
        console.log({res})
        await queryClient.refetchQueries(['erdList'])
        form.setValues(data)
        modal.modalProps.onClose()
        notifications.show({
          title: `${res.data.name} erd is updated`,
          message: "Success"
        })
      },
      onError: () => {
        notifications.show({
          title: `Failed to update erd`,
          message: "Failed",
          color: "var(--mantine-color-red-filled)"
        })
      }
    })
  }

  useOnMount(() => {
    erdApi.get<IErd>(`/v1/erd/${location.state.erd.id}`)
      .catch(e => console.error(e))
      .then(res => {
        if (res) {
         form.setValues(res.data)
        }
      })
  })

  if (!form.values.id) {
    return null
  }

  return (
    <>
      <Tooltip label={"Settings"} position={"bottom"} withArrow>
        <ActionIcon onClick={() => modal.open("view")} size={"lg"} variant={"default"}>
          <IconSettings/>
        </ActionIcon>
      </Tooltip>
      <Modal {...modal.modalProps} closeOnClickOutside={false} closeOnEscape={false} size={"xl"}>
        <ModalForm
          onClose={modal.modalProps.onClose}
          onSubmit={form.onSubmit(handleSubmit)}
          loading={mutation.isLoading}
        >
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
                  data={teams.map(t => ({value: t.id, label: t.name, disabled: !hasRoleAccess(t.UserTeam.role)}))}
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
                <Input.Label>Entity name casing</Input.Label>
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
                <Input.Label>Entity column name casing</Input.Label>
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
