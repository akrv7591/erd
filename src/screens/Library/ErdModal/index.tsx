import {ActionIcon, InputLabel, Modal, Stack, Switch, Text, Textarea, TextInput} from "@mantine/core";
import {ModalBaseProps} from "../../../components/common/ModalBase";
import ModalForm from "../../../components/common/ModalForm";
import {useForm} from "@mantine/form";
import {useMutation, useQuery, useQueryClient} from "react-query";
import erdApi from "../../../api/erdApi.tsx";
import {notifications} from "@mantine/notifications";
import {IErd} from "../../../types/data/erd";
import {IconMail, IconPlus} from "@tabler/icons-react";
import React from "react";
import UserWithPermissions from "./UserWithPermissions.tsx";

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

const loadErdWithUsers = (erdId: string | undefined) => erdApi.get(`/v1/erd/${erdId}`).then(res => res.data)

export default function ErdModal({onSubmit, data, type, ...props}: Props) {
  const form = useForm<IErd>({
    initialValues: data
  })
  const userListQuery = useQuery({
    queryKey: [data?.id],
    queryFn: (param) => loadErdWithUsers(param.queryKey[0]),
    onSuccess: (data) => {
      form.setValues(data)
      form.resetDirty(data)
    }
  })

  const [newEmail, setNewEmail] = React.useState("")
  const queryClient = useQueryClient()
  const mutation = useMutation({mutationFn: ({data, type}: IErdMutationData) => erdMutationFn(data, type)})

  if (!form.values.users || userListQuery.isLoading) return null

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

  const handleUserAdd = () => {
    form.insertListItem("users", {
      email: newEmail,
      name: "",
      emailVerified: null,
      UserErd: {
        canRead: true,
        canWrite: false,
        canDelete: false,
        isAdmin: false
      }
    })

    setNewEmail("")
  }
  return (
    <Modal {...props} size={"xl"}>
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
              <Textarea
                {...form.getInputProps("description")}
                label={"Description"}
              />
              <Switch label={"Public"} {...form.getInputProps("isPublic", {type: "checkbox"})} />
              <InputLabel>
                Users
              </InputLabel>
              {form.values.users!.map((user, i) => <UserWithPermissions form={form} user={user} i={i} key={user.email}/>)}
              <TextInput
                placeholder={"erdiagramly@mail.com"}
                type={"email"}
                data-autofocus
                leftSection={<IconMail/>}
                value={newEmail}
                onChange={e => setNewEmail(e.target.value)}
                rightSection={(
                  <ActionIcon onClick={handleUserAdd}>
                    <IconPlus/>
                  </ActionIcon>
                )}/>
            </Stack>
          )
        }
      </ModalForm>
    </Modal>
  )
}
