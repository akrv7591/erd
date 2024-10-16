import {Button, Card, Group, Input, PasswordInput, Stack, Title} from "@mantine/core";
import {useForm} from "@mantine/form";
import {PasswordUtils} from "@/utility/PasswordUtils.ts";
import {useMutation} from "@tanstack/react-query";
import {userPasswordSet} from "@/api/user.ts";
import {AxiosResponse} from "axios";
import {
  handleErrorNotification,
  handleSuccessNotification
} from "@/screens/ProfileSetting/Panel/SecurityPanel/notifications.ts";
import {AxiosApiError} from "@/types/api.ts";
// import {useLogToAuthStore} from "@/stores/useLogToAuthStore.ts";

export interface PasswordSetForm {
  password: string
  newPassword: string
  confirmPassword: string
}

const SecurityPanel = () => {
  // const user = useLogToAuthStore(state => state.user)
  const form = useForm<PasswordSetForm>({
    initialValues: {
      password: '',
      newPassword: '',
      confirmPassword: '',
    },
    validateInputOnChange: true,
    validateInputOnBlur: true,
    validate: {
      newPassword: PasswordUtils.validatePassword,
      confirmPassword: PasswordUtils.validateConfirmPassword,
    },
  })

  const mutation = useMutation<AxiosResponse, AxiosApiError, Partial<PasswordSetForm>>({
    mutationKey: ['profilePasswordSet'],
    mutationFn: userPasswordSet,
    onSuccess: handleSuccessNotification,
    onError: handleErrorNotification,
    onSettled: (_, error) => {
      if (error) {
        return
      }

      form.reset()
    }
  })

  const handleSubmit = form.onSubmit((data) => {
    const body: Partial<PasswordSetForm> = {}

    body['newPassword'] = data.newPassword
    mutation.mutate(body)
  })


  return (
    <Card withBorder px={"xl"} mt={"xl"} pt={"xl"} bg={"var(--mantine-color-dark-7)"}>
      <Title order={4}>Set your password</Title>
      <Input.Description>
        Secure your account with strong password
      </Input.Description>

      <form onSubmit={handleSubmit}>
        <Stack mt={"xl"}>
          <PasswordInput
            placeholder={"***************"}
            label={"Current password"}
            {...form.getInputProps('password')}
          />
          <Group align={"flex-start"}>
            <PasswordInput
              placeholder={"***************"}
              label={"New password"}
              flex={1}
              error={"Password should include at least 6 characters"}
              {...form.getInputProps('newPassword')}
            />
            <PasswordInput
              flex={1}
              placeholder={"***************"}
              label={"Confirm password"}
              {...form.getInputProps('confirmPassword')}
            />
          </Group>
          <Group justify={"flex-end"}>
            <Button disabled={!form.isValid()} type={"submit"} variant={"default"} miw={"200px"}>Set new
              password</Button>
          </Group>
        </Stack>
      </form>
    </Card>
  )
}

export default SecurityPanel
