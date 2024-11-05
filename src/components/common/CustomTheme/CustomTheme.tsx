import {erdEntityTheme} from "@/config/theme";
import {MantineProvider} from "@mantine/core";
import {FC, memo, PropsWithChildren} from "react";

interface Props extends PropsWithChildren {
  color: string
  id: string
}

export const CustomTheme: FC<Props> = memo(({id, color, children}) => {
  const theme = erdEntityTheme(color)

  return (
    <MantineProvider
      defaultColorScheme="dark"
      theme={theme}
      cssVariablesSelector={`#custom-theme-${id}`}
      withCssVariables={true}
      getRootElement={() => document.getElementById("custom-theme-" + id) || undefined}
    >
      <div id={"custom-theme-" + id}>
        {children}
      </div>
    </MantineProvider>
  )
})
