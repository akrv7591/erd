import {
  Group,
  Input,
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
import {ModalBaseProps} from "@/components/common/ModalBase";
import ModalForm from "@/components/common/ModalForm";
import {useForm} from "@mantine/form";
import {useMutation, useQueryClient} from "react-query";
import erdApi from "@/api/erdApi.tsx";
import {notifications} from "@mantine/notifications";
import {IErd} from "@/types/data/db-model-interfaces";
import {createId} from "@paralleldrive/cuid2";
import {useLibraryStore} from "@/stores/useLibrary.ts";
import {IconInfoCircle} from "@tabler/icons-react";
import {hasRoleAccess} from "@/utility/role-util.ts";

interface Props extends ModalBaseProps {
  data?: IErd
}

type IErdMutationMethods = "delete" | "put"

interface IErdMutationData {
  data: IErd,
  type: IErdMutationMethods
}

const erdMutationFn = (data: IErd, type: IErdMutationMethods) => {
  switch (type) {
    case "put":
      return erdApi.put("/v1/erd", data)
    case "delete":
      return erdApi.delete(`/v1/erd/${data.id}`)
  }
}

const generateDefaultFormValue = (): IErd => {
  return {
    id: "",
    name: "",
    description: "",
    isPublic: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    tableNameCase: "pascal",
    columnNameCase: "camel",
    teamId: ''
  }

}
export default function ErdModal({onSubmit, data, type, ...props}: Props) {
  const team = useLibraryStore(state => state.team)
  const teams = useLibraryStore(state => state.teams)

  const form = useForm({
    initialValues: {
      ...data ? data : generateDefaultFormValue(),
      ...team && {
        teamId: team.id
      }
    },
    validate: {
      teamId: (value: string | null) => (value === null || value === "") ? "Team is required" : null
    }
  })

  const queryClient = useQueryClient()
  const mutation = useMutation({mutationFn: ({data, type}: IErdMutationData) => erdMutationFn(data, type)})

  const handleSubmit = async (data: any) => {
    switch (type) {
      case "delete":
        mutation.mutate({data, type: "delete"}, {
          onSuccess: async () => {
            await queryClient.refetchQueries(['erdList'])
            form.reset()
            props.onClose()
            notifications.show({
              title: `${data.name} erd is deleted`,
              message: "Success"
            })
          },
          onError: () => {
            notifications.show({
              title: `Failed to delete erd`,
              message: "Failed",
              color: "var(--mantine-color-red-filled)"
            })
          }
        })
        break
      case "update":
        mutation.mutate({data, type: "put"}, {
          onSuccess: async (res) => {
            await queryClient.refetchQueries(['erdList'])
            form.reset()
            props.onClose()
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
        break
      case "create":
        mutation.mutate({data: {...data, id: createId()}, type: "put"}, {
          onSuccess: async (res) => {
            await queryClient.refetchQueries(['erdList'])
            form.reset()
            props.onClose()
            notifications.show({
              title: `${res.data.name} erd is created`,
              message: "Success"
            })
          },
          onError: () => {
            notifications.show({
              title: `Failed to create erd`,
              message: "Failed",
              color: "var(--mantine-color-red-filled)"
            })
          }
        })
    }
  }


  return (
    <Modal {...props} onClose={() => {
      props.onClose()
      form.reset()
    }} size={"lg"}>
      <ModalForm onClose={props.onClose} onSubmit={form.onSubmit(handleSubmit)} loading={mutation.isLoading}>
        {type === "delete"
          ? <Text>Are you sure to delete {data?.name}</Text>
          : (
            <Stack>
              <Group align={"flex-start"}>
                <TextInput
                  {...form.getInputProps("name", {withFocus: true})}
                  label={"Name"}
                  required
                  data-autofocus
                  style={{flex: 1}}
                />
                <Tooltip hidden={type !== "update"} label={"You can't edit erd team"}>
                  <Select
                    {...form.getInputProps("teamId", {withFocus: true})}
                    disabled={type === "update"}
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
                <Switch label={"Public"} labelPosition={"left"}
                        pr={0} {...form.getInputProps("isPublic", {type: "checkbox"})} />
                <Tooltip label={"Accessible by anyone, but users in respective team can modify it"}>
                  <IconInfoCircle size={20}/>
                </Tooltip>
              </Group>
              <Stack gap={0}>
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
              <Stack gap={0}>
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
            </Stack>
          )
        }
      </ModalForm>
    </Modal>
  )
}
