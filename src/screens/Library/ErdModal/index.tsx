import {Modal, Stack, Text, TextInput} from "@mantine/core";
import {ModalBaseProps} from "../../../components/common/ModalBase";
import ModalForm from "../../../components/common/ModalForm";
import {useForm} from "@mantine/form";
import {useMutation, useQueryClient} from "react-query";
import erdApi from "../../../api/erdApi.tsx";
import {notifications} from "@mantine/notifications";
import {IErd} from "../../../types/data/erd";

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

export default function ErdModal({onSubmit, data, type, ...props}: Props) {
  const form = useForm({
    initialValues: {
      name: "",
      description: "",
      ...data && {
        ...data
      }
    }
  })
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: ({data, type}: IErdMutationData) => erdMutationFn(data, type),
  })

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
        mutation.mutate({data, type: "put"}, {
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
    <Modal {...props}>
      <ModalForm onClose={props.onClose} onSubmit={form.onSubmit(handleSubmit)} loading={mutation.isLoading}>
        {type === "delete"
          ? <Text>Are you sure to delete {data?.name}</Text>
          : (
            <Stack>
              <TextInput
                {...form.getInputProps("name", {withFocus: true})}
                label={"Name"}
                required
                data-autofocus
              />
              <TextInput
                {...form.getInputProps("description")}
                label={"Description"}
              />
            </Stack>
          )
        }
      </ModalForm>
    </Modal>
  )
}
