import {Modal, Stack, TextInput} from "@mantine/core";
import {ModalForm, ModalBaseProps} from "@/components/common/Modal";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {UserList} from "./UserList";
import {memo, useCallback, useMemo, useState} from "react";
import {UserTeam} from "@/types/log-to/user-team";
import {useForm} from "@mantine/form";
import {UserTeamProvider} from "@/providers/UserTeamProvider";
import {TeamApi} from "@/api/logto/team";
import {TeamDeleteButton} from "./TeamDeleteButton";
import {TeamNotification} from "./team-notification";

interface Props extends ModalBaseProps {
  team: UserTeam | null
}

const getFormInitialValues = (data: Props['team']): UserTeam => {
  if (data) {
    if (data.description === null) {
      data.description = ""
    }
  }
  return data ? data : {
    name: "",
    description: ""
  } as UserTeam
}

export const TeamModal = memo(({onSubmit, team, type, ...props}: Props) => {
  const queryClient = useQueryClient()
  const [isCreate, setIsCreate] = useState(!team)

  const form = useForm({
    initialValues: getFormInitialValues(team),
    mode: "controlled"
  })

  const {values, reset, resetTouched} = form

  const mutation = useMutation({
    mutationFn: TeamApi.teamMutation,
    onSuccess: data => {
      form.setValues({
        ...data,
        description: data.description || ""
      })
      setIsCreate(false)
      void queryClient.refetchQueries({
        queryKey: ["teams"]
      })
    }
  })

  const handleClose = useCallback(() => {
    if (!team) {
      reset()
      setIsCreate(true)
    } else {
      resetTouched()
    }
    props.onClose()
  }, [team])

  const handleSubmit = useCallback((team: any) => {
    switch (type) {
      case "create":
        mutation.mutate({team, type: "create"}, {
          onSuccess: TeamNotification.handleAdd,
          onError: TeamNotification.handleAddError
        })
        break
      case "update":
        mutation.mutate({team, type: "update"}, {
          onSuccess: TeamNotification.handleUpdate,
          onError: TeamNotification.handleUpdateError
        })
        break
    }
  }, [mutation.mutate])

  const handleDelete = useCallback(() => {
    mutation.mutate({team: values, type: "delete"}, {
      onSuccess: TeamNotification.handleDelete,
      onError: TeamNotification.handleDeleteError
    })
  }, [values])

  const content = useMemo(() => (
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
      {values.id && (
        <UserList/>
      )}
      {values.id && (
        <TeamDeleteButton onDelete={handleDelete}/>
      )}
    </Stack>
  ), [values])

  return (
    <Modal size={"600px"} {...props} onClose={handleClose}>
      <ModalForm
        onClose={handleClose}
        onSubmit={form.onSubmit(handleSubmit)}
        loading={mutation.isPending}
      >
        {isCreate ? (
          content
        ) : values.id && (
          <UserTeamProvider userTeam={{...form.values}}>
            {content}
          </UserTeamProvider>
        )}
      </ModalForm>
    </Modal>
  )
})
