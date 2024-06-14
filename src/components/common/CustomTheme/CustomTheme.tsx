import { erdEntityTheme } from "@/config/theme";
import { MantineProvider } from "@mantine/core";
import { FC, PropsWithChildren, memo, useMemo } from "react";

interface Props extends PropsWithChildren {
  color: string
  id: string
}

export const CustomTheme: FC<Props> = memo(({id, color, children}) => {
  const theme = useMemo(() => erdEntityTheme(color), [color])

  return (
    <MantineProvider
      defaultColorScheme="dark"
      theme={theme}
      cssVariablesSelector={`#${id}`}
      getRootElement={() => document.getElementById(id) || undefined}
    >
    <div id={id}>
      {children}
    </div>
    </MantineProvider>
  )
})
