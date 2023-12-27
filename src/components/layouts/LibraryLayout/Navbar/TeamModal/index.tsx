import {ModalBaseProps} from "@/components/common/ModalBase";
import {useForm} from "@mantine/form";
import {Button, Group, Modal, Stack, TagsInput, TextInput, Tooltip} from "@mantine/core";
import ModalForm from "../../../../common/ModalForm";
import {useMutation, useQueryClient} from "react-query";
import erdApi from "../../../../../api/erdApi.tsx";
import {notifications} from "@mantine/notifications";
import {IconTrash} from "@tabler/icons-react";
import ButtonWithConfirm from "../../../../common/ButtonWithConfirm";
import {ITeam} from "@/types/data/db-model-interfaces";

interface Props extends ModalBaseProps {
  data?: ITeam
}


type ITeamMutationMethods = "delete" | "put"

interface IErdMutationData {
  data: ITeam,
  type: ITeamMutationMethods
}


const teamMutationFn = ({data, type}: IErdMutationData) => {
  switch (type) {
    case "put":
      return erdApi.put<ITeam>("/v1/team", data)
    case "delete":
      return erdApi.delete(`/v1/team/${data.id}`)

  }
}

export default function TeamModal({onSubmit, data, type, ...props}: Props) {
  const queryClient = useQueryClient()
  const form = useForm({
    initialValues: {
      name: "",
      users: [],
      ...data && {
        ...data,
        users: data.users? data.users.map(user => user.email): []
      }
    }
  })
  const mutation = useMutation({
    mutationFn: teamMutationFn,
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
              message: "Team update failed! Try again",
              color: "red"
            })
          }
        })
        break

    }
  }

  const onDelete = () => {
    const data = form.values as unknown as ITeam
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
    <Modal {...props}>
      <ModalForm onClose={props.onClose} onSubmit={form.onSubmit(handleSubmit)} loading={mutation.isLoading}>
        <Stack>
          <TextInput
            {...form.getInputProps("name", {withFocus: true})}
            label={"Name"}
            required
            data-autofocus
          />
          <TagsInput
            label={type === "create" ? "Send invitations to users" : "Invite new users"}
            placeholder={"user@erdiagramly.com"}
            description={"Type and enter to add multiple users"}
            {...form.getInputProps("users")}
          />
          <Group w={"100%"} justify={"flex-end"}>
            <Tooltip label={"Delete team"}>
              <ButtonWithConfirm
                target={(
                  <Button leftSection={<IconTrash />} color={"var(--mantine-color-red-filled)"} variant={"filled"} size={"xs"}>
                    Delete
                  </Button>
                )}
                message={`Do you really want to delete ${form.values.name} team`}
                onConfirm={onDelete}
              />
            </Tooltip>
          </Group>
        </Stack>
      </ModalForm>
    </Modal>
  )
}
