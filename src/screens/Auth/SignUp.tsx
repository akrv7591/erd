import {useForm} from '@mantine/form';
import {
  Anchor,
  Button,
  Checkbox,
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
import {GoogleButton} from './GoogleButton';
import {PROJECT} from "../../constants/project";
import {erdApi} from "../../api/erdApi";
import {useMutation} from "react-query";
import {NotificationData, notifications} from "@mantine/notifications";
import httpStatus from "http-status";
import {NavigateFunction, useNavigate} from "react-router-dom";
import {AxiosResponse} from "axios";
import {Helmet} from "react-helmet-async";

interface DataProps {
  name: string,
  email: string,
  password: string
  terms: boolean
}

const createUser = (data: DataProps) => erdApi.post("/v1/auth/signup", data)
const signupSuccess = async (navigate: NavigateFunction, res: AxiosResponse) => {
  localStorage.setItem("Authorization", res.data.accessToken)
  navigate("/")
}
const signupError = async (error: any) => {
  const data: NotificationData = {
    title: "Registration error",
    message: "",
    color: "var(--mantine-color-red-filled)"
  }
  switch (error.response?.status) {
    case httpStatus.BAD_REQUEST:
      data.message = "All fields are required"
      break
    case httpStatus.CONFLICT:
      data.message = "User already exists! Please try to login"
      break
  }

  notifications.show(data)
}


export default function SignIn(props: PaperProps) {
  const navigate = useNavigate()
  const mutation = useMutation({
    mutationFn: createUser,
    onError: signupError,
    onSuccess: (res) => signupSuccess(navigate, res),
  })

  const form = useForm({
    initialValues: {
      email: '',
      name: '',
      password: '',
      terms: true,
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
        <title>Sign up</title>
      </Helmet>
      <Text size="lg" fw={500}>
        Welcome to {PROJECT.NAME}, sign-up with
      </Text>

      <Tooltip label={"Feature not implemented yet"}>
        <Group grow mb="md" mt="md">
          <GoogleButton data-disabled radius="xl">Google</GoogleButton>
        </Group>
      </Tooltip>


      <Divider label="Or continue with email" labelPosition="center" my="lg"/>
      <form onSubmit={onSubmit}>
        <Stack>
          <TextInput
            label="Name"
            required
            autoFocus
            placeholder="Your name"
            value={form.values.name}
            onChange={(event) => form.setFieldValue('name', event.currentTarget.value)}
            radius="md"
          />

          <TextInput
            required
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

          <Checkbox
            label="I accept terms and conditions"
            checked={form.values.terms}
            onChange={(event) => form.setFieldValue('terms', event.currentTarget.checked)}
          />
        </Stack>

        <Group justify="space-between" mt="xl">
          <Anchor onClick={() => navigate("..", {relative: "path"})} component="button" type="button" c="dimmed"
                  size="xs">
            Already have an account? Login
          </Anchor>
          <Button type={"submit"} radius="xl" disabled={mutation.isLoading} loading={mutation.isLoading}>
            Sign up
          </Button>
        </Group>
      </form>
    </Paper>
  );
}
