import {useForm} from '@mantine/form';
import {
  Anchor,
  Button,
  Divider,
  Group,
  Paper,
  PaperProps,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Tooltip,
} from '@mantine/core';
import {GoogleButton} from '../GoogleButton.tsx';
import {PROJECT} from "@/constants/project.ts";
import {useMutation} from "react-query";
import {notifications} from "@mantine/notifications";
import {useLocation, useNavigate} from "react-router-dom";
import {useAuthStore} from "@/stores/useAuthStore.ts";
import {Helmet} from 'react-helmet-async';
import {useOnMount} from "@/hooks/useOnMount.ts";
import StorageUtils from "@/utility/StorageUtils.ts";
import {signingError, signingSuccess, signInUser} from "@/screens/Auth/Signin/constants.ts";


export default function Signin (props: PaperProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const init = useAuthStore(state => state.init)
  const mutation = useMutation({
    mutationFn: signInUser,
    onError: () => {
      form.reset()
      signingError()
    },
    onSuccess: async (res) => {
      StorageUtils.setAuthorization(res.data.accessToken)
      signingSuccess()
      init()
    },
  })

  useOnMount(() => {
    if (location.state?.alert) {
      notifications.show(location.state.alert)
    }
  })

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      password: (val) => (val.length <= 6 ? 'Password should include at least 6 characters' : null),
    },
  });


  const onSubmit = form.onSubmit(data => mutation.mutate(data))


  return (
    <Paper radius="md" p="xl" withBorder {...props}>
      <Helmet>
        <title>Sign in</title>
      </Helmet>
      <Text size="lg" fw={500}>
        Welcome to {PROJECT.NAME}, sign-in with
      </Text>

      <Tooltip label={"Sign in with google"}>
        <Group grow mb="md" mt="md">
          <GoogleButton radius="xl">Google</GoogleButton>
        </Group>
      </Tooltip>


      <Divider label="Or continue with email" labelPosition="center" my="lg"/>
      <form onSubmit={onSubmit}>
        <Stack>
          <TextInput
            required
            autoFocus
            label="Email"
            placeholder={`hello@${PROJECT.NAME.toLowerCase()}.dev`}
            value={form.values.email}
            onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
            error={form.errors.email && 'Invalid email'}
            radius="md"
          />

          <PasswordInput
            required
            label="Password"
            placeholder="Your password"
            value={form.values.password}
            onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
            error={form.errors.password && 'Password should include at least 6 characters'}
            radius="md"
          />
        </Stack>

        <Group justify="space-between" mt="xl">
          <Anchor onClick={() => (navigate("sign-up"))} component="button" type="button" c="dimmed" size="xs">
            Don't have an account? Register
          </Anchor>
          <Button type={"submit"} radius="xl" disabled={mutation.isLoading} loading={mutation.isLoading}>
            Login
          </Button>
        </Group>
      </form>
    </Paper>
  );
}
