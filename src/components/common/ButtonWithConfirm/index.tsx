import {Button, Menu, Stack, Text} from "@mantine/core";
import React from "react";

interface Props {
  target: React.ReactNode;
  message: string
  onConfirm: () => void
}

export default function ButtonWithConfirm ({target, message, onConfirm}: Props) {
  return (
    <Menu shadow={"md"}>
      <Menu.Target>
        {target}
      </Menu.Target>
      <Menu.Dropdown >
        <Stack p={"lg"}>
          <Text>{message}</Text>
          <Button color={"red"} onClick={onConfirm}>
            Confirm
          </Button>
        </Stack>
      </Menu.Dropdown>
    </Menu>
  )
}
