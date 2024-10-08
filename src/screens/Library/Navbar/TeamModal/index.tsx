import {ModalBaseProps} from "@/components/common/ModalBase";
import {Button, Group, Modal, Stack, TextInput} from "@mantine/core";
import ModalForm from "@/components/common/ModalForm";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import erdApi from "@/api/erdApi.ts";
import {notifications} from "@mantine/notifications";
import {IconTrash} from "@tabler/icons-react";
import ButtonWithConfirm from "@/components/common/ButtonWithConfirm";
import {TeamFormProvider, useTeamForm} from "@/contexts/forms/TeamFormContext.ts";
import {UserList} from "@/screens/Library/Navbar/TeamModal/UserList";
import {memo, useCallback, useEffect} from "react";
import {createId} from "@paralleldrive/cuid2";
import {ITeam} from "@/types/data/db-model-interfaces.ts";

interface Props extends ModalBaseProps {
  data: ITeam | null
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

const getFormInitialValues = (data: Props['data']) => {
  return data ? data : {
    id: createId(),
    name: "",
  } as ITeam
}

const TeamModal = memo(({onSubmit, data, type, ...props}: Props) => {
  const queryClient = useQueryClient()

  const form = useTeamForm({
    initialValues: getFormInitialValues(data),
    mode: "controlled"
  })
  const mutation = useMutation({
    mutationFn: teamMutationFn,
  })

  const formReset = useCallback(() => {
    form.setInitialValues(getFormInitialValues(null))
    form.reset()
  }, [form])

  useEffect(() => {
    if (data) {
      console.log("RESETING FORM DIRTY")
      form.setValues(data)
    }
  }, [data])

  const handleSubmit = async (data: any) => {
    switch (type) {
      case "create":
        mutation.mutate({data, type: "put"}, {
          onSuccess: async (res) => {
            notifications.show({
              title: "Created",
              message: `${data.name} team created successfully ${res.status}`
            })

            await queryClient.refetchQueries({
              queryKey: ["teamList"]
            })
            formReset()
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
              queryKey: ["teamList"]
            })
            formReset()
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
          queryKey: ["teamList"]
        })
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
        <ModalForm onClose={props.onClose} onSubmit={form.onSubmit(handleSubmit)} loading={mutation.isPending}>
          <Stack>
            <TextInput
              {...form.getInputProps("name", {withFocus: true})}
              label={"Name"}
              required
              data-autofocus
            />
            <UserList teamId={form.values.id}/>
            <Group w={"100%"} justify={"flex-end"}>
              <ButtonWithConfirm
                tooltip={"Delete team"}
                target={(
                  <Button
                    leftSection={<IconTrash/>}
                    color={"var(--mantine-color-red-filled)"}
                    variant={"filled"}
                    size={"xs"}
                  >
                    Delete
                  </Button>
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
})

export default TeamModal
