import {ModalBaseProps} from "@/components/common/ModalBase";
import {Button, Group, Modal, Stack, TextInput, Tooltip} from "@mantine/core";
import ModalForm from "@/components/common/ModalForm";
import {QueryFunctionContext, useMutation, useQuery, useQueryClient} from "react-query";
import erdApi from "@/api/erdApi.tsx";
import {notifications} from "@mantine/notifications";
import {IconTrash} from "@tabler/icons-react";
import ButtonWithConfirm from "@/components/common/ButtonWithConfirm";
import {IFormTeam, TeamFormProvider, useTeamForm} from "@/contexts/forms/TeamFormContext.ts";
import {createId} from "@paralleldrive/cuid2";
import {IUser} from "@/types/data/db-model-interfaces";
import UserList from "@/screens/Library/Navbar/TeamModal/UserList.tsx";

interface Props extends ModalBaseProps {
  data?: IFormTeam
}


type ITeamMutationMethods = "delete" | "put"

interface IErdMutationData {
  data: IFormTeam,
  type: ITeamMutationMethods
}


const teamMutationFn = ({data, type}: IErdMutationData) => {
  switch (type) {
    case "put":
      return erdApi.put<IFormTeam>("/v1/team", data)
    case "delete":
      return erdApi.delete(`/v1/team/${data.id}`)

  }
}


const userListQuery = (params: QueryFunctionContext) => {
  const teamId = params.queryKey[0]

  if (!teamId) return []

  return erdApi.get<IUser[]>(`/v1/team/${params.queryKey[0]}/user-list`).then(response => response.data)
}

export default function TeamModal({onSubmit, data, type, ...props}: Props) {
  const queryClient = useQueryClient()
  const form = useTeamForm({
    initialValues: {
      ...data ? {
        ...data
      } : {
        users: [] as IFormTeam['users'],
        name: "",
        id: createId()
      } as IFormTeam,
    }
  })
  const mutation = useMutation({
    mutationFn: teamMutationFn,
  })

  useQuery({
    queryKey: [data?.id],
    queryFn: userListQuery,
    onSuccess: data => form.setFieldValue("users", data)
  })


  const handleSubmit = async (data: any) => {
    switch (type) {
      case "create":
        mutation.mutate({data, type: "put"}, {
          onSuccess: async () => {
            notifications.show({
              title: "Created",
              message: `${data.name} team created successfully`
            })

            await queryClient.refetchQueries({
              queryKey: "teamList"
            })
            form.reset()
            props.onClose()
          },
          onError: async () => {
            notifications.show({
              title: "Failed",
              message: "Team creation failed! Try again",
              color: "red"
            })
          }
        })
        break
      case "update":
        mutation.mutate({data, type: "put"}, {
          onSuccess: async () => {
            notifications.show({
              message: `${data.name} team updated successfully`
            })

            await queryClient.refetchQueries({
              queryKey: "teamList"
            })
            form.reset()
            props.onClose()
          },
          onError: async () => {
            notifications.show({
              title: "Failed",
              message: "Team update failed! Try again",
              color: "red"
            })
          }
        })
        break

    }
  }

  const onDelete = () => {
    const data = form.values
    mutation.mutate({data, type: "delete"}, {
      onSuccess: async () => {
        notifications.show({
          message: `${data.name} team deleted successfully`
        })

        await queryClient.refetchQueries({
          queryKey: "teamList"
        })
        form.reset()
        props.onClose()
      },
      onError: async () => {
        notifications.show({
          title: "Failed",
          message: "Team delete failed! Try again",
          color: "red"
        })
      }
    })
  }

  return (
    <TeamFormProvider form={form}>
      <Modal size={"600px"} {...props}>
        <ModalForm onClose={props.onClose} onSubmit={form.onSubmit(handleSubmit)} loading={mutation.isLoading}>
          <Stack>
            <TextInput
              {...form.getInputProps("name", {withFocus: true})}
              label={"Name"}
              required
              data-autofocus
            />
            <UserList/>
            <Group w={"100%"} justify={"flex-end"}>
              <ButtonWithConfirm
                target={(
                  <Tooltip label={"Delete team"}>
                    <Button
                      leftSection={<IconTrash/>}
                      color={"var(--mantine-color-red-filled)"}
                      variant={"filled"}
                      size={"xs"}
                    >
                      Delete
                    </Button>
                  </Tooltip>
                )}
                message={`Do you really want to delete ${form.values.name} team`}
                onConfirm={onDelete}
              />
            </Group>
          </Stack>
        </ModalForm>
      </Modal>
    </TeamFormProvider>

  )
}