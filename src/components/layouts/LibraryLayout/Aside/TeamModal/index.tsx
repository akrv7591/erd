import {ModalBaseProps} from "../../../../common/ModalBase";
import {ITeam} from "../../../../../types/data/team";
import {useForm} from "@mantine/form";
import {Modal, Stack, TagsInput, Text, TextInput} from "@mantine/core";
import ModalForm from "../../../../common/ModalForm";
import {useMutation, useQueryClient} from "react-query";
import erdApi from "../../../../../api/erdApi.tsx";
import {notifications} from "@mantine/notifications";
import httpStatus from "http-status";

interface Props extends ModalBaseProps {
  data?: ITeam
}

const mutationFn = (data: ITeam) => erdApi.put<ITeam>("/v1/team", data)

export default function TeamModal({onSubmit, data, type, ...props}: Props) {
  const queryClient = useQueryClient()
  const form = useForm({
    initialValues: {
      name: "",
      users: [],
      ...data && {
        ...data,
        users: data.users.map(user => user.email)
      }
    }
  })
  const mutation = useMutation({
    mutationFn,
  })

  const handleSubmit = async (data: any) => {
    await mutation.mutate(data, {
      onSuccess: async (res) => {
        const created = res.status === httpStatus.CREATED
        notifications.show({
          title: created ? "Created" : "Modified",
          message: `${data.name} team ${created ? "updated" : "created"} successfully`
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
              <TagsInput
                label={type === "create"? "Send invitations to users": "Invite new users"}
                placeholder={"user@erdiagramly.com"}
                description={"Type and enter to add multiple users"}
                {...form.getInputProps("users")}
              />
            </Stack>
          )
        }

      </ModalForm>
    </Modal>
  )
}
