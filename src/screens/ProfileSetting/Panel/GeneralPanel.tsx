import {
  Avatar,
  Button,
  Card,
  FileButton,
  Group,
  Image,
  Indicator,
  Input,
  Stack,
  TextInput,
  Title,
  Tooltip
} from "@mantine/core";
import {Form, useForm} from "@mantine/form";
import {useAuthStore, User} from "@/stores/useAuthStore.ts";
import {IconEdit} from "@tabler/icons-react";
import {useOnMount} from "@/hooks/useOnMount.ts";
import {useMutation} from "@tanstack/react-query";
import {userProfileUpdateApi} from "@/api/user.ts";
import {notifications} from "@mantine/notifications";
import {useMemo} from "react";

interface Form extends User {
  profilePicture: File | null
}

const notificationId = "profile:setting"


const GeneralPanel = () => {
  const user = useAuthStore(state => state.user)
  console.log("USER ", user)
  const form = useForm<Form>({
    initialValues: {
      ...user,
      profilePicture: null
    },
  })

  const profileSettingMutation = useMutation({
    mutationKey: ['profileSetting'],
    mutationFn: userProfileUpdateApi,

    onSuccess: () => {
      notifications.show({
        id: notificationId,
        title: "Profile update",
        message: "Success"
      })
    },
    onError: () => {
      notifications.show({
        id: notificationId,
        title: "Profile update",
        message: "Failed! Try again",
        color: "red"
      })
    }
  })

  const handleSubmit = form.onSubmit(async (data) => {
    notifications.hide(notificationId)
    const formData = new FormData()

    formData.append("id", data.id)
    formData.append("name", data.name)

    if (data.profilePicture) {
      formData.append("profilePicture", data.profilePicture)
    }

    await profileSettingMutation.mutateAsync(formData)

    console.log("PROFILE_SETTING_DATA", data)
  })

  const isValidToUpadte = useMemo(() => {
    let isValid = false

    if (form.values.name !== user?.name) {
      isValid = true
    }

    if (form.values.profilePicture) {
      isValid = true
    }

    return isValid

  }, [form.values, user])

  useOnMount(() => {
    return () => {
      form.reset()
    }
  })

  return (
    <Card px={"xl"} mt={"xl"} bg={"transparent"} withBorder>
      <form onSubmit={handleSubmit}>
        <Stack align={"center"}>
          <Group justify={"space-between"} w={"100%"}>
            <Stack gap={0}>
              <Title order={4}>Profile picture</Title>
              <Input.Description>
                Click to update profile picture
              </Input.Description>
              <Input.Description>
                Recommended to use square picture
              </Input.Description>
            </Stack>
            <FileButton onChange={(file) => form.setValues({"profilePicture": file})} accept={"image/png,image/jpeg"}>
              {props => (
                <Indicator
                  label={(
                    <IconEdit size={15}/>
                  )}
                  position={"top-end"}
                  color={"var(--mantine-color-dark-6)"}
                  withBorder
                  offset={10}
                  size={30}
                >
                  <Avatar size={150} {...props}>
                    <Image
                      src={form.values.profilePicture
                        ? URL.createObjectURL(form.values.profilePicture)
                        : user.profile.image?.url
                      }
                      alt={"profile-picture"}
                    />
                  </Avatar>
                </Indicator>
              )}
            </FileButton>
          </Group>

          <Group w={"100%"} align={"flex-end"}>
            <TextInput
              label={"Name"}
              description={"It is your display name"}
              flex={1}
              {...form.getInputProps("name")}
            />
            <TextInput
              disabled
              label={"Email"}
              flex={1}
              {...form.getInputProps("email")}
            />
          </Group>
          <Group justify={"flex-end"} w={"100%"}>
            <Tooltip position={"top"} label={isValidToUpadte ? "Save changes" : "No changes detected"}>
              <Button
                disabled={!isValidToUpadte}
                loading={profileSettingMutation.isPending}
                type={"submit"}
                variant={"default"}
                miw={"150px"}
              >
                Save
              </Button>
            </Tooltip>
          </Group>
        </Stack>
      </form>
    </Card>
  )
}

export default GeneralPanel
