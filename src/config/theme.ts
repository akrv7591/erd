import {createTheme, Tooltip} from "@mantine/core";

export const theme = createTheme({
  components: {
    Tooltip: Tooltip.extend({
      defaultProps: {
        transitionProps: {
          transition: "pop",
          duration: 300
        }
      }
    })
  }
})
