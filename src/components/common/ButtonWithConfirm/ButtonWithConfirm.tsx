import {
  Avatar,
  Button,
  Card,
  Center,
  Group,
  Popover,
  PopoverProps,
  PopoverStylesNames,
  Stack,
  Text,
  Tooltip
} from "@mantine/core";
import React, {FC, memo} from "react";
import {IconCheck, IconExclamationCircle} from "@tabler/icons-react";
import {useDisclosure} from "@mantine/hooks";
import classes from "./style.module.css"

const dangerClasses: Partial<Record<PopoverStylesNames, string>> = {
  arrow: classes.arrow,
  dropdown: classes.dropdownDanger
}

const defaultClasses: Partial<Record<PopoverStylesNames, string>> = {
  dropdown: classes.dropdown,
}

interface Props extends PopoverProps {
  target: React.ReactNode;
  message: string;
  onConfirm: () => void;
  isDanger?: boolean
  tooltip?: string
}

export const ButtonWithConfirm: FC<Props> = memo(({target, message, onConfirm, isDanger, tooltip, ...rest}) => {
  const [opened, {open, close}] = useDisclosure(false)
  const handleConfirm = () => {
    onConfirm()
    close()
  }
  return (
    <Popover
      classNames={isDanger ? dangerClasses : defaultClasses}
      withArrow
      shadow={"md"}
      withinPortal={false}
      closeOnClickOutside
      closeOnEscape
      opened={opened}
      onClose={close}
      {...rest}
    >
      <Popover.Target component={"div"}>
        <Tooltip label={tooltip} hidden={!tooltip}>
          <Center onClick={open}>{target}</Center>
        </Tooltip>
      </Popover.Target>
      <Popover.Dropdown>
        <Stack align={"center"}>
          {isDanger && (
            <Avatar color={"red"} variant={"filled"}>
              <IconExclamationCircle size={"35"}/>
            </Avatar>
          )}
          <Card bg={"var(--mantine-color-dark-5)"}>
            <Text>{message}</Text>
          </Card>
          <Group w={"100%"}>
            <Button
              onClick={close}
              style={{flex: 1}}
              size={"xs"}
              variant={"default"}
            >
              Cancel
            </Button>
            <Button
              style={{flex: 1}}
              size={"xs"}
              leftSection={<IconCheck/>}
              variant={"outline"}
              color={isDanger ? "red" : "blue"}
              onClick={handleConfirm}
            >
              Confirm
            </Button>
          </Group>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  )
})
