import {ActionIcon, useMantineColorScheme} from "@mantine/core";
import {IconSun, IconSunOff} from "@tabler/icons-react";

export default function ThemeToggle() {
  const {colorScheme, toggleColorScheme} = useMantineColorScheme()
  const isDark = colorScheme === "dark"

  return (
    <ActionIcon onClick={toggleColorScheme} variant={"light"}>
      {
        isDark
          ? <IconSun stroke={1}/>
          : <IconSunOff stroke={1}/>
      }
    </ActionIcon>
  )
}
