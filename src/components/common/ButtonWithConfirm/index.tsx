import {Avatar, Box, Button, Group, Popover, PopoverProps, Stack, Title} from "@mantine/core";
import React from "react";
import {IconCheck, IconExclamationCircle} from "@tabler/icons-react";
import {useDisclosure} from "@mantine/hooks";

interface Props extends PopoverProps {
  target: React.ReactNode;
  message: string;
  onConfirm: () => void;
  isDanger?: boolean
}

export default function ButtonWithConfirm({target, message, onConfirm, isDanger, ...rest}: Props) {
  const [opened, {open, close}] = useDisclosure(false)
  return (
    <Popover withArrow shadow={"md"} closeOnClickOutside closeOnEscape opened={opened} onClose={close} {...rest}>
      <Popover.Target>
        <Box onClick={open}>{target}</Box>
      </Popover.Target>
      <Popover.Dropdown
        style={{border: `1px solid ${isDanger ? "var(--mantine-color-red-9)" : "var(--mantine-color-dark-4)"}`}}>
        <Stack align={"center"}>
          {isDanger && (
            <Avatar color={"red"} variant={"filled"}>
              <IconExclamationCircle size={"35"}/>
            </Avatar>
          )}
          <Title order={6}>{message}</Title>
          <Group w={"100%"}>
            <Button onClick={close} style={{flex: 1}} size={"xs"} variant={"filled"} color={"dark.5"}>
              Cancel
            </Button>
            <Button style={{flex: 1}} size={"xs"} leftSection={<IconCheck/>} variant={"filled"} color={isDanger? "red": "blue"} onClick={() => {
              onConfirm()
              close()
            }}>
              Confirm
            </Button>
          </Group>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  )
}
