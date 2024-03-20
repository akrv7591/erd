import {ActionIcon, Button, createTheme, Input, MantineColorsTuple, Pagination, Tooltip} from "@mantine/core";
import {generateColors} from "@/utility/ColorGenerator.ts";

const customDark: MantineColorsTuple = [
  "#C1C2C5",
  "#A6A7AB",
  "#909296",
  "#5C5F66",
  "#373A40",
  "#2C2E33",
  "#25262B",
  "#1A1B1E",
  "#141517",
  "#101113",
]


export const theme = createTheme({
  colors: {
    "dark": customDark
  },
  components: {
    Tooltip: Tooltip.extend({
      defaultProps: {
        withArrow: true,
        transitionProps: {
          transition: "fade",
          duration: 100
        }
      }
    }),
    Button: Button.extend({
      defaultProps: {
        variant: "light",
        style: {
          border: "none"
        }
      }
    }),
    ActionIcon: ActionIcon.extend({
      defaultProps: {
        variant: "light",
        size: 40,
        style: {
          border: "none"
        }
      },
    }),
    Pagination: Pagination.extend({
      defaultProps: {
        color: "default"
      }
    })
  }
})


export const erdEntityTheme = (color: string) => {
  const myColors = generateColors(color)
  const colorName = color.split("#")[1]

  return createTheme({
    primaryColor: colorName,
    colors: {
      [colorName]: myColors,
      dark: customDark
    },

    components: {
      Input: Input.extend({
        defaultProps: {
          size: "lg",
          fs: "30px"
        }
      }),
    }
  })
}
