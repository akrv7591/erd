import {useForm} from '@mantine/form';
import {
  ActionIcon,
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
import {GoogleButton} from '../GoogleButton.tsx';
import {PROJECT} from "@/constants/project.ts";
import erdApi from "@/api/erdApi.ts";
import {useMutation} from "@tanstack/react-query";
import {NotificationData, notifications} from "@mantine/notifications";
import httpStatus from "http-status";
import {NavigateFunction, useNavigate} from "react-router-dom";
import {AxiosResponse} from "axios";
import {Helmet} from "react-helmet-async";
import StorageUtils from "@/utility/StorageUtils.ts";
import {IconInfoSmall} from "@tabler/icons-react";

interface DataProps {
  name: string,
  email: string,
  password: string
  terms: boolean
}

const createUser = (data: DataProps) => erdApi.post("/v1/auth/signup", data)
const signupSuccess = async (navigate: NavigateFunction, res: AxiosResponse) => {
  StorageUtils.setAuthorization(res.data.accessToken)
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


export default function Signup(props: PaperProps) {
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

      <Tooltip label={"Sign up with google account"}>
        <Group grow mb="md" mt="md">
          <GoogleButton radius="xl">Google</GoogleButton>
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

          <Group>
            <Checkbox
              label="I accept terms and conditions"
              checked={form.values.terms}
              onChange={(event) => form.setFieldValue('terms', event.currentTarget.checked)}
            />
            <ActionIcon component={"a"} href={"/terms"} target={"_blank"} radius={"xl"} variant={"default"} size={"sm"}>
              <IconInfoSmall/>
            </ActionIcon>
          </Group>
        </Stack>

        <Group justify="space-between" mt="xl">
          <Anchor
            onClick={() => navigate("..", {relative: "path"})}
            component="button"
            type="button"
            c="dimmed"
            size="xs"
          >
            Already have an account? Login
          </Anchor>
          <Button type={"submit"} radius="xl" disabled={mutation.isPending} loading={mutation.isPending}>
            Sign up
          </Button>
        </Group>
      </form>
    </Paper>
  );
}
