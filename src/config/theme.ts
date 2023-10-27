import {ActionIcon, Button, createTheme, Tooltip} from "@mantine/core";

export const theme = createTheme({
  components: {
    Tooltip: Tooltip.extend({
      defaultProps: {
        transitionProps: {
          transition: "pop",
          duration: 300
        }
      }
    }),
    Button: Button.extend({
      defaultProps: {
        variant: "light"
      }
    }),
    ActionIcon: ActionIcon.extend({
      defaultProps: {
        variant: "light"
      }
    })
  }
})
