import {
  Box,
  Card,
  Center,
  Group,
  Image,
  Input,
  Modal,
  rem,
  SegmentedControl,
  Select, SimpleGrid,
  Stack,
  Switch,
  Text,
  Textarea,
  TextInput,
  Tooltip
} from "@mantine/core";
import {ModalForm, ModalBaseProps} from "@/components/common/Modal";
import {useForm} from "@mantine/form";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {Erd} from "@/types/data/db-model-interfaces";
import {IconInfoCircle, IconPhoto, IconPhotoX, IconUpload, IconX} from "@tabler/icons-react";
import {memo, useCallback, useMemo} from "react";
import {useTeamList, useUser} from "@/hooks";
import {erdApis} from "@/api/erd";
import {ErdNotification} from "@/screens/Library/Main/ErdModal/erd-notification";
import {createId} from "@paralleldrive/cuid2";
import {ColumnNameCases, EntityNameCases} from "@/constants/playground";
import {Dropzone, FileWithPath, IMAGE_MIME_TYPE} from "@mantine/dropzone";
import {ResourceProvider} from "@/components/common/ResourceProvider/ResourceProvider";

interface Props extends ModalBaseProps {
  data: Erd | null
}

type FormData = Omit<Erd, 'createdAt' | 'updatedAt' | 'deletedAt' | 'data'> & {
  file?: File
}

const generateDefaultFormValue = (teamId: string, userId: string): FormData => {
  return {
    id: createId(),
    name: "",
    description: "",
    isPublic: false,
    tableNameCase: "camel",
    columnNameCase: "camel",
    entityCount: 0,
    thumbnailId: null,
    teamId,
    userId,
  }
}

export const ErdModal = memo(({data, type, ...props}: Props) => {
  const { data: user } = useUser()
  const teamList = useTeamList()
  const queryClient = useQueryClient()
  const {values, setInitialValues, reset, onSubmit, getInputProps, setFieldValue} = useForm<FormData>({
    initialValues: data || generateDefaultFormValue(user.id, user.id),
  })

  const handleCleanup = useCallback(() => {
    if (!data) {
      setInitialValues(generateDefaultFormValue(user.id, user.id))
      reset()
    }
  }, [])

  const handleClose = useCallback(() => {
    handleCleanup()
    props.onClose()
  }, [handleCleanup])

  const handleMutationSuccess = () => {
    void queryClient.refetchQueries({queryKey: ['erdList']})
      .then(handleClose)
  }

  const mutation = useMutation({
    mutationFn: erdApis.mutation,
    onSuccess: handleMutationSuccess
  })


  const handleSubmit = onSubmit((erd) => {
    const formData = new FormData()

    for (const [key, value] of Object.entries(erd)) {
      if (key === "file") {
        formData.append("file", value as unknown as FileWithPath)
      } else {
        switch (typeof value) {
          case "number":
            formData.append(key, String(value))
            break
          case "boolean":
            formData.append(key, String(value))
            break
          case "string":
            formData.append(key, value)
        }
      }
    }

    switch (type) {
      case "create":
        mutation.mutate({erd: formData, type: "create"}, {
          onSuccess: ErdNotification.handleAdd,
          onError: ErdNotification.handleAddError
        })
        break
      case "update":
        mutation.mutate({erd: formData, type: "update"}, {
          onSuccess: ErdNotification.handleUpdate,
          onError: ErdNotification.handleUpdateError
        })
        break
      case "delete":
        mutation.mutate({erd: formData, type: "delete"}, {
          onSuccess: ErdNotification.handleDelete,
          onError: ErdNotification.handleDeleteError
        })
        break
    }
  })

  const handleFileDrop = useCallback((files: FileWithPath[]) => {
    const file = files[0]

    if (file) {
      setFieldValue("file", file)
    }
  }, [setFieldValue])

  const teamListOptions = useMemo(() => {
    const arr = [{id: user.id, name: "Personal", organizationRoles: [{name: "owner"}]}, ...teamList.data]
    return arr.map(team => ({
      value: team.id,
      label: team.name,
      disabled: !team.organizationRoles.some(role => ["admin", "owner"].includes(role.name))
    }))
  }, [teamList])


  return (
    <Modal {...props} size={"lg"} onClose={handleClose}>
      <ModalForm onClose={handleClose} onSubmit={handleSubmit} loading={mutation.isPending}>
        {type === "delete"
          ? <Text>Are you sure to delete {data?.name}</Text>
          : (
            <Stack>
              <Group align={"flex-start"}>
                <TextInput
                  {...getInputProps("name", {withFocus: true})}
                  label={"Name"}
                  required
                  data-autofocus
                  style={{flex: 1}}
                />
                <Tooltip hidden={type !== "update"} label={"You can't edit erd team"}>
                  <Select
                    {...getInputProps("teamId", {withFocus: true})}

                    disabled={type === "update"}
                    label={"Team"}
                    required
                    placeholder={"Select a team"}
                    data={teamListOptions}
                    checkIconPosition={"right"}
                  />
                </Tooltip>
              </Group>
              <Textarea
                {...getInputProps("description")}
                label={"Description"}
              />
              <Group gap={"xs"} align={"center"}>
                <Switch label={"Public"} labelPosition={"left"}
                        pr={0} {...getInputProps("isPublic", {type: "checkbox"})} />
                <Tooltip label={"Accessible by anyone, but users in respective team can modify it"}>
                  <IconInfoCircle size={20}/>
                </Tooltip>
              </Group>
              <Group>
                <Stack gap={0} flex={1}>
                  <Input.Label>Entity name casing</Input.Label>
                  <SegmentedControl
                    value={values.tableNameCase}
                    onChange={(v: any) => setFieldValue("tableNameCase", v)}
                    data={EntityNameCases}
                  />
                </Stack>
                <Stack gap={0} flex={1}>
                  <Input.Label>Entity column name casing</Input.Label>
                  <SegmentedControl
                    value={values.columnNameCase}
                    onChange={(v: any) => setFieldValue("columnNameCase", v)}
                    data={ColumnNameCases}
                  />
                </Stack>
              </Group>
              <Stack gap={0}>
                <Input.Label>Thumbnail</Input.Label>
                <SimpleGrid cols={{base: 1, md: 2}}>
                  <Box flex={1}>
                    <Dropzone
                      h={200}
                      styles={{
                        inner: {height: "100%"},
                      }}
                      multiple={false}
                      onDrop={handleFileDrop}
                      onReject={(files) => console.log('rejected files', files)}
                      accept={IMAGE_MIME_TYPE}
                    >
                      <Stack align="center" h={"100%"} justify="center" style={{pointerEvents: 'none'}}>
                        <Dropzone.Accept>
                          <IconUpload
                            style={{width: rem(52), height: rem(52), color: 'var(--mantine-color-blue-6)'}}
                            stroke={1.5}
                          />
                        </Dropzone.Accept>
                        <Dropzone.Reject>
                          <IconX
                            style={{width: rem(52), height: rem(52), color: 'var(--mantine-color-red-6)'}}
                            stroke={1.5}
                          />
                        </Dropzone.Reject>
                        <Dropzone.Idle>
                          <IconPhoto
                            style={{width: rem(52), height: rem(52), color: 'var(--mantine-color-dimmed)'}}
                            stroke={1.5}
                          />
                        </Dropzone.Idle>
                        <div>
                          <Text size="md" inline>
                            Drag or click to select image file
                          </Text>
                          <Text size="sm" c="dimmed" inline mt={7}>
                            File which should not exceed 1mb
                          </Text>
                        </div>
                      </Stack>
                    </Dropzone>
                  </Box>
                  <Card flex={1}  h={200} p={0}>
                    {values.file ? (
                      <Image
                        src={URL.createObjectURL(values.file)}
                        h={200}
                      />
                    ) : values.thumbnailId ? (
                      <ResourceProvider
                        name={"StaticFile"}
                        resourceId={values.thumbnailId}
                        renderer={(thumbnail) => (
                          <Image src={thumbnail.url} h={200}/>
                        )}
                      />
                    ) : (
                      <Center h={200}>
                        <IconPhotoX />
                      </Center>
                    )}
                  </Card>
                </SimpleGrid>
              </Stack>
            </Stack>
          )
        }
      </ModalForm>
    </Modal>
  )
})
